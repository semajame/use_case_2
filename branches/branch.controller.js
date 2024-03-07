const express = require("express");
const router = express.Router();
const Joi = require("joi");
const db = require("_helpers/db");
const validateRequest = require("_middleware/validate-request");

const branchService = require("./branch.service");

module.exports = router;

router.get("/", getAllBranch);
router.get("/:id", getBranchId);
router.post("/", createBranch, create);
router.post("/:branchId/assign/:userId", assignUserToBranch);
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);

function getAllBranch(req, res, next) {
  branchService
    .getAll(req.query, req.params.id)
    .then((users) => res.json(users))
    .catch(next);
}

function getBranchId(req, res, next) {
  branchService
    .getBranch(req.query, req.params.id)
    .then((users) => res.json(users))
    .catch(next);
}

function create(req, res, next) {
  branchService
    .create(req.query, req.body)
    .then(() => res.json({ message: "Branch created" }))
    .catch(next);
}

function update(req, res, next) {
  branchService
    .update(req.query, req.params.id, req.body)
    .then(() => res.json({ message: "Branch updated" }))
    .catch(next);
}

function assignUserToBranch(req, res, next) {
  branchService
    .assignUserToBranch(req.query, req.params.branchId, req.params.userId)
    .then(() => res.json({ message: "Assign User to Branch success" }))
    .catch(next);
}

function _delete(req, res, next) {
  branchService
    .delete(req.params.id)
    .then(() => res.json({ message: "Branch deleted" }))
    .catch(next);
}

function createBranch(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    status: Joi.string(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().empty(""),
    location: Joi.string().empty(""),
    status: Joi.string().empty(""),
  });
  validateRequest(req, next, schema);
}
