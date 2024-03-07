require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const errorHandler = require("_middleware/error-handler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Api Routes

// inventory
app.use("/users", require("./users/users.controller"));
app.use("/products", require("./product/products.controller"));
app.use("/inventory", require("./inventory/inventory.controller"));

// branches

app.use("/auth", require("./users/users.controller"));
app.use("/branches", require("./branches/branch.controller"));

// order
app.use("/orders", require("./orders/orders.controller"));

// Global Error Handler
app.use(errorHandler);

// Start Server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
app.listen(port, () => console.log("Server listening on port " + port));
