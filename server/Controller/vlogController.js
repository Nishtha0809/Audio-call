const Vlog = require("../Models/Vlog");

// CREATE
const createVlog = async (req, res) => {
  try {

    const vlog = await Vlog.create(req.body);

    res.status(201).json({ vlog });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
const getVlogs = async (req, res) => {
  try {

    const vlogs = await Vlog.find().sort({ createdAt: -1 });

    res.json(vlogs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deleteVlog = async (req, res) => {
  try {

    await Vlog.findByIdAndDelete(req.params.id);

    res.json({ message: "Vlog deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updateVlog = async (req, res) => {
  try {

    const updated = await Vlog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ vlog: updated });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVlog,
  getVlogs,
  deleteVlog,
  updateVlog
};