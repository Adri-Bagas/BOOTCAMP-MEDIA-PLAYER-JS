var express = require("express");
const { db } = require("../db");
const { mediaTable } = require("../db/schema");
const { like, sql } = require("drizzle-orm");
const { and } = require("drizzle-orm");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { asc } = require("drizzle-orm");
const { desc } = require("drizzle-orm");
const { isNull } = require("drizzle-orm");
const { eq } = require("drizzle-orm");

var router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "video") {
      cb(null, "storage/uploads/videos");
    } else if (file.fieldname === "thumbnail") {
      cb(null, "storage/uploads/thumbnails");
    } else {
      cb(null, "storage/uploads/");
    }
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
  media_name: mediaTable.name,
  media_size: mediaTable.filetype,
  uploded: mediaTable.updated_at,
});

/* GET all media. */
router.get("/", async function (req, res, next) {
  const type = req.query.type;
  const searchTerm = req.query.search;
  const sort = req.query.sort;
  const sort_by = req.query.sort_by;

  const result = await db
    .select()
    .from(mediaTable)
    .where(
      and(
        searchTerm ? like(mediaTable.name, "%%") : undefined,
        type ? eq(mediaTable.type, type) : undefined,
        isNull(mediaTable.delete_at)
      )
    )
    .orderBy(
      sort == "desc"
        ? desc(sort_by ? sortByAlias[sort_by] : mediaTable.created_at)
        : asc(sort_by ? sortByAlias[sort_by] : mediaTable.created_at)
    );

  res.status(200).json({
    message: "Media berhasil di ambil!",
    success: true,
    data: result,
  });
});

router.get("/:id", async function (req, res, next) {
  const id = req.params.id;

  const result = await db
    .select()
    .from(mediaTable)
    .where(eq(mediaTable.id, id));

  res.status(200).json({
    message: "Media berhasil di ambil!",
    success: true,
    data: result,
  });
});

router.get("/get/:id", async function (req, res, next) {

  const id = req.params.id;

  const [ result ] = await db
    .select()
    .from(mediaTable)
    .where(eq(mediaTable.id, id));

    const filePath = path.join(
      process.cwd(),
      "storage/uploads/videos",
      result.filename
    );

  if (!fs.existsSync(filePath)) {
    return res
      .status(404)
      .send("File fisik tidak ditemukan di folder storage.");
  }

  res.sendFile(filePath);
});

router.post(
  "/store/video",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async function (req, res, next) {
    try {
      const videoFile = req.files["video"]?.[0];
      const thumbFile = req.files["thumbnail"]?.[0];

      if (!videoFile) {
        return res
          .status(400)
          .json({ success: false, message: "Video is required" });
      }

      let finalThumbnailName = thumbFile ? thumbFile.filename : null;

      const [inserted] = await db
        .insert(mediaTable)
        .values({
          name: req.body.name || videoFile.originalname,
          filename: `${videoFile.filename}`,
          thumbnail: finalThumbnailName
            ? `thumbnails/${finalThumbnailName}`
            : null,
          type: "video",
          filetype: videoFile.mimetype,
          album_id: req.body.album_id ? parseInt(req.body.album_id) : null,
          updated_at: sql`(current_timestamp)`,
          is_favorite: req.body.is_favorite === "true",
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



module.exports = router;
