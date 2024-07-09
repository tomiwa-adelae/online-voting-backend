require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./Router/routes");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

// Create an instance for express application
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan("dev"));
// Enable CORS for specific origin
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// Note that this option available for versions 1.0.0 and newer.
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

app.use(
	cors({
		origin: process.env.BASE_URL,
		credentials: true,
	})
);

// Using Routes
app.use("/api", routes);
// Configuration for database and port connection
const port = process.env.PORT || 6000;
mongoose
	.connect(process.env.DATABASE_URL, {})
	.then(() => {
		console.log("Database connection established");
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch((err) => {
		console.log("Error connecting to the database", err.message);
	});
