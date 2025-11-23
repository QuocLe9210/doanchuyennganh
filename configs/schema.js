import {
  pgTable,
  serial,
  varchar,
  boolean,
  json,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Bảng người dùng
export const USER_TABLE = pgTable("users", {
  id: serial().primaryKey(),
  userName: varchar().notNull(),
  email: varchar().notNull(),
  isMember: boolean().default(false),
  customerId: varchar(),
});

// Bảng khóa học
export const STUDY_ENGLISH_TABLE = pgTable("study_english", {
  id: serial().primaryKey(),
  courseID: varchar().notNull(),
  courseType: varchar().notNull(),
  topic: varchar().notNull(),
  difficultyLevel: varchar().default("Easy"),
  courseLayout: json("course_layout"),
  createdBy: varchar().notNull(),
  status: varchar().default("Generating"),
});

// Bảng ghi chú từng chương
export const CHAPTER_NOTES_TABLE = pgTable("chapter_notes", {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  chapterId: varchar().notNull(),
  note: text(),
});

// Bảng flashcards
export const FLASHCARDS_TABLE = pgTable("flashcards", {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  front: text().notNull(),
  back: text().notNull(),
  difficulty: varchar().default("medium"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Bảng theo dõi tiến độ học
export const USER_PROGRESS_TABLE = pgTable("user_progress", {
  id: serial().primaryKey(),
  userId: varchar().notNull(),
  courseId: varchar().notNull(),
  studyType: varchar().notNull(),
  itemId: varchar(),
  status: varchar().default("in-progress"),
  lastStudiedAt: timestamp("lastStudiedAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const PAYMENT_RECORDS_TABLE = pgTable("paymentRecords", {
  id: serial().primaryKey(),
  customerId: varchar().notNull(),
  sessionId: varchar().notNull(),
});
