const User = require("../models/models");

async function handleGetAllUsers(req, res) {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
}

async function handleGetUserbyId(req, res) {
  const userName = await User.findById(req.params.id);
  if (!userName) return res.status(404).json({ error: "No User found" });
  return res.json(userName);
}

async function handleUpdateUserbyId(req, res) {
  const pUser = await User.findByIdAndUpdate(req.params.id, req.body);
  return res.status(200).json({ status: "success" });
}

async function handleDeleteUserbyId(req, res) {
  try {
    const delUser = await User.findByIdAndDelete(req.params.id);
    return res.status(204).json({ msg: "success" });
  } catch (error) {
    return res.status(404);
  }
}

async function handleCreateNewUser(req, res) {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.job_title ||
    !body.gender
  ) {
    return res.status(400).json({ msg: "All fields are required..." });
  }
  const result = await User.create({
    first_name: body.first_name,
    email: body.email,
    gender: body.gender,
    last_name: body.last_name,
    job_title: body.job_title,
  });
  return res.status(201).json({ msg: "success", id: result._id });
}

module.exports = {
  handleGetAllUsers,
  handleGetUserbyId,
  handleUpdateUserbyId,
  handleDeleteUserbyId,
  handleCreateNewUser,
};
