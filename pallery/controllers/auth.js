const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, Unauthenticated } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthenticated("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new Unauthenticated("Invalid credentials");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      albumIds: user.albumIds,
      paintingIds: user.paintingIds,
      createdAt: user.createdAt,
    },
    token,
  });
};

module.exports = { register, login };
