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
const aoconnect_1 = require("@permaweb/aoconnect");
const constant_1 = require("../utils/constant");
const validate = [
    (0, express_validator_1.body)("id").notEmpty().isString(),
    (0, express_validator_1.body)("pageId").notEmpty().isString(),
    (0, express_validator_1.body)("date").notEmpty().isString(),
    (0, express_validator_1.body)("browser").notEmpty().isString(),
    (0, express_validator_1.body)("os").notEmpty().isString(),
    (0, express_validator_1.body)("timezone").notEmpty().isString(),
    (0, express_validator_1.body)("loadtime").notEmpty().isString(),
    (0, express_validator_1.body)("name").notEmpty().isString(),
    (0, express_validator_1.body)("ip").notEmpty().isString(),
];
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
const register_viewRouter = (0, express_1.Router)();
register_viewRouter.post("/", validate, validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, pageId, date, browser, os, timezone, loadtime, name, wallet, ip, } = req.body;
    try {
        const key = JSON.parse(process.env.KEY || "");
        const transactionId = yield (0, aoconnect_1.message)({
            signer: (0, aoconnect_1.createDataItemSigner)(key),
            process: constant_1.PROCESS,
            tags: [
                {
                    name: "Action",
                    value: "register_view",
                },
                {
                    name: "id",
                    value: id,
                },
                {
                    name: "pageid",
                    value: pageId,
                },
                {
                    name: "date",
                    value: date,
                },
                {
                    name: "browser",
                    value: browser,
                },
                {
                    name: "os",
                    value: os,
                },
                {
                    name: "ip",
                    value: ip,
                },
                {
                    name: "timezone",
                    value: timezone,
                },
                {
                    name: "loadtime",
                    value: loadtime,
                },
                {
                    name: "wallet",
                    value: wallet ? wallet : "",
                },
                {
                    name: "name",
                    value: name,
                },
            ],
        });
        yield (0, aoconnect_1.result)({
            process: constant_1.PROCESS,
            message: transactionId,
        });
        res.status(200).send({ status: 1, data: "Added" });
    }
    catch (err) {
        res.status(500).send({ status: 0, data: "Error on Writing process" });
    }
}));
exports.default = register_viewRouter;
