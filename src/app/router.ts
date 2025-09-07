import { Router } from "express";

import AuthRootRouter from "../features/auth/authRoot.router";
import AuthChecker from "../middleware/authChecker/authChecker";

export default class RootRouter {
  public Router = Router();
  private authRootRouter = new AuthRootRouter();

  // Auth checker
  private authChecker = new AuthChecker();
  constructor() {
    this.callRouter();
  }

  private callRouter() {
    // Auth Routes
    this.Router.use("/auth", this.authRootRouter.AuthRouter);
  }
}
