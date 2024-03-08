const express = require("express");
const router = express.Router();
const Joi = require("joi");

const validateRequest = require("_middleware/validate-request");

const userService = require("./user.service");

// routes

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createSchema, create);
router.post("/login", login);
router.post("/logout", logout);
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

function create(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({ message: "User created" }))
    .catch(next);
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({ message: "User updated" }))
    .catch(next);
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({ message: "User deleted" }))
    .catch(next);
}

function login(req, res) {
  userService
    .loginUser(req.body, req.params)
    .then(() => {
      res.json({ message: "Login Successful" }); // Send the response from the loginUser function
    })
    .catch((error) => {
      res.status(400).json({ error: error.message }); // Send an error response
    });
}

function logout(req, res, next) {
  userService
    .logoutUser(req.body, req.params)
    .then(() => {
      res.json({ message: "Logout Successful" });
    })
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const schema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    email: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    userName: Joi.string().empty(""),
    email: Joi.string().empty(""),
    password: Joi.string().min(6).empty(""),
    confirmPassword: Joi.string().valid(Joi.ref("password")).empty(""),
  }).with("password", "confirmPassword");
  validateRequest(req, next, schema);
}

function loginSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required(),
    userName: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  validateRequest(req, next, schema);
}

function logoutSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required(),
    userName: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  validateRequest(req, next, schema);
}
