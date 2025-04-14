const express = require("express");
const router = express.Router();

const ordersController = require("../controller/ordersController");

router.post("/:user_id", ordersController.createOrder);
router.get("/stats", ordersController.getStats);
router.get("/:user_id", ordersController.getOrdersByUser);

module.exports = router;
