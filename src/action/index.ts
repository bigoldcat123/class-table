"use server";
import { z } from "zod";
import { Coordinate, TableCellProp } from "@/components/tableCell";
import db from "@/db";
import { classMark, classTable, tempClassTable } from "@/db/schema";
import { and, desc, eq, gte, like, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getClassTable(date: Date) {
  const m_s = getWeekAround(date);

  const classes = await db.select().from(classTable);

  const tempClasses = await db
    .select()
    .from(tempClassTable)
    .where(
      and(
        gte(tempClassTable.execDate, m_s.monday),
        lte(tempClassTable.execDate, m_s.sunday),
      ),
    );

  const classMarks = await db
    .select()
    .from(classMark)
    .where(
      and(
        gte(classMark.finishDate, m_s.monday),
        lte(classMark.finishDate, m_s.sunday),
      ),
    );
  const map = new Map<string, TableCellProp>();
  classes.forEach((x) => {
    map.set(`${x.week}${x.order}`, {
      classAndRoom: x.class_and_room,
      name: x.name,
      isTemp: false,
      isFinished: false,
    });
  });
  // console.log(tempClasses);

  tempClasses.forEach((x) => {
    if (x.type) {
      // add
      map.set(`${x.week}${x.order}`, {
        classAndRoom: x.class_and_room,
        name: x.name,
        isTemp: true,
        isFinished: false,
      });
    } else {
      map.delete(`${x.week}${x.order}`);
    }
  });
  classMarks.forEach((x) => {
    const classData = map.get(`${x.week}${x.order}`)!;
    classData.isFinished = true;
    map.set(`${x.week}${x.order}`, classData as TableCellProp);
  });

  return map;
}
function getWeekAround(date: Date): { monday: Date; sunday: Date } {
  const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const diffToSunday = day === 0 ? 0 : 7 - day;

  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  const sunday = new Date(date);
  sunday.setDate(date.getDate() + diffToSunday);

  // 清除时间部分，仅保留日期（可选）
  monday.setHours(0, 0, 0, 0);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
}

const tempClassSchema = z.object({
  type: z.coerce.boolean(),
  name: z.string(),
  class_and_room: z.string(),
  week: z.number().optional(),
  order: z.coerce.number(),
  execDate: z.coerce.date(),
});

export async function addTempAction(stat: string, formData: FormData) {
  const obj = Object.fromEntries(formData);

  const temp = tempClassSchema.parse(obj);
  temp.order -= 1;
  const day = temp.execDate.getDay() == 0 ? 6 : temp.execDate.getDay() - 1;
  console.log(day);

  temp.week = day;
  const order = temp.order;
  const table = await getClassTable(temp.execDate);
  if (table.has(`${day}${order}`) && temp.type) {
    return "conflicten!" + JSON.stringify(table.get(`${day}${order}`));
  }
  await db
    .insert(tempClassTable)
    .values(temp as typeof tempClassTable.$inferSelect);
  revalidatePath("/", "page");
  return stat + "ok!";
}

export async function getTempAction() {
  const temps = await db
    .select()
    .from(tempClassTable)
    .orderBy(desc(tempClassTable.execDate));
  return temps;
}
export async function deleteTempAction(id: number) {
  const res = await db.delete(tempClassTable).where(eq(tempClassTable.id, id));
  revalidatePath("/temp");
}

export async function markAsFinishedAction({
  clazz,
  coordinate,
}: {
  coordinate: {
    week: number;
    order: number;
  };
  clazz: TableCellProp;
}) {
  if (clazz.isFinished) {
    return;
  }
  const mark: typeof classMark.$inferInsert = {
    class_and_room: clazz.classAndRoom,
    finishDate: new Date(),
    name: clazz.name,
    order: coordinate.order,
    week: coordinate.week,
  };
  await db.insert(classMark).values(mark);
  revalidatePath("/");
}
const getJobMarkActionQuery = z.object({
  name: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
export type GetJobMarkActionQuery = z.infer<typeof getJobMarkActionQuery>;

export async function getJobMarkAction(
  query: { name?: string; startDate?: string; endDate?: string } = {
    name: undefined,
    startDate: undefined,
    endDate: undefined,
  },
) {
  const queryParsed = getJobMarkActionQuery.parse(query);

  if (queryParsed.endDate) {
    queryParsed.endDate.setHours(23, 59, 59, 999);
  }
  if (queryParsed.startDate) {
    queryParsed.startDate.setHours(0, 0, 0, 0);
  }

  const marks = await db
    .select()
    .from(classMark)
    .orderBy(desc(classMark.finishDate))
    .where(
      and(
        queryParsed.name
          ? like(classMark.name, `%${queryParsed.name}%`)
          : undefined,
        queryParsed.startDate
          ? gte(classMark.finishDate, queryParsed.startDate)
          : undefined,
        queryParsed.endDate
          ? lte(classMark.finishDate, queryParsed.endDate)
          : undefined,
      ),
    );
  return marks;
}

export type TableCellPropActionFrom = {
  tableCell: TableCellProp;
  coordinate: Coordinate;
};
export type TableCellPropActionTo = {
  tableCell?: TableCellProp;
  coordinate: Coordinate;
};
export async function swicthAction(
  from: TableCellPropActionFrom,
  to: TableCellPropActionTo,
) {
  const { monday } = getWeekAround(new Date());
  const dayToDelFrom = new Date(monday);
  const dayToAddFrom = new Date(monday);

  dayToDelFrom.setDate(monday.getDate() + from.coordinate.week);
  dayToAddFrom.setDate(monday.getDate() + to.coordinate.week);
  const tempDelFrom: typeof tempClassTable.$inferInsert = {
    execDate: dayToDelFrom,
    name: "change",
    class_and_room: "change",
    week: from.coordinate.week,
    order: from.coordinate.order,
    type: false,
  };
  const tempAddFrom: typeof tempClassTable.$inferInsert = {
    execDate: dayToAddFrom,
    name: from.tableCell.name,
    class_and_room: from.tableCell.classAndRoom,
    week: to.coordinate.week,
    order: to.coordinate.order,
    type: true,
  };
  if (to.tableCell) {
    // switch
    const dayToDelTo = new Date(monday);
    const dayToAddTo = new Date(monday);

    dayToDelTo.setDate(monday.getDate() + to.coordinate.week);
    dayToAddTo.setDate(monday.getDate() + from.coordinate.week);

    const tempDelTo: typeof tempClassTable.$inferInsert = {
      execDate: dayToDelTo,
      name: "switch",
      class_and_room: "switch",
      week: to.coordinate.week,
      order: to.coordinate.order,
      type: false,
    };
    const tempAddTo: typeof tempClassTable.$inferInsert = {
      execDate: dayToAddTo,
      name: to.tableCell.name,
      class_and_room: to.tableCell.classAndRoom,
      week: from.coordinate.week,
      order: from.coordinate.order,
      type: true,
    };
    await db
      .insert(tempClassTable)
      .values([tempDelFrom, tempDelTo, tempAddFrom, tempAddTo]);
  } else {
    // just change

    await db.insert(tempClassTable).values([tempDelFrom, tempAddFrom]);
  }
  revalidatePath("/");
}
