const Albums = require("../models/album");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors");

const getAllAlbums = async (req, res) => {
  const { name, visibility } = req.query;

  const queryObject = {};
  if (name) queryObject.name = { $regex: name, $options: "i" };
  queryObject.visibility = visibility === "private" ? "private" : "public";

  const albums = await Albums.find(queryObject);
  res.status(StatusCodes.OK).json({ albums });
};

const getAlbum = async (req, res) => {
  const { id: id } = req.params;
  const album = await Albums.findOne({ _id: id });
  if (!album) {
    throw new NotFound(`Album with id ${id} not found`);
  }
  res.status(StatusCodes.OK).json({ album });
};

const createAlbum = async (req, res) => {
  const { name, paintingsId, visibility } = req.body;

  if (!name) {
    throw new BadRequest("Name is required");
  }

  const album = await Albums.create({
    name,
    ownerId: req.user.id,
    paintingsId,
    visibility,
  });
  res.status(StatusCodes.CREATED).json({ album });
};

const updateAlbum = async (req, res) => {
  const album = await Albums.findById(req.params.id);

  if (!album) throw new NotFound(`Album with id ${req.params.id} not found`);
  if (album.ownerId !== req.user.id)
    throw new Unauthorized("You are not authorized to update this album");

  const { name, paintingsId, visibility } = req.body;
  if (name) album.name = name;
  if (paintingsId) album.paintingsId = paintingsId;
  if (visibility) album.visibility = visibility;

  await album.save();
  res.status(StatusCodes.OK).json({ album });
};

const deleteAlbum = async (req, res) => {
  const album = await Albums.findById(req.params.id);

  if (!album) throw new NotFound(`Album with id ${req.params.id} not found`);

  if (album.ownerId.toString() !== req.user.userId) {
    throw new Unauthenticated("You are not authorized to delete this album");
  }

  await album.deleteOne();
  res.status(StatusCodes.NO_CONTENT);
};

module.exports = {
  getAllAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};
