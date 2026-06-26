require("dotenv").config();
const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const connectDB = require("./db/connect");
const Painting = require("./models/painting");
const User = require("./models/user");

const jsonData = require("./initialData.json");

const admin = new User({
  name: "admin",
  email: "tienduongeng2001@gmail.com",
  role: "admin",
});

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    await Painting.deleteMany();
    await User.deleteMany();

    await admin.save();

    const paintings = jsonData.map((painting) => {
      return new Painting({
        ...painting,
        ownerId: admin._id,
      });
    });
    await Painting.insertMany(paintings);

    console.log("Success!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
