import { Router } from "express";
import { NfeController } from "../controllers/NFe";
import multer from 'multer';

const router = Router()

const storage = multer.memoryStorage()

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
})

router.get('/get/all', NfeController.getAllNFe)
router.get('/get/:id', NfeController.getNFeById)
router.post('/post', upload.array('xmlFiles'), NfeController.createNFe)
router.put('/put', NfeController.updateNFe)


export default router





