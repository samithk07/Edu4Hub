"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.loginController);
router.get("/me", auth_middleware_1.authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            user: req.user,
        },
    });
});
exports.default = router;
