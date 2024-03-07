const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const Role = require("../_helpers/role");

module.exports = {
  getAll,
  create,
  getBranch,
  delete: _delete,
  assignUserToBranch,
  update,
};

async function getAll({ role }, options) {
  authorize(role, [Role.Admin]);
  return await db.Branches.findAll(options);
}

async function getBranch({ role }, id, options) {
  authorize(role, [Role.Admin]);
  const branch = await db.Branches.findByPk(id, options);
  if (!branch) throw "branch not found";
  return branch;
}

async function create({ role }, params) {
  authorize(role, [Role.Admin]);

  const existingBranch = await db.Branches.findOne({
    where: { name: params.name, location: params.location },
  });

  if (existingBranch) {
    throw new Error("Branch and Location already exist");
  }

  const branch = new db.Branches(params);
  await branch.save();
}

async function update({ role }, id, params) {
  authorize(role, [Role.Admin]);
  const branch = await db.Branches.findByPk(id);

  // validate
  const branchChanged = branch.branch !== params.branch;
  const statusChanged = branch.status !== params.status;

  if (
    branchChanged &&
    (await db.Branches.findOne({ where: { branch: params.branch } }))
  ) {
    throw 'Branch "' + params.branch + '" is already registered';
  }

  if (statusChanged) {
    branch.status = params.status;
  } else {
    throw 'Status "' + branch.status + '" is already registered';
  }

  Object.assign(branch, params);
  await branch.save();
}

async function assignUserToBranch({ role }, branchId, userId) {
  authorize(role, [Role.Admin]);

  const existingAssignment = await db.UserBranch.findOne({
    where: { userId, branchId },
  });

  if (existingAssignment) {
    throw { status: 400, message: "User already assigned to this branch" };
  }
  // Check if the branch and user exist in the database
  const branch = await db.Branches.findByPk(branchId, {
    attributes: ["id", "name", "location", "status"],
  });

  const user = await db.User.findByPk(userId, {
    attributes: ["id", "email", "passwordHash", "userName"],
  });

  if (!branch || !user) {
    throw { status: 404, message: "Branch or user not found" };
  }

  // Assign the user to the branch (update the database accordingly)
  await user.save();

  await db.UserBranch.create({
    userId: user.id,
    username: user.userName,
    branchId: branch.id,
    branchName: branch.name,
  });

  // Respond with a success message
  return "User assigned to branch successfully";
}

async function _delete(id) {
  const branch = await getBranch(id);
  await branch.destroy();
}

function authorize(role, allowedRoles) {
  if (
    !role ||
    !allowedRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase())
  ) {
    throw "Unauthorized user";
  }
}
