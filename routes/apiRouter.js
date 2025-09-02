const express = require("express");

const router = express.Router();

router.use("/auth",require("./authRouter"));
router.use("/email",require("./emailRouter"))



module.exports = router;