import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../..";

export const getAllNFeNoOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { page = 1, limit = 10, orderCode = "", startDate, endDate } = req.query;

    const pageNumber = Math.max(parseInt(page as string, 10), 1);
    const limitNumber = Math.max(parseInt(limit as string, 10) || 10, 1);

    // Criação da condição de filtro
    const searchCondition: any = {};

    if (orderCode) {
      searchCondition.orderCode = Number(orderCode);
    }

    if (startDate || endDate) {
      searchCondition.verifiedAt = {};
      if (startDate) {
        searchCondition.verifiedAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        searchCondition.verifiedAt.lte = new Date(endDate as string);
      }
    }

    // Query para buscar os documentos
    const resultDocuments = await prisma.nFe.findMany({
      where: searchCondition,
      orderBy: { verifiedAt: "desc" },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      include: {
        products: true,
      },
    });

    // Query para contar os documentos totais
    const totalDocuments = await prisma.nFe.count({
      where: searchCondition,
    });

    const totalPages = Math.ceil(totalDocuments / limitNumber);

    return res.status(StatusCodes.OK).json({
      totDoc: totalDocuments,
      totPages: totalPages,
      currentPage: pageNumber,
      data: resultDocuments,
    });
  } catch (error) {
    console.error("Erro ao buscar NFe:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Algo deu errado",
    });
  }
};
