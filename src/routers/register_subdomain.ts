import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { ANT, ArweaveSigner } from "@ar.io/sdk";

interface State {
  id: string;
  subdomain: string;
}

const validate = [
  body("id").notEmpty().isString(),
  body("subdomain").notEmpty().isString(),
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

const registerSubdomainRouter = Router();

registerSubdomainRouter.post(
  "/",
  validate,
  validateRequest,
  async (req: Request<{}, {}, State>, res: Response) => {
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
      const ant = ANT.init({
        signer: new ArweaveSigner(key),
        processId: "WtdOKFeXCLPbl3QESUuICvKdiLLlBTp04SVWCQUC__w",
      });
      const tx = await ant.setRecord(
        {
          undername: subdomain,
          transactionId: id,
          ttlSeconds: 3600,
        },
        { tags: [{ name: "App-Name", value: subdomain }] }
      );
      if (tx.id && tx.id.length) {
        res.status(200).send({ status: 1, data: "Done" });
        return;
      } else {
        res.status(200).send({ status: 0, data: "Failed" });
        return;
      }
    } catch (err) {
      console.log(err);
      res.status(200).send({ status: 0, data: String(err) });
      return;
    }
  }
);

export default registerSubdomainRouter;
function isAlphaNumeric(input: string): boolean {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(input);
}
