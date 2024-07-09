const User = require("../models/userModel");
const Candidate = require("../models/candidateModel");
const Election = require("../models/electionModel");
const dashBorad = async (req, res) => {
	try {
		const users = await User.find();
		const candidates = await Candidate.find();
		const elections = await Election.find();
		res.status(200).json({ users, candidates, elections });
	} catch (error) {
		res.status(500).send({ message: "InterServer Error" });
	}
};

module.exports = { dashBorad };
