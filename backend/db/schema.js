const { sql } = require("drizzle-orm");
const { int, integer, sqliteTable, text } = require("drizzle-orm/sqlite-core");

const mediaTable = sqliteTable("medias", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  filename: text().notNull(),
  type: text().notNull(),
  filetype: text().notNull(),
  fileSize: int().notNull(),
  thumbnail: text(),
  album_id: int(),
  is_favorite: integer({ mode: "boolean" }).default(false),
  created_at: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  updated_at: text(),
  delete_at: text(),
});

const albumTable = sqliteTable("albums", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text().notNull(),
  cover: text(),
  created_at: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  updated_at: text(),
  delete_at: text(),
});

module.exports = {
  mediaTable,
  albumTable,
};
