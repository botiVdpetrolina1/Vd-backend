import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import NFe, { INFe } from "../../database/modelNFe";

export const getNFeById = async (req: Request, res: Response): Promise<INFe | any> => {
  try {
    const { id } = req.params;

    // Buscar tanto pelo codNFe quanto pelo xPed em algum dos produtos
    const result = await NFe.findOne({
      $or: [
        { codNFe: id }, // Busca pelo código da NFe
        { "products.xPed": id } // Busca pelo número do pedido dentro dos produtos
      ]
    });

    if (!result) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Nota fiscal não encontrada",
      });
    }

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Algo deu errado",
    });
  }
};
