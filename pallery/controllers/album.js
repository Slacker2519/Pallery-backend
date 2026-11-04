const Albums = require("../models/album");
const Painting = require("../models/painting");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound, Unauthenticated } = require("../errors");

const getAllAlbums = async (req, res) => {
  const { name, visibility } = req.query;

  const queryObject = {};
  if (name) queryObject.name = { $regex: name, $options: "i" };
  queryObject.visibility = visibility === "private" ? "private" : "public";

  const albums = await Albums.find(queryObject);
  res.status(StatusCodes.OK).json({ albums });
};

const getAlbum = async (req, res) => {
  const album = await Albums.findById(req.params.id);
  if (!album) throw new NotFound(`Album with id ${req.params.id} not found`);

  const isOwner = req.user && album.ownerId.toString() === req.user.id;

  console.log({
    visibility: album.visibility,
    ownerId: album.ownerId.toString(),
    viewer: req.user,
  });

  if (album.visibility === "private" && !isOwner) {
    throw new NotFound(`Album with id ${req.params.id} not found`);
  }

  const paintingQuery = { _id: { $in: album.paintingIds } };
  if (!isOwner) paintingQuery.visibility = "public";

  const paintings = await Painting.find(paintingQuery);

  res.status(StatusCodes.OK).json({ album, paintings });
};

const createAlbum = async (req, res) => {
  const { name, paintingIds, coverPaintingId, description, visibility } = req.body;

  if (!name) {
    throw new BadRequest("Name is required");
  }

  const album = await Albums.create({
    name,
    ownerId: req.user.id,
    paintingIds,
    coverPaintingId: normalizeCover(coverPaintingId, paintingIds),
    description,
    visibility: visibility || "private"
  });
  res.status(StatusCodes.CREATED).json({ album });
};

const updateAlbum = async (req, res) => {
  const album = await Albums.findById(req.params.id);

  if (!album) throw new NotFound(`Album with id ${req.params.id} not found`);
  if (album.ownerId.toString() !== req.user.id)
    throw new Unauthenticated("You are not authorized to update this album");

  const { name, paintingIds, description, visibility } = req.body;
  if (name) album.name = name;
  if (paintingIds) album.paintingIds = paintingIds;
  if (description !== undefined) album.description = description;
  if (visibility) album.visibility = visibility;

  const { coverPaintingId } = req.body;
  album.coverPaintingId = normalizeCover(
      coverPaintingId !== undefined ? coverPaintingId : album.coverPaintingId,
      album.paintingIds,
  );

  await album.save();
  res.status(StatusCodes.OK).json({ album });
};

const deleteAlbum = async (req, res) => {
  const album = await Albums.findById(req.params.id);

  if (!album) throw new NotFound(`Album with id ${req.params.id} not found`);

  if (album.ownerId.toString() !== req.user.id) {
    throw new Unauthenticated("You are not authorized to delete this album");
  }

  await album.deleteOne();
  res.status(StatusCodes.OK).json({ message: "Album deleted." });
};

const normalizeCover = (coverPaintingId, paintingIds = []) =>
    coverPaintingId && paintingIds.includes(coverPaintingId) ? coverPaintingId : null;

module.exports = {
  getAllAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};
