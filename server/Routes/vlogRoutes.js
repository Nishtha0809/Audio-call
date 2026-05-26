const express = require("express");

const router = express.Router();

const {
  createVlog,
  getVlogs,
  deleteVlog,
  updateVlog
} = require("../Controller/vlogController")

router.post("/", createVlog);

router.get("/", getVlogs);

router.delete("/:id", deleteVlog);

router.put("/:id", updateVlog);

module.exports = router;