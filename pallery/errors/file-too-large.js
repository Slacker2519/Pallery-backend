const CustomAPIError = require("./custom-error");
const { StatusCodes } = require("http-status-codes");

class FileTooLarge extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.REQUEST_TOO_LONG;
    }
}

module.exports = FileTooLarge;