const Painting = require("../models/painting");

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
    tags: tags.split(","),
    url: "#",
    author,
    authorUrl,
    ownerId: req.user._id,
    visibility: visibility || "public",
    description,
    createdAt: Date.now(),
  });

  await newPainting.save();
  res.status(201).json({ newPainting });
};

const updatePainting = async (req, res) => {
  res.send("update painting");
};

const deletePainting = async (req, res) => {
  res.send("delete painting");
};

module.exports = {
  getAllPaintings,
  getPainting,
  createPainting,
  updatePainting,
  deletePainting,
};
