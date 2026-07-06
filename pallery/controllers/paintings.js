const Painting = require("../models/painting");
const { cloudinary, upload } = require("../config/cloudinary");

const getAllPaintings = async (req, res) => {
  const { name, tags, author, visibility } = req.query;

  const queryObject = {};
  if (name) queryObject.name = name;
  if (tags) queryObject.tags = tags;
  if (author) queryObject.author = author;
  if (visibility)
    queryObject.visibility = visibility === "public" ? "public" : "private";

  const paintings = await Painting.find(queryObject);
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
    return res.status(400).json({ error: "Name and URL are required" });
  }

  await newPainting.save();
  res.status(201).json({ newPainting });
};

const updatePainting = async (req, res) => {
  const painting = await Painting.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!painting) {
    return res.status(404).json({ error: "Painting not found" });
  }

  res.status(200).json({ painting });
};

const deletePainting = async (req, res) => {
  const painting = await Painting.findOneAndDelete({ _id: req.params.id });

  if (!painting) {
    return res.status(404).json({ error: "Painting not found" });
  }

  if (painting.publicId) {
    const result = await cloudinary.uploader.destroy(painting.publicId);
  }

  res.json({ message: "Painting deleted" });
};

module.exports = {
  getAllPaintings,
  getPainting,
  createPainting,
  updatePainting,
  deletePainting,
};
