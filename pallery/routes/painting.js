const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");
const optionalAuth = require("../middleware/optional-auth");

const {
  getAllPaintings,
  getPainting,
  createPainting,
  updatePainting,
  deletePainting,
} = require("../controllers/painting");

const { upload } = require("../config/cloudinary");

router
  .route("/")
  .get(getAllPaintings)
  .post(authMiddleware, upload.single("url"), createPainting);
router
  .route("/:id")
  .get(optionalAuth, getPainting)
  .patch(authMiddleware, updatePainting)
  .delete(authMiddleware, deletePainting);

module.exports = router;
