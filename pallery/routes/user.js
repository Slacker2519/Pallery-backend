const express = require("express");

const { Unauthenticated } = require("../errors");
const { avatarUpload } = require("../config/cloudinary");

const checkSelf = (req, res, next) => {
  if (req.params.id !== req.user.id) {
    throw new Unauthenticated("You can only update your own profile");
  }
  next();
}

const {
  getUser,
  updateUser,
  getUserAllPaintings,
  getUserAllAlbums,
} = require("../controllers/user");
const authMiddleware = require("../middleware/authentication");
const optionalAuth = require("../middleware/optional-auth");
const {getAlbum, updateAlbum, deleteAlbum} = require("../controllers/album");
const router = express.Router();

router.route("/:id")
    .get(optionalAuth, getUser)
    .patch(authMiddleware, checkSelf, avatarUpload.single("avatar"), updateUser);

router.route("/:id/paintings").get(optionalAuth, getUserAllPaintings);

router.route("/:id/albums").get(optionalAuth, getUserAllAlbums);

router.route("/:id").get(optionalAuth, getAlbum)
      .patch(authMiddleware, updateAlbum)
      .delete(authMiddleware, deleteAlbum);

module.exports = router;
