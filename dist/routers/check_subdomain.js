"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validate = [(0, express_validator_1.body)("subdomain").notEmpty().isString()];
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
const check_subdomainRouter = (0, express_1.Router)();
check_subdomainRouter.post("/", validate, validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subdomain = req.body.subdomain;
    if (subdomain === "@") {
        res
            .status(200)
            .send({ status: 0, data: "root domain cannot be register" });
        return;
    }
    if (isAlphaNumeric(subdomain) === false) {
        res.status(200).send({ status: 0, data: "Invalid Id" });
        return;
    }
    res.status(200).send({ status: 0, data: "Handle Not Register" });
}));
exports.default = check_subdomainRouter;
function isAlphaNumeric(input) {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(input);
}
