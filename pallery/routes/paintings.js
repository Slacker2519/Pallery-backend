const express = require("express");
const router = express.Router();

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
  .post(upload.single("url"), createPainting);
router
  .route("/:id")
  .get(getPainting)
  .patch(updatePainting)
  .delete(deletePainting);

module.exports = router;
