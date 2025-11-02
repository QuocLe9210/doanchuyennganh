import { pgTable, serial, varchar, boolean, json } from "drizzle-orm/pg-core";

export const USER_TABLE = pgTable("users", {
  id: serial().primaryKey(),
  userName: varchar().notNull(),
  email: varchar().notNull(),
  isMember: boolean().default(false),
});

export const STUDY_ENGLISH_TABLE = pgTable("study_english", {
  id: serial().primaryKey(),
  courseID: varchar().notNull(),
  courseType: varchar().notNull(),
  topic: varchar().notNull(),
  difficultyLevel: varchar().default("Easy"),
  courseLayout: json("course_layout"), // Thêm tên cột
  createdBy: varchar().notNull(),
  status: varchar().default("Genarating"),
});
