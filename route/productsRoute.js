const express = require("express");
const router = express.Router();

const productsController = require("../controller/productsController");

router.post("/",productsController.addProduct);
router.get("/:id",productsController.getProductById);


module.exports = router;
