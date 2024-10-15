

import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import NFe, { INFe } from "../../database/modelNFe";


export const getNFeById = async (req: Request, res: Response): Promise<INFe | any> => {

    try {
        
        const { id } = req.params;

        const result = await NFe.findOne({codNFe: id})

        if (!result) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Nota fiscal não encontrada"
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