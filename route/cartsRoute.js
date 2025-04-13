const express = require("express");
const router = express.Router();

const cartsController = require("../controller/cartsController");

router.get("/:user_id", cartsController.getCartByUser);
router.post("/", cartsController.addToCart);
router.post("/remove", cartsController.removeFromCart);

module.exports = router;
