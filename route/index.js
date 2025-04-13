const express = require("express");
const router = express.Router();

const usersRoute = require("./usersRoute");
const categoriesRoute = require("./categoriesRoute");
const productsRoute = require("./productsRoute");
const cartsRoute = require("./cartsRoute")

router.use("/users",usersRoute);
router.use("/categories",categoriesRoute);
router.use("/products",productsRoute);
router.use("/carts",cartsRoute);

module.exports = router;