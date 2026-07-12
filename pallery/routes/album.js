const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");

const {
  getAllAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} = require("../controllers/album");

router.route("/").get(getAllAlbums).post(authMiddleware, createAlbum);
router
  .route("/:id")
  .get(getAlbum)
  .patch(authMiddleware, updateAlbum)
  .delete(authMiddleware, deleteAlbum);

module.exports = router;
