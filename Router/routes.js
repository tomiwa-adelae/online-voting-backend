const userController = require("../App/controller/userController");
const electionController = require("../App/controller/electionController");
const candidateController = require("../App/controller/candidateController");
const authMiddleware = require("../App/middleware/authMiddleware");
const adminController = require("../App/controller/adminController");
const router = require("express").Router();
const voteController = require("../App/controller/voteController");
const { uploadMediaMiddleware } = require("../App/middleware/uploadMiddleware");
const { uploadMedia } = require("../App/controller/UploadController");

router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);
router.put("/user",  userController.editProfile);
router.get("/user", userController.fetchUser);
router.get("/users", userController.fetchUsers);

// Election Routes
router.post("/elections", electionController.createElection);
router.get("/elections", electionController.getElections);
router.get("/elections/:id", electionController.getElection);
router.put("/elections/:id", electionController.updateElection);
router.delete("/elections/:id", electionController.deleteElection);

// Candidate routes
router.post("/candidates", candidateController.createCandidate);
router.get("/candidates", candidateController.getCandidates);
router.get("/candidates/:id", candidateController.getCandidate);
router.put("/candidates/:id", candidateController.updateCandidate);
router.delete("/candidates/:id", candidateController.deleteCandidate);
router.get(
  "/elections/:id/candidates",
  candidateController.getCandidatesByElection
);

router.get("/admin", adminController.dashBorad);

router.post("/candidates/:id/vote",  voteController.vote);

router.post("/uploadMedia", uploadMediaMiddleware, uploadMedia);
module.exports = router;
