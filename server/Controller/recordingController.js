const Recording =
  require("../Models/Recording.js");

// ======================================
// SAVE RECORDING
// ======================================

const saveRecording =
  async (req, res) => {

    try {

      const {
        caller,
        receiver
      } = req.body;

      // uploaded file name
      const recordingUrl =
        `/uploads/${req.file.filename}`;

      const newRecording =
        new Recording({

          caller,

          receiver,

          recordingUrl

        });

      await newRecording.save();

      res.status(201).json({
        message:
          "Recording saved",
        newRecording
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };

// ======================================
// GET RECORDINGS
// ======================================

const getRecordings =
  async (req, res) => {

    try {

      const { email } = req.query;

      const recordings =
        await Recording.find({

          $or: [

            { caller: email },

            { receiver: email }

          ]

        });

      res.json(recordings);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };

// ======================================
// DELETE RECORDING
// ======================================

const deleteRecording =
  async (req, res) => {

    try {

      await Recording.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Recording deleted"
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };

module.exports = {

  saveRecording,

  getRecordings,

  deleteRecording

};