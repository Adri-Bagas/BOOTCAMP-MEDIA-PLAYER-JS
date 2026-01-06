var express = require("express");
const { albumTable, mediaTable } = require("../db/schema");
const multer = require("multer");
const { db } = require("../db");
const { and } = require("drizzle-orm");
const { like } = require("drizzle-orm");
const { isNull } = require("drizzle-orm");
const { desc } = require("drizzle-orm");
const { asc } = require("drizzle-orm");
const { sql } = require("drizzle-orm");
const { eq } = require("drizzle-orm");
const path = require("path");
const fs = require("fs");
var router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/uploads/covers");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname).toLowerCase()
    );
  },
});

const upload = multer({ storage });

const sortByAlias = Object.freeze({
  media_name: albumTable.name,
  media_size: albumTable.size,
  uploded: albumTable.updated_at,
});

/* GET all album. */
router.get("/", async function (req, res, next) {
  const searchTerm = req.query.search;

  const sort = req.query.sort;
  const sort_by = req.query.sort_by;

  const result = await db
    .select()
    .from(albumTable)
    .where(
      and(
        searchTerm ? like(albumTable.name, "%%") : undefined,
        isNull(albumTable.delete_at)
      )
    )
    .orderBy(
      sort == "desc"
        ? desc(sort_by ? sortByAlias[sort_by] : albumTable.updated_at)
        : asc(sort_by ? sortByAlias[sort_by] : albumTable.updated_at)
    );

  res.status(200).json({
    message: "Album berhasil di ambil!",
    success: true,
    data: result,
  });
});

router.get("/selection", async function (req, res, next) {
  const result = await db
    .select({
      id: albumTable.id,
      name: albumTable.name,
    })
    .from(albumTable)
    .where(isNull(albumTable.delete_at));

  res.status(200).json({
    message: "Album berhasil di ambil!",
    success: true,
    data: result,
  });
});

router.post(
  "/",
  upload.fields([{ name: "cover", maxCount: 1 }]),
  async function (req, res, next) {
    try {
      const coverFile = req.files["cover"]?.[0];

      let finalCoverName = coverFile ? coverFile.filename : null;

      const [inserted] = await db
        .insert(albumTable)
        .values({
          name: req.body.name,
          description: req.body.description,
          cover: finalCoverName,
          updated_at: sql`(current_timestamp)`,
        })
        .returning();

      res.status(201).json({
        success: true,
        data: inserted,
      });
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ success: false, message: error.toString() });
    }
  }
);

router.get("/show/:id", async function (req, res, next) {
  const id = req.params.id;

  const result = await db
    .select()
    .from(albumTable)
    .where(and(eq(albumTable.id, id), isNull(albumTable.delete_at)));

  if (result.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Album tidak ditemukan!",
    });
  }

  const albumData = result[0];

  const medias = await db
    .select()
    .from(mediaTable)
    .where(and(eq(mediaTable.album_id, id), isNull(mediaTable.delete_at)));

  res.status(200).json({
    message: "Album berhasil di ambil!",
    success: true,
    data: {
      ...albumData,
      media: medias,
    },
  });
});

router.get("/get/cover/:id", async function (req, res, next) {
  const id = req.params.id;

  const [result] = await db
    .select()
    .from(albumTable)
    .where(eq(albumTable.id, id));

  if (!result.cover) {
    return res.status(404).send("Album tidak mempunyai cover");
  }

  let filePath = path.join(
    process.cwd(),
    "storage/uploads/covers",
    result.cover
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File fisik tidak ditemukan di folder storage");
  }

  res.sendFile(filePath);
});

router.patch(
  "/update/:id",
  upload.fields([{ name: "cover", maxCount: 1 }]),
  async function (req, res, next) {
    try {
      const id = req.params.id;
      const coverFile = req.files["cover"]?.[0];

      const albumData = await db
        .select()
        .from(albumTable)
        .where(and(eq(albumTable.id, id), isNull(albumTable.delete_at)));

      if (albumData.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Album tidak ditemukan!",
        });
      }

      const updateData = {
        name: req.body.name || albumData[0].name,
        description: req.body.description || albumData[0].description,
        updated_at: sql`(current_timestamp)`,
      };

      if (coverFile) {
        if (albumData[0].cover) {
          const oldFilePath = path.join(
            process.cwd(),
            "storage/uploads/covers",
            albumData[0].cover
          );

          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
            console.log(`Deleted old cover: ${albumData[0].cover}`);
          }
        }

        updateData.cover = coverFile.filename;
      }

      const result = await db
        .update(albumTable)
        .set(updateData)
        .where(eq(albumTable.id, id))
        .returning();

      res.status(200).json({
        success: true,
        message: "Album berhasil diupdate",
        data: result[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Gagal update album!",
      });
    }
  }
);

module.exports = router;
