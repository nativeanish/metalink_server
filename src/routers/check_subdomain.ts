import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

interface State {
  subdomain: string;
}

const validate = [body("subdomain").notEmpty().isString()];

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

const check_subdomainRouter = Router();

check_subdomainRouter.post(
  "/",
  validate,
  validateRequest,
  async (req: Request<{}, {}, State>, res: Response) => {
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
  }
);

export default check_subdomainRouter;
function isAlphaNumeric(input: string): boolean {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(input);
}
