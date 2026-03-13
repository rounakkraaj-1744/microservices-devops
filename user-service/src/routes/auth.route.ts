import { Router } from "express"
import {UserController} from "../controllers/user.controller"

export const authRouter = Router();
const user = new UserController()

authRouter.post("/register", user.register);

authRouter.post("/login", user.login);