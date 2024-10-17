import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import NFe, { INFe } from "../../database/modelNFe";

export const getAllNFe = async (req: Request, res: Response): Promise<any> => {
  try {
    // const { page = 1, limit = 10 } = req.query;

    // // Converter os valores de page e limit para números
    // const pageNumber = Math.max(parseInt(page as string, 10), 1); // Garante que a página seja no mínimo 1
    // const limitNumber = parseInt(limit as string, 10);

    // Consulta paginada e ordenada
    const result = await NFe.find({})
      .sort({ verifiedAt: -1 })
    //   .skip((pageNumber - 1) * limitNumber) // Ajuste no cálculo de skip
    //   .limit(limitNumber);

    // Se nenhum resultado for encontrado
    if (!result || result.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Nenhuma nota encontrada",
      });
    }

    // Total de documentos para calcular as páginas
    const totalDocuments = await NFe.countDocuments();

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Algo deu errado",
    });
  }
};
