const Article = require("../models/Article");

// CREATE
const createArticle = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    const article = await Article.create({
      title,
      description,
      image
    });

    res.status(201).json({ article });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
const getArticles = async (req, res) => {
  try {
  
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ DELETE (REAL DB DELETE)
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    await Article.findByIdAndDelete(id);

    res.json({ message: "Article deleted permanently" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✏️ UPDATE ARTICLE
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Article.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({ article: updated });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createArticle,
  getArticles,
  deleteArticle,
  updateArticle
};