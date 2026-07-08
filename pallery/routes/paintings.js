const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");

const {
  getAllPaintings,
  getPainting,
  createPainting,
  updatePainting,
  deletePainting,
} = require("../controllers/paintings");

const { upload } = require("../config/cloudinary");

router
  .route("/")
  .get(getAllPaintings)
  .post(authMiddleware, upload.single("url"), createPainting);
router
  .route("/:id")
  .get(getPainting)
  .patch(authMiddleware, updatePainting)
  .delete(authMiddleware, deletePainting);

module.exports = router;
