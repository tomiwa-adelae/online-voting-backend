const { verifyToken } = require("../helper/tokenHelper");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
	try {
		const accessToken = req.header("Authorization");
		// if token is empty
		if (!accessToken) {
			return res.status(401).json({ message: "You are not authorized!" });
		}
		const decodedToken = verifyToken(accessToken);
		// Check if token is valid
		if (!decodedToken) {
			return res
				.status(401)
				.json({ message: "Invalid or expired token" });
		}

		// find user in the database
		const user = await User.findById(decodedToken.id);
		// Check if user exist
		if (!user) {
			return res.status(404).json({ message: "User Not Found." });
		}

		// retun the user
		req.user = {
			id: user._id,
			full_name: user.full_name,
		};
		// retun the token
		req.token = accessToken;
		next();
	} catch (error) {}
};

module.exports = authMiddleware;
