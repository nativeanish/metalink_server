import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { message, result, createDataItemSigner } from "@permaweb/aoconnect";
import { PROCESS } from "../utils/constant";
interface State {
  id: string;
  viewId: string;
  date: string;
  name: string;
}

const validate = [
  body("id").notEmpty().isString(),
  body("viewId").notEmpty().isString(),
  body("date").notEmpty().isString(),
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

const register_clickRouter = Router();

register_clickRouter.post(
  "/",
  validate,
  validateRequest,
  async (req: Request<{}, {}, State>, res: Response) => {
    const { id, viewId, date, name } = req.body;
    try {
      const key = JSON.parse(process.env.KEY || "");
      const transactionId = await message({
        signer: createDataItemSigner(key),
        process: PROCESS,
        tags: [
          { name: "Action", value: "register_click" },
          {
            name: "id",
            value: id,
          },
          {
            name: "viewid",
            value: viewId,
          },
          {
            name: "date",
            value: date,
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

export default register_clickRouter;
