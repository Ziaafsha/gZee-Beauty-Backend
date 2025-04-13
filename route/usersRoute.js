const express = require("express");
const router = express.Router();

const usersController = require("../controller/usersController");

router.post('/register',usersController.registration);
router.post('/login',usersController.login);

module.exports = router;