require("dotenv").config();
const bcrypt = require("bcryptjs");

const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const connectDB = require("./db/connect");
const Painting = require("./models/painting");
const User = require("./models/user");
const { uploadToCloudinary } = require("./config/cloudinary");

const jsonData = require("./initialData.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    await Painting.deleteMany();
    await User.deleteMany();

    const admin = new User({
      name: "admin",
      email: "tienduongeng2001@gmail.com",
      password: "secretpassword",
      role: "admin",
    });

    await admin.save();

    const paintings = await Promise.all(
      jsonData.map(async (painting) => {
        const { url, publicId } = await uploadToCloudinary(
          painting.url,
          "pallery",
        );

        const newPainting = new Painting({
          ...painting,
          ownerId: admin._id,
          url,
          publicId,
        });

        admin.paintingIds.push(newPainting._id);
        return newPainting;
      }),
    );
    await admin.save();
    await Painting.insertMany(paintings);

    console.log("Success!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
