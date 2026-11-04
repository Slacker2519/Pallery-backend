const Painting = require("../models/painting");
const User = require("../models/user");
const Album = require("../models/album");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound, Unauthenticated } = require("../errors");

const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) throw new NotFound(`No user with this id: ${req.params.id}`);

  const isOwner = req.user && req.user.id === req.params.id;
  const result = isOwner
      ? user
      : { _id: user._id, name: user.name, createdAt: user.createdAt };

  res.status(StatusCodes.OK).json({ user: result });
};

const getUserAllPaintings = async (req, res) => {
  const { name, tags, author, description } = req.query;
  const isOwner = req.user && req.user.id === req.params.id;

  const queryObject = { ownerId: req.params.id };
  if (!isOwner) queryObject.visibility = "public";

  if (name) queryObject.name = { $regex: name, $options: "i" };
  if (author) queryObject.author = { $regex: author, $options: "i" };
  if (description) queryObject.description = { $regex: description, $options: "i" };
  if (tags) queryObject.tags = { $in: [tags] };

  const paintings = await Painting.find(queryObject);
  res.status(StatusCodes.OK).json({ paintings });
};

const getUserAllAlbums = async (req, res) => {
  const { name } = req.query;
  const isOwner = req.user && req.user.id === req.params.id;

  const queryObject = { ownerId: req.params.id };
  if (!isOwner) queryObject.visibility = "public";
  if (name) queryObject.name = { $regex: name, $options: "i" };

  const albums = await Album.find(queryObject);
  res.status(StatusCodes.OK).json({ albums });
};

const updateUser = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new NotFound("User not found");
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;
  await user.save();

  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

module.exports = {
  getUser,
  updateUser,
  getUserAllPaintings,
  getUserAllAlbums,
};
