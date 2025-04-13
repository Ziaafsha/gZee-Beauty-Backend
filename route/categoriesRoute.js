const express = require("express");
const router = express.Router();

const categoriesController = require("../controller/categoriesController");

router.get("/",categoriesController.getCategory);
router.post("/",categoriesController.addCategory);
router.get("/:categoryId/products",categoriesController.getProductsByCategoryId);


module.exports = router;