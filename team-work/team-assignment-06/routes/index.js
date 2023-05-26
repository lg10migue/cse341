const express = require("express");
const router = express.Router();

router.use("/", require("./swagger") /* #swagger.ignore = true */);
router.use("/contacts", require("./contacts"));

module.exports = router;
