import { Router } from "express";
import { UserController } from "../controllers/User";
import { jwtParse } from "../middleware/auth";

const router = Router();

router.post("/", UserController.createUser);
router.get("/", jwtParse, UserController.getUser);
router.put("/", jwtParse, UserController.updateCurrentUser);
router.post("/login", UserController.loginUser);

export default router;
