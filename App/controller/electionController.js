const Election = require("../models/electionModel");

const createElection = async (req, res) => {
  try {
    const { title, description, date, duration, conductedBy, image } = req.body;

    if (!title || !description || !date || !duration || !conductedBy || !image) {
      return res.status(400).send({ message: "All the inputs are required." });
    }

    const newElection = new Election({
      title,
      description,
      date,
      duration,
      conductedBy,
      image,
    });

    await newElection.save();

    res.send({
      message: "Election created successfully",
      election: newElection,
    });
  } catch (error) {
    res.status(500).send({ message: "InterServer Error" });
  }
};

const getElections = async (req, res) => {
  try {
    const elections = await Election.find();

    res.send({ message: "Elections fetched successfully", elections });
  } catch (error) {
    res.status(500).send({ message: "InterServer Error" });
  }
};

const getElection = async (req, res) => {
  try {
    const { id } = req.params;

    const election = await Election.findById(id);

    if (!election)
      return res.status(404).send({ message: "Election not found." });

    res.send({ message: "Election fetched successfully", election });
  } catch (error) {
    res.status(500).send({ message: "InterServer Error" });
  }
};

const updateElection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, duration, conductedBy, image, status } =
      req.body;

    if (
      !title ||
      !description ||
      !date ||
      !duration ||
      !conductedBy ||
      !image ||
      !status
    ) {
      return res.status(400).send({ message: "All the inputs are required." });
    }

    const updatedElection = await Election.findByIdAndUpdate(
      id,
      {
        title,
        description,
        date,
        duration,
        conductedBy,
        image,
        status,
      },
      { new: true }
    );

    res.send({
      message: "Election updated successfully",
      election: updatedElection,
    });
  } catch (error) {
    res.status(500).send({ message: "InterServer Error" });
  }
};

const deleteElection = async (req, res) => {
  try {
    const { id } = req.params;

    await Election.findByIdAndDelete(id);

    res.send({ message: "Election deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "InterServer Error" });
  }
};

module.exports = {
  createElection,
  getElections,
  getElection,
  updateElection,
  deleteElection,
};
