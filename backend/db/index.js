require("dotenv/config");
const { drizzle } = require("drizzle-orm/libsql");

const db = drizzle({
  connection: {
    url: process.env.DB_FILE_NAME,
  },
});

module.exports = { db };
