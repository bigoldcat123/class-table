// import { int, sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// import { varchar } from "drizzle-orm/mysql-core";
import { boolean, date, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";


export const classMark = pgTable("classMark", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    finishDate: date({mode:'date'}).notNull(),
    class_and_room: text().notNull(),
    name: text().notNull(),
    order: integer().notNull(),
    week: integer().notNull(),      // 1~7，7 表示自习
});
type x = typeof classMark.$inferInsert;
export const classTable = pgTable("classTable", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    class_and_room: text().notNull(),
    week: integer().notNull(), // 1~7 表示周几
    order: integer().notNull(), // 1~6 表示节次
});

export const tempClassTable = pgTable("tempClassTable", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    class_and_room: text().notNull(),
    week: integer().notNull(),      // 1~7，7 表示自习
    order: integer().notNull(),     // 1~7
    type: boolean().notNull(),      // true 为新增，false 为删除
    execDate: date({mode:'date'}).notNull(),     // 执行时间
});