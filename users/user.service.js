const bcrypt = require("bcryptjs");
const db = require("_helpers/db");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  loginUser,
};

async function loginUser(params) {
  if (!params || !params.userName || !params.email || !params.password) {
    throw { message: "Invalid request data" };
  }

  const user = await db.User.findOne({
    where: {
      userName: params.userName,
      email: params.email,
    },
  });

  if (!user) {
    throw { message: "Username or email not found" };
  }

  console.log("user:", user);

  if (!params.password || !user.passwordHash) {
    throw { message: "Invalid password data" };
  }

  const passwordMatch = await bcrypt.compare(
    params.password,
    user.passwordHash
  );

  if (!passwordMatch) {
    throw { message: "Password Incorrect" };
  }

  // If you reach here, the login is successful
  return { message: "Login Successful" };
}

async function getAll() {
  return await db.User.findAll();
}

async function getById(id) {
  return await getUser(id);
}

async function create(params) {
  // validate
  const user = new db.User(params);
  // has password
  user.passwordHash = await bcrypt.hash(params.password, 10);

  // save user
  await user.save();
}

async function update(id, params) {
  const user = await getUser(id);

  // validate

  // hash password if it was entered
  if (params.password) {
    params.passwordHash = await bcrypt.hash(params.password, 10);
  }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();
}

async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

// helper functions

async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User not found";
  return user;
}
