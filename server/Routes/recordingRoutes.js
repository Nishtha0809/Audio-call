const express = require("express");

const multer = require("multer");

const router = express.Router();

const {

  saveRecording,

  getRecordings,

  deleteRecording

} = require(
  "../Controller/recordingController"
);

// ======================================
// MULTER STORAGE
// ======================================

const storage =
  multer.diskStorage({

    destination:
      function (req, file, cb) {

        cb(null, "uploads");

      },

    filename:
      function (req, file, cb) {

        cb(
          null,

          Date.now() +
          "-" +
          file.originalname
        );

      }

  });

const upload =
  multer({ storage });

// ======================================
// ROUTES
// ======================================

router.post(
  "/",
  upload.single("audio"),
  saveRecording
);

router.get("/", getRecordings);

router.delete(
  "/:id",
  deleteRecording
);

module.exports = router;