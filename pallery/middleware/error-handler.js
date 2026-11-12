const { CustomAPIError, FileTooLarge } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = async (err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    err = new FileTooLarge("Image is too large (max 10 MB)");
  }

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  console.log(err);
  return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, please try again" });
};

module.exports = errorHandlerMiddleware;