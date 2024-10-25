import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import NFe, { INFe } from "../../database/modelNFe";

export const getAllNFe = async (req: Request, res: Response): Promise<any> => {
  try {
    const { page = 1, limit = 10} = req.query;

    const pageNumber = Math.max(parseInt(page as string, 10), 1); // Página sempre será no mínimo 1
    const limitNumber = parseInt(limit as string, 10);

    const resultDocumentsVerified = await NFe.find({ verified: true })
      .sort({ verifiedAt: -1 }) // Ordena pela data de verificação mais recente
      .skip((pageNumber - 1) * limitNumber) // Pula os itens de páginas anteriores
      .limit(limitNumber); // Limita o número de itens retornados por página
      
    const resultDocumentsNotVerified = await NFe.find({ verified: false })
      .sort({ verifiedAt: -1 }) // Ordena pela data de verificação mais recente
      .skip((pageNumber - 1) * limitNumber) // Pula os itens de páginas anteriores
      .limit(limitNumber); // Limita o número de itens retornados por página

    // Se nenhum resultado for encontrado
    if (!resultDocumentsVerified || resultDocumentsVerified.length === 0 && !resultDocumentsNotVerified || resultDocumentsNotVerified.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Nenhuma nota encontrada",
      });
    }

    // Contagem do total de documentos
    const totalDocumentsVerified = await NFe.countDocuments({ verified: true });
    const totalDocumentsNotVerified = await NFe.countDocuments({ verified: false });
    const totalPagesVerified = Math.ceil(totalDocumentsVerified / limitNumber);
    const totalPagesNotVerified = Math.ceil(totalDocumentsNotVerified / limitNumber);

    return res.status(StatusCodes.OK).json({
      totDocVerified: totalDocumentsVerified,
      totDocNotVerified: totalDocumentsNotVerified,
      totPagesVerified: totalPagesVerified,
      totPagesNotVerified: totalPagesNotVerified,
      currentPage: pageNumber,
      data: {
        resVerified: resultDocumentsVerified,
        resNotVerified: resultDocumentsNotVerified
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Algo deu errado",
    });
  }
};
