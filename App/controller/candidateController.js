const Candidate = require("../models/candidateModel");

const createCandidate = async (req, res) => {
	try {
		const { full_name, details, image, election } = req.body;

		if (!full_name || !details || !image || !election) {
			return res
				.status(400)
				.send({ message: "All the inputs are required." });
		}

		const newCandidate = new Candidate({
			full_name,
			details,
			image,
			election,
		});

		await newCandidate.save();

		res.send({
			message: "Candidate created successfully",
			candidate: newCandidate,
		});
	} catch (error) {
		res.status(500).send({ message: "InterServer Error" });
	}
};

const getCandidates = async (req, res) => {
	try {
		const candidates = await Candidate.find().populate("election");
		res.status(200).send({
			message: "Candidates fetched successfully",
			candidates,
		});
	} catch (error) {
		console.error("Error fetching candidates:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};

const getCandidate = async (req, res) => {
	try {
		const { id } = req.params;

		const candidate = await Candidate.findById(id);

		if (!candidate)
			return res.status(404).send({ message: "Candidate not found." });

		res.send({ message: "Candidate fetched successfully", candidate });
	} catch (error) {
		res.status(500).send({ message: "InterServer Error" });
	}
};

const updateCandidate = async (req, res) => {
	try {
		const { id } = req.params;
		const { full_name, details, image, election } = req.body;

		if (!full_name || !details || !image || !election) {
			return res
				.status(400)
				.send({ message: "All the inputs are required." });
		}

		const updatedCandidate = await Candidate.findByIdAndUpdate(
			id,
			{
				full_name,
				details,
				image,
				election,
			},
			{ new: true }
		);

		res.send({
			message: "Candidate updated successfully",
			candidate: updatedCandidate,
		});
	} catch (error) {
		res.status(500).send({ message: "InterServer Error" });
	}
};

const deleteCandidate = async (req, res) => {
	try {
		const { id } = req.params;

		await Candidate.findByIdAndDelete(id);

		res.send({ message: "Candidate deleted successfully" });
	} catch (error) {
		res.status(500).send({ message: "InterServer Error" });
	}
};

const getCandidatesByElection = async (req, res) => {
	try {
		const { id } = req.params;

		const candidates = await Candidate.find({ election: id });

		res.send({ message: "Candidates fetched successfully", candidates });
	} catch (error) {
		res.status(500).send({ message: "InterServer Error" });
	}
};

module.exports = {
	createCandidate,
	getCandidates,
	getCandidate,
	updateCandidate,
	deleteCandidate,
	getCandidatesByElection,
};
