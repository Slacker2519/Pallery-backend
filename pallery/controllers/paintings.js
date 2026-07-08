const Painting = require("../models/painting");
const { cloudinary, upload } = require("../config/cloudinary");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors");

const getAllPaintings = async (req, res) => {
  const { name, tags, author } = req.query;

  const queryObject = {
    visibility: "public",
  };
  if (name) queryObject.name = { $regex: name, $options: "i" };
  if (author) queryObject.author = { $regex: author, $options: "i" };
  if (tags) queryObject.tags = { $in: [tags] };

  const paintings = await Painting.find(queryObject);
  res.status(StatusCodes.OK).json({ paintings });
};

const getPainting = async (req, res) => {
  const { id: id } = req.params;
  const painting = await Painting.findOne({ _id: id });

  if (!painting) {
    throw new NotFound(`No painting with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ painting });
};

const createPainting = async (req, res) => {
  const { name, source, tags, author, authorUrl, visibility, description } =
    req.body;

  const newPainting = new Painting({
    name,
    source,
    tags: tags ? tags.split(",") : [],
    url: req.file.path,
    publicId: req.file.filename,
    author,
    authorUrl,
    ownerId: "6a3e459455dc077dffc1b3c3",
    visibility: visibility || "public",
    description,
  });

  if (!newPainting.name || !newPainting.url) {
    if (newPainting.publicId) {
      const result = await cloudinary.uploader.destroy(newPainting.publicId);
    }
    throw new BadRequest("Name and URL are required");
  }

  await newPainting.save();
  res.status(StatusCodes.CREATED).json({ newPainting });
};

const updatePainting = async (req, res) => {
  const painting = await Painting.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!painting) {
    throw new NotFound("Painting not found");
  }

  res.status(StatusCodes.OK).json({ painting });
};

const deletePainting = async (req, res) => {
  const painting = await Painting.findOneAndDelete({ _id: req.params.id });

  if (!painting) {
    throw new NotFound(`No painting with id: ${req.params.id}`);
  }

  if (painting.publicId) {
    const result = await cloudinary.uploader.destroy(painting.publicId);
  }

  res.status(StatusCodes.NO_CONTENT).json({ message: "Painting deleted" });
};

module.exports = {
  getAllPaintings,
  getPainting,
  createPainting,
  updatePainting,
  deletePainting,
};
