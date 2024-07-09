const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../helper/tokenHelper");

const register = async (req, res) => {
	try {
		const {
			full_name,
			matric,
			email,
			gender,
			password,
			department,
			faculty,
		} = req.body;

		if (!full_name || !matric || !email || !gender || !password) {
			return res
				.status(400)
				.json({ message: "All the inputs are required." });
		}

		const lowerCaseEmail = email.toLowerCase();

		// Check if user already exists
		const existingUser = await User.findOne({ email: lowerCaseEmail });
		if (existingUser)
			return res.status(400).json({ message: "Email already exists." });
		const existingEmail = await User.findOne({ matric });
		if (existingEmail)
			return res
				.status(400)
				.send({ message: "Student matric number already exists." });

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create new user
		const newUser = new User({
			full_name,
			matric,
			email: lowerCaseEmail,
			gender,
			password: hashedPassword,

			userType: "user",
		});

		// Save new user to database
		await newUser.save();

		const token = generateToken({ id: newUser._id });
		// Send response
		res.send({
			message: "User registered successfully",
			user: {
				id: newUser._id,
				full_name: newUser.full_name,
				matric: newUser.matric,
				email: newUser.email,
				image: newUser.image,

				faceId: newUser.faceId,
				gender: newUser.gender,
				userType: newUser.userType,
			},
			token,
		});
	} catch (error) {
		res.status(500).send({ message: "InterServer Error" });
	}
};

const login = async (req, res) => {
	try {
		const { identifier, password } = req.body;

		if (!identifier || !password) {
			return res
				.status(400)
				.json({ message: "All the inputs are required." });
		}

		const lowerCaseEmail = identifier.toLowerCase();

		// Check if user exists
		const existingUser = await User.findOne({
			$or: [{ email: lowerCaseEmail }, { matric: identifier }],
		});
		if (!existingUser)
			return res.status(404).json({ message: "User not found." });

		// Check password
		const isValidPassword = await bcrypt.compare(
			password,
			existingUser.password
		);
		if (!isValidPassword)
			return res.status(401).json({ message: "Invalid password." });

		const token = generateToken({ id: existingUser._id });
		// Send response
		res.send({
			message: "User logged in successfully",
			user: {
				id: existingUser._id,
				full_name: existingUser.full_name,
				matric: existingUser.matric,
				email: existingUser.email,
				image: existingUser.image,

				faceId: existingUser.faceId,
				gender: existingUser.gender,
				userType: existingUser.userType,
			},
			token,
		});
	} catch (error) {
		res.status(500).send({ message: "InterServer Error" });
	}
};

const editProfile = async (req, res) => {
	try {
		const { full_name, matric, email, gender, image, faceId, id } =
			req.body;
		// Check if user exists
		const existingUser = await User.findById(id);
		if (!existingUser)
			return res.status(404).json({ message: "User not found." });

		// Update user
		if (full_name) existingUser.full_name = full_name;
		if (matric) existingUser.matric = matric;
		if (email) existingUser.email = email.toLowerCase();

		if (image) existingUser.image = image;
		if (faceId) existingUser.faceId = faceId;

		await existingUser.save();

		// Send response
		res.status(200).json({
			message: "Profile updated successfully",
			user: {
				id: existingUser._id,
				full_name: existingUser.full_name,
				matric: existingUser.matric,
				email: existingUser.email,
				image: existingUser.image,
				gender: existingUser.gender,
				faceId: existingUser.faceId,
			},
		});
	} catch (error) {
		res.status(500).send({ message: "InterServer Error" });
	}
};

const fetchUser = async (req, res) => {
	try {
		const { id } = req.user;

		// Check if user exists
		const user = await User.findById(id).select("-password");

		if (!user) return res.status(404).json({ message: "User not found." });
		// Send response
		res.status(200).json({
			user,
		});
	} catch {
		res.status(500).send({ message: "InterServer Error" });
	}
};

const fetchUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json({
			users,
		});
	} catch (error) {
		res.status(500).send({ message: "InterServer Error" });
	}
};

module.exports = { register, login, editProfile, fetchUser, fetchUsers };
