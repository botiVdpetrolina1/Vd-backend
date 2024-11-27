import { Router } from "express";
import { TransferController } from "../controllers/TransferDeSchema";

const router = Router()


router.post('/post', TransferController.transfer)

export default router




