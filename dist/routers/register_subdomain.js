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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const sdk_1 = require("@ar.io/sdk");
const redis_1 = __importDefault(require("../redis"));
const validate = [
    (0, express_validator_1.body)("id").notEmpty().isString(),
    (0, express_validator_1.body)("subdomain").notEmpty().isString(),
];
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
const registerSubdomainRouter = (0, express_1.Router)();
registerSubdomainRouter.post("/", validate, validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subdomain = req.body.subdomain;
    const id = req.body.id;
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
    const key = JSON.parse(process.env.KEY || "");
    try {
        const check = yield redis_1.default.get(subdomain);
        if (check || check === true) {
            res.status(200).send({ status: 0, data: "Handle Already Register" });
            return;
        }
        try {
            const ant = sdk_1.ANT.init({
                signer: new sdk_1.ArweaveSigner(key),
                processId: "WtdOKFeXCLPbl3QESUuICvKdiLLlBTp04SVWCQUC__w",
            });
            const tx = yield ant.setRecord({
                undername: subdomain,
                transactionId: id,
                ttlSeconds: 3600,
            }, { tags: [{ name: "App-Name", value: subdomain }] });
            if (tx.id && tx.id.length) {
                yield redis_1.default.set(subdomain, true);
                res.status(200).send({ status: 1, data: "Done" });
                return;
            }
            else {
                res.status(200).send({ status: 0, data: "Failed" });
                return;
            }
        }
        catch (err) {
            console.log(err);
            res.status(200).send({ status: 0, data: String(err) });
            return;
        }
    }
    catch (err) {
        res
            .status(200)
            .send({ status: 0, data: "Failed to execute on Redis Server" });
    }
    res.status(200).send({ status: 0, data: "Something Bad hapen" });
}));
exports.default = registerSubdomainRouter;
function isAlphaNumeric(input) {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(input);
}
