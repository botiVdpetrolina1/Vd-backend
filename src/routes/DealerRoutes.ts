import { ErrorRequestHandler, Router } from "express";
import multer, { MulterError } from 'multer';
import { DealerController } from "../controllers/Dealer";

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // Limite de 50MB
    },
}).single('xlsxFile'); // Alterado para .single para aceitar apenas um arquivo


// Rota de upload com middleware de erro
router.post('/post', upload, DealerController.createDealer);

export default router;
