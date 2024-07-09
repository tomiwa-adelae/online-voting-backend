const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configure Cloudinary to upload
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMedia = async (req, res) => {
	try {
		const { path } = req.body;
		let files = Object.values(req.files).flat();
		let medias = [];
		for (const file of files) {
			let retries = 3; // Number of retry attempts
			while (retries > 0) {
				try {
					// Upload file to Cloudinary with appropriate resource type
					const result = await cloudinary.uploader.upload(
						file.tempFilePath,
						{
							folder: path, // Optional folder path in Cloudinary
							timeout: 600000, // Increase timeout value
							resource_type: file.mimetype.startsWith("video/")
								? "video"
								: "image", // Set resource type based on file type
						}
					);

					// Add metadata to the medias array
					medias.push({
						type: file.mimetype.startsWith("video/")
							? "video"
							: "image",
						url: result.secure_url,
					});

					// Remove temporary file
					removeTmp(file.tempFilePath);

					// Break out of retry loop if upload succeeds
					break;
				} catch (err) {
					retries--; // Decrement retry count
					if (retries === 0) {
						throw new Error(
							`Failed to upload file after ${retries} attempts`
						);
					}
					// Wait for a brief period before retrying
					await new Promise((resolve) => setTimeout(resolve, 3000));
				}
			}
		}

		// Return the uploaded media URLs
		res.status(200).json({ medias: medias });
	} catch (err) {
		res.status(500).json({ msg: `Error uploading media: ${err.message}` });
	}
};

const removeTmp = (file) => {
	fs.unlink(file, (err) => {
		if (err) throw err;
	});
};

module.exports = {
	uploadMedia,
};
