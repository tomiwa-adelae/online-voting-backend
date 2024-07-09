const Candidate = require("../models/candidateModel");
const mongoose = require("mongoose");

const vote = async (req, res) => {
	try {
		const { id } = req.params;
		const { userId } = req.body;

		const candidate = await Candidate.findById(id);

		if (!candidate)
			return res.status(404).send({ message: "Candidate not found." });

		if (candidate.votes.includes(userId)) {
			return res.status(400).send({
				message: "You have already voted for this candidate.",
			});
		}

		candidate.votes.push(new mongoose.Types.ObjectId(userId));
		candidate.votes = candidate.votes.filter((vote) => vote !== userId);

		await candidate.save();

		res.send({ message: "Vote cast successfully", candidate });
	} catch (error) {
		res.status(500).send({ message: "InterServer Error" });
	}
};

module.exports = {
	vote,
};
