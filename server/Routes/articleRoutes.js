const express = require("express");

const router = express.Router();

const {
  createArticle,
  getArticles,
  deleteArticle,
  updateArticle
} = require("../Controller/articleController");

// IMPORT MIDDLEWARE
const authMiddleware = require("../middleware/authMiddleware");

// PUBLIC
router.get("/", getArticles);

// PROTECTED
router.post(
  "/",
  authMiddleware,
  createArticle
);

router.put(
  "/:id",
  authMiddleware,
  updateArticle
);

router.delete(
  "/:id",
  authMiddleware,
  deleteArticle
);

module.exports = router;