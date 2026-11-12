const CustomAPIError = require("./custom-error");
const BadRequest = require("./bad-request");
const Unauthenticated = require("./unauthenticated");
const NotFound = require("./not-found");
const FileTooLarge = require("./file-too-large.js");

module.exports = {
  CustomAPIError,
  BadRequest,
  Unauthenticated,
  NotFound,
  FileTooLarge,
};
