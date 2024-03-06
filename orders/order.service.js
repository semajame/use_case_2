const db = require("_helpers/db");
const { Op } = require("sequelize");
const Role = require("../_helpers/role");

module.exports = {
  getAll,
  createNewProduct,
  viewOrders,
  getOrderById,
  updateOrder,
  getOrderStatus,
};

// Get all products
async function getAll() {
  return await db.Product.findAll();
}

// View orders (accessible by Admin and Manager roles)
async function viewOrders({ role }) {
  // Authorize the user role
  authorize(role, [Role.Admin, Role.Manager]);

  // Fetch orders with specific attributes
  return await db.Product.findAll({
    attributes: ["id", "productName", "customerName"],
  });
}

// Get order by ID (accessible by Admin and Manager roles)
async function getOrderById(id, role) {
  // Authorize the user role
  authorize(role, [Role.Admin, Role.Manager]);

  // Find order by primary key
  const order = await db.Product.findByPk(id);
  if (!order) throw "Order not found";

  return order;
}

// Get order status by ID (accessible by Customer role)
async function getOrderStatus(id, role) {
  const order = await db.Product.findByPk(id);
  if (!order) throw "Order not found";

  // Authorize the user role
  authorize(role, [Role.Customer]);

  // Return status message based on order status
  return getStatusMessage(order.orderStatus);
}

// Create a new product (order)
async function createNewProduct(params) {
  // Create a new product instance
  const product = new db.Product(params);
  // Save the product to the database
  await product.save();
}

// Update order details by ID (accessible by Admin, Manager, and Customer roles)
async function updateOrder(id, params, role) {
  // Find order by ID
  const order = await db.Product.findByPk(id);
  if (!order) throw "Order not found";

  if (!role) throw "Unauthorized User";

  // If the update is requested by the customer, only update order status
  if (isCustomerUpdate(params, role)) {
    Object.assign(order, params);
    await order.save();
  } else {
    // For Admin and Manager roles, update all order details
    authorize(role, [Role.Admin, Role.Manager]);
    Object.assign(order, params);
    await order.save();
  }
}

// Get status message based on order status code
function getStatusMessage(orderStatus) {
  const statusMessages = {
    0: "Order is Cancelled",
    1: "Placing Order",
    2: "Order Processed",
    3: "Order Shipped",
    4: "Order is out for delivery",
    5: "Order has been Delivered",
  };
  return statusMessages[orderStatus] || "Unknown Status";
}

// Authorize user role
function authorize(role, allowedRoles) {
  if (
    !role ||
    !allowedRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase())
  ) {
    throw "Unauthorized User";
  }
}

// Check if the update request is from the customer and only includes order status
function isCustomerUpdate(params, role) {
  return (
    Object.keys(params).length === 1 &&
    "orderStatus" in params &&
    params.orderStatus === 0 &&
    role.toLowerCase() === Role.Customer.toLowerCase()
  );
}
