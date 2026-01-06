import { sql } from "drizzle-orm";
import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const mediaTable = sqliteTable("medias", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  filename: text().notNull(),
  type: text().notNull(),
  filetype: text().notNull(),
  thumbnail: text(),
  album_id: int(),
  is_favorite: integer({ mode: "boolean" }).default(false),
  created_at: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  updated_at: text(),
  delete_at: text(),
});

export const albumTable = sqliteTable("albums", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text().notNull(),
  cover: text().notNull(),
  created_at: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  updated_at: text(),
  delete_at: text(),
});
