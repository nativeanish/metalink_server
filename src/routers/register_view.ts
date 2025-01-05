import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { message, result, createDataItemSigner } from "@permaweb/aoconnect";
import { PROCESS } from "../utils/constant";
interface State {
  id: string;
  pageId: string;
  date: string;
  browser: string;
  os: string;
  timezone: string;
  loadtime: string;
  name: string;
  wallet?: string;
}

const validate = [
  body("id").notEmpty().isString(),
  body("pageId").notEmpty().isString(),
  body("date").notEmpty().isString(),
  body("browser").notEmpty().isString(),
  body("os").notEmpty().isString(),
  body("timezone").notEmpty().isString(),
  body("loadtime").notEmpty().isString(),
  body("name").notEmpty().isString(),
];

const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

const register_viewRouter = Router();

register_viewRouter.post(
  "/",
  validate,
  validateRequest,
  async (req: Request<{}, {}, State>, res: Response) => {
    const ip = req.ip;
    const { id, pageId, date, browser, os, timezone, loadtime, name, wallet } =
      req.body;
    try {
      const key = JSON.parse(process.env.KEY || "");
      const transactionId = await message({
        signer: createDataItemSigner(key),
        process: PROCESS,
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
            value: ip ? ip : "localhost",
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
      await result({
        process: PROCESS,
        message: transactionId,
      });
      res.status(200).send({ status: 1, data: "Added" });
    } catch (err) {
      res.status(500).send({ status: 0, data: "Error on Writing process" });
    }
  }
);

export default register_viewRouter;
