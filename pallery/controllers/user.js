const Painting = require("../models/painting");
const User = require("../models/user");
const Album = require("../models/album");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound, Unauthenticated } = require("../errors");

const getUser = async (req, res) => {
  const { id: id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new NotFound(`No user with this id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const getUserAllPaintings = async (req, res) => {
  if (req.params.id !== req.user.id) {
    throw new Unauthenticated("Not authorized to access this resource");
  }

  const { name, tags, author, description } = req.query;
  const queryObject = {
    ownerId: req.user.id,
  };
  if (name) queryObject.name = { $regex: name, $options: "i" };
  if (author) queryObject.author = { $regex: author, $options: "i" };
  if (description)
    queryObject.description = { $regex: description, $options: "i" };
  if (tags) queryObject.tags = { $in: [tags] };

  const paintings = await Painting.find(queryObject);
  res.status(StatusCodes.OK).json({ paintings });
};

const getUserAllAlbums = async (req, res) => {
  if (req.params.id !== req.user.id) {
    throw new Unauthenticated("Not authorized to access this resource");
  }

  const { name, paintingsId } = req.query;
  const queryObject = {
    ownerId: req.user.id,
  };
  if (name) queryObject.name = { $regex: name, $options: "i" };
  if (paintingsId) queryObject.paintingsId = { $in: [paintingsId] };

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
