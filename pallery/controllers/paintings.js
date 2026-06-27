const Painting = require("../models/painting");
const { cloudinary, upload } = require("../config/cloudinary");

const getAllPaintings = async (req, res) => {
  const paintings = await Painting.find({});
  res.status(200).json({ paintings });
};

const getPainting = async (req, res) => {
  const { id: id } = req.params;
  const painting = await Painting.findOne({ _id: id });

  if (!painting) {
    return res.status(404).json({ msg: `No painting with id: ${id}` });
  }

  res.status(200).json({ painting });
};

const createPainting = async (req, res) => {
  const { name, source, tags, author, authorUrl, visibility, description } =
    req.body;

  const newPainting = new Painting({
    name,
    source,
    tags: tags ? tags.split(",") : [],
    url: req.file ? req.file.path : req.body.url,
    author,
    authorUrl,
    ownerId: "6a3e459455dc077dffc1b3c3",
    visibility: visibility || "public",
    description,
  });

  await newPainting.save();
  res.status(201).json({ newPainting });
};

const updatePainting = async (req, res) => {
  const { id: id } = req.params;
  const { name, source, tags, author, authorUrl, visibility, description } =
    req.body;
  const updatedPainting = await Painting.findOneAndUpdate(
    { _id: id },
    {
      name,
      source,
      tags: tags ? tags.split(",") : [],
      url: req.file ? req.file.path : req.body.url,
      author,
      authorUrl,
      visibility: visibility || "public",
      description,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedPainting) {
    return res.status(404).json({ msg: `No painting with id: ${id}` });
  }

  res.status(200).json({ updatedPainting });
};

const deletePainting = async (req, res) => {
  const { id: id } = req.params;
  const deletedPainting = await Painting.findOneAndDelete({ _id: id });

  if (!deletedPainting) {
    return res.status(404).json({ msg: `No painting with id: ${id}` });
  }

  res.status(204).json({ deletedPainting });
};

module.exports = {
  getAllPaintings,
  getPainting,
  createPainting,
  updatePainting,
  deletePainting,
};
