const express = require("express");
const router = express.Router();

const {
  getAllPaintings,
  getPainting,
  createPainting,
  updatePainting,
  deletePainting,
} = require("../controllers/paintings");

router.route("/").get(getAllPaintings).post(createPainting);
router
  .route("/:id")
  .get(getPainting)
  .patch(updatePainting)
  .delete(deletePainting);

module.exports = router;
