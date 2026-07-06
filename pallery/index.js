require("dotenv").config();
const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "1.0.0.1"]);
const express = require("express");
const app = express();
const cors = require("cors");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  secure: true,
});

const connectDB = require("./db/connect");
const paintingRouter = require("./routes/paintings");
const authRouter = require("./routes/auth");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
app.use(express.json());
app.use(
  cors({
    origin: [process.env.LOCAL_FRONT_END, process.env.DEPLOYED_FRONT_END],
  }),
);

app.use("/api/gallery/paintings", paintingRouter);
app.use("/api/gallery/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
