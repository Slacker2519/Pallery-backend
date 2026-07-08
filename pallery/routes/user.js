const express = require("express");
const {
  getUser,
  updateUser,
  getUserAllPaintings,
  getUserAllAlbums,
} = require("../controllers/user");
const authMiddleware = require("../middleware/authentication");
const router = express.Router();

router.route("/:id").get(getUser).patch(authMiddleware, updateUser);
router.route("/:id/paintings").get(authMiddleware, getUserAllPaintings);
router.route("/:id/albums").get(authMiddleware, getUserAllAlbums);

module.exports = router;
