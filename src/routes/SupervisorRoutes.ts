import { Router } from "express";
import { SupervisorController } from "../controllers/Supervisor";
import multer from 'multer';

const router = Router()

const storage = multer.memoryStorage()

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // Limite de 50MB
    },
}).single('xlsxFile');

router.post('/post', upload, SupervisorController.createSupervisor)

export default router





