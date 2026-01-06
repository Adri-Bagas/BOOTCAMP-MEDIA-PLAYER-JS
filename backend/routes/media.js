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
    } else if (file.fieldname === "image") {
      cb(null, "storage/uploads/images");
    } else if (file.fieldname === "audio") {
      cb(null, "storage/uploads/audios");
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
  media_size: mediaTable.size,
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
        ? desc(sort_by ? sortByAlias[sort_by] : mediaTable.updated_at)
        : asc(sort_by ? sortByAlias[sort_by] : mediaTable.updated_at)
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
    .where(and(eq(mediaTable.id, id), isNull(mediaTable.delete_at)));

  res.status(200).json({
    message: "Media berhasil di ambil!",
    success: true,
    data: result,
  });
});

router.get("/get/:id", async function (req, res, next) {
  const id = req.params.id;

  const [result] = await db
    .select()
    .from(mediaTable)
    .where(and(eq(mediaTable.id, id), isNull(mediaTable.delete_at)));

  const filePath = path.join(
    process.cwd(),
    `storage/uploads/${result.type}s`,
    result.filename
  );

  if (!fs.existsSync(filePath)) {
    return res
      .status(404)
      .send("File fisik tidak ditemukan di folder storage.");
  }

  res.sendFile(filePath);
});

router.get("/get/thumbnail/:id", async function (req, res, next) {
  const id = req.params.id;

  const [result] = await db
    .select()
    .from(mediaTable)
    .where(and(eq(mediaTable.id, id), isNull(mediaTable.delete_at)));

  if (!result.thumbnail && (result.type == "video" || result.type == "audio")) {
    return res.status(404).send("File tidak mempunyai thumbnail");
  }

  let filePath;

  if (result.type == "image") {
    filePath = path.join(
      process.cwd(),
      "storage/uploads/images",
      result.filename
    );
  }

  if (result.thumbnail) {
    filePath = path.join(
      process.cwd(),
      "storage/uploads/thumbnails",
      result.thumbnail
    );
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File fisik tidak ditemukan di folder storage");
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
          thumbnail: finalThumbnailName,
          type: "video",
          filetype: videoFile.mimetype,
          fileSize: videoFile.size,
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

router.post(
  "/store/image",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async function (req, res, next) {
    try {
      const imageFile = req.files["image"]?.[0];

      if (!imageFile) {
        return res
          .status(400)
          .json({ success: false, message: "Image is required" });
      }

      const [inserted] = await db
        .insert(mediaTable)
        .values({
          name: req.body.name || imageFile.originalname,
          filename: `${imageFile.filename}`,
          thumbnail: null,
          type: "image",
          filetype: imageFile.mimetype,
          fileSize: imageFile.size,
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

router.post(
  "/store/audio",
  upload.fields([{ name: "audio", maxCount: 1 }]),
  async function (req, res, next) {
    try {
      const audioFile = req.files["audio"]?.[0];

      if (!audioFile) {
        return res
          .status(400)
          .json({ success: false, message: "Audio is required" });
      }

      const [inserted] = await db
        .insert(mediaTable)
        .values({
          name: req.body.name || audioFile.originalname,
          filename: `${audioFile.filename}`,
          thumbnail: finalThumbnailName,
          type: "audio",
          filetype: audioFile.mimetype,
          fileSize: audioFile.size,
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

router.patch(
  "/update/:id",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  async function (req, res, next) {
    try {
      const id = req.params.id;
      const thumbFile = req.files["thumbnail"]?.[0];

      const mediaData = await db
        .select()
        .from(mediaTable)
        .where(and(eq(mediaTable.id, id), isNull(mediaTable.delete_at)));

      if (mediaData.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Media tidak ditemukan!",
        });
      }

      const updateData = {
        name: req.body.name || mediaData[0].name,
        album_id: req.body.album_id ? parseInt(req.body.album_id) : null,
        updated_at: sql`(current_timestamp)`,
      };

      if (thumbFile) {
        if (mediaData[0].thumbnail) {
          const oldFilePath = path.join(
            process.cwd(),
            "storage/uploads/thumbnails",
            mediaData[0].thumbnail
          );

          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
            console.log(`Deleted: ${mediaData[0].thumbnail}`);
          }
        }

        updateData.thumbnail = thumbFile.filename;
      }

      const result = await db
        .update(mediaTable)
        .set(updateData)
        .where(eq(mediaTable.id, id))
        .returning();

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Media tidak ditemukan!",
        });
      }

      res.status(200).json({
        success: true,
        message: "Media berhasil diupdate",
        data: result[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Gagal update media!",
      });
    }
  }
);

router.delete("/delete/:id", async function (req, res, next) {
  try {
    const id = req.params.id;

    const result = await db
      .update(mediaTable)
      .set({
        updated_at: sql`(current_timestamp)`,
        delete_at: sql`(current_timestamp)`,
      })
      .where(eq(mediaTable.id, id))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Media tidak ditemukan!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Media berhasil dihapus",
      data: result[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Gagal hapus media!",
    });
  }
});

router.patch("/restore/:id", async function (req, res, next) {
  try {
    const id = req.params.id;

    const result = await db
      .update(mediaTable)
      .set({
        updated_at: sql`(current_timestamp)`,
        delete_at: null,
      })
      .where(eq(mediaTable.id, id))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Media tidak ditemukan!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Media berhasil direstore",
      data: result[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Gagal restore media!",
    });
  }
});

router.delete("/purge/:id", async function (req, res, next) {
  try {
    const id = req.params.id;

    const result = await db
      .delete(mediaTable)
      .where(eq(mediaTable.id, id))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Media tidak ditemukan!",
      });
    }

    const mediaData = result[0];

    if (mediaData.thumbnail) {
      const oldThumbPath = path.join(
        process.cwd(),
        "storage/uploads/thumbnails",
        mediaData.thumbnail
      );

      if (fs.existsSync(oldThumbPath)) {
        fs.unlinkSync(oldThumbPath);
        console.log(`Deleted: ${mediaData.thumbnail}`);
      }
    }

    if (mediaData.filename) {
      const oldFilePath = path.join(
        process.cwd(),
        `storage/uploads/${mediaData.type}s`,
        mediaData.filename
      );

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log(`Deleted ${mediaData.type}: ${mediaData.filename}`);
      }
    }

    res.status(200).json({
      success: true,
      message: "Media berhasil dihapus",
      data: result[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Gagal hapus media!",
    });
  }
});

module.exports = router;
