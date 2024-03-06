const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const orderService = require("./order.service");
const Role = require("../_helpers/role");

// Routes

router.get("/", viewOrders);
router.get("/:id", getOrderById);
router.post("/", createSchema, createOrder);
router.put("/:id", updateSchema, updateOrder);
router.put("/:id/cancel", cancel, cancelOrder);
router.get("/:id/status", getOrderStatus);
router.put("/:id/process", process, ProcessOrder);
router.put("/:id/ship", ship, ShipOrder);
router.put("/:id/deliver", deliver, DeliverOrder);

module.exports = router;

// Controller functions

// Create a new order
async function createOrder(req, res, next) {
  try {
    await orderService.createNewOrder(req.body);
    res.json({ message: "Order created successfully!!" });
  } catch (error) {
    next(error);
  }
}

// View orders
async function viewOrders(req, res, next) {
  try {
    const orders = await orderService.viewOrders(req.query);
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

// Get order by ID
async function getOrderById(req, res, next) {
  const { role } = req.query;
  try {
    const order = await orderService.getOrderById(req.params.id, role);
    res.json(order);
  } catch (error) {
    next(error);
  }
}

// Update order by ID
async function updateOrder(req, res, next) {
  const { role } = req.query;
  try {
    await orderService.updateOrder(req.params.id, req.body, role);
    res.json({ message: "Order updated" });
  } catch (error) {
    next(error);
  }
}

// Get order status by ID
async function getOrderStatus(req, res, next) {
  const { role } = req.query;
  try {
    const orderStatus = await orderService.getOrderStatus(req.params.id, role);
    res.json({ orderStatus });
  } catch (error) {
    next(error);
  }
}

// Request validation schemas

// Schema for creating a new order
function createSchema(req, res, next) {
  const schema = Joi.object({
    orderProductName: Joi.string().required(), // Name of the product
    orderProductQuantity: Joi.number().required(), // Quantity of the product
    orderProductPrice: Joi.number().required(), // Price of the product
    customerName: Joi.string().required(), // Name of the customer
    orderStatus: Joi.number().default(1), // Status of the order (default to 'Placing Order')
  });
  validateRequest(req, next, schema);
}

// Schema for updating an order
function updateSchema(req, res, next) {
  const schema = Joi.object({
    orderProductName: Joi.string().empty(""), // Optional: New name of the product
    customerName: Joi.string().empty(""),
    // Optional: New name of the customer
    orderProductQuantity: Joi.number().empty(""),
    orderStatus: Joi.number().valid(0, 1, 2, 3, 4, 5).empty(""), // Optional: New status of the order
  });
  validateRequest(req, next, schema);
}

async function cancelOrder(req, res, next) {
  try {
    // Remove role from the destructuring assignment
    const {} = req.query;
    await orderService.cancel(req.params.id, req.body);
    res.json({ message: "Order Cancelled" });
  } catch (error) {
    next(error);
  }
}

function cancel(req, res, next) {
  const schema = Joi.object({
    orderStatus: Joi.number().default(0),
  });
  validateRequest(req, next, schema);
}

async function getOrderStatus(req, res, next) {
  try {
    const orderStatus = await orderService.getOrderStatus(req.params.id);
    res.json({ orderStatus });
  } catch (error) {
    next(error);
  }
}

async function ProcessOrder(req, res, next) {
  const { role } = req.query;
  try {
    await orderService.updateOrder(req.params.id, req.body, role);
    res.json({ message: "Order is being processed! " });
  } catch (error) {
    next(error);
  }
}

function process(req, res, next) {
  const schema = Joi.object({
    orderStatus: Joi.number().default(2),
  });
  validateRequest(req, next, schema);
}

async function ShipOrder(req, res, next) {
  const { role } = req.query;
  try {
    await orderService.updateOrder(req.params.id, req.body, role);
    res.json({ message: "Order Shipped " });
  } catch (error) {
    next(error);
  }
}

function ship(req, res, next) {
  const schema = Joi.object({
    orderStatus: Joi.number().default(3),
  });
  validateRequest(req, next, schema);
}

async function DeliverOrder(req, res, next) {
  const { role } = req.query;
  try {
    await orderService.updateOrder(req.params.id, req.body, role);
    res.json({ message: "Order Successfully Delivered " });
  } catch (error) {
    next(error);
  }
}

function deliver(req, res, next) {
  const schema = Joi.object({
    orderStatus: Joi.number().default(5),
  });
  validateRequest(req, next, schema);
}
