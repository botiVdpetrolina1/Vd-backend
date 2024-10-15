

import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import NFe, { INFe } from "../../database/modelNFe";


export const getAllNFe = async (req: Request, res: Response): Promise<INFe | any> => {

    try {
        

        const result = await NFe.find()

        if (!result) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Nenhuma nota encontrada"
            })
            
        }

        return res.status(StatusCodes.OK).json(result)

    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "something went wrong"
        })
    }

}