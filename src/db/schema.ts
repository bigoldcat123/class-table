import { int, sqliteTable, text, integer } from "drizzle-orm/sqlite-core";


export const classMark = sqliteTable("classMark", {
    id: int().primaryKey({ autoIncrement: true }),
    finishDate: integer({ mode: 'timestamp' }).notNull(),
    class_and_room: text().notNull(),
    name: text().notNull(),
    order: int().notNull(),
    week: int().notNull(),      // 1~7，7 表示自习
});

export const classTable = sqliteTable("classTable", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    class_and_room: text().notNull(),
    week: int().notNull(), // 1~7 表示周几
    order: int().notNull(), // 1~6 表示节次
});

export const tempClassTable = sqliteTable("tempClassTable", {
    id:int().primaryKey({autoIncrement:true}),
    name: text().notNull(),
    class_and_room: text().notNull(),
    week: int().notNull(),      // 1~7，7 表示自习
    order: int().notNull(),     // 1~7
    type: integer({ mode: 'boolean' }).notNull(),  // true 为新增，false 为删除
    execDate: integer({ mode: 'timestamp' }).notNull(), // 执行时间
});