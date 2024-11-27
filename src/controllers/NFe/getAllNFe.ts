import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../..";

export const getAllNFe = async (req: Request, res: Response): Promise<any> => {
  try {
    const { page = 1, limit = 10, orderCode = "" } = req.query;

    const pageNumber = Math.max(parseInt(page as string, 10), 1);
    const limitNumber = Math.max(parseInt(limit as string, 10) || 10, 1);

    // Converte `orderCode` para número se for fornecido
    const searchCondition =
    orderCode !== ""
      ? { orderCode: Number(orderCode) } // Filtro para números
      : {};
  

    const resultDocumentsVerified = await prisma.nFe.findMany({
      where: {
        verified: true,
        ...searchCondition,
      },
      orderBy: { verifiedAt: "desc" },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      include: {
        products: true,
      },
    });

    const resultDocumentsNotVerified = await prisma.nFe.findMany({
      where: {
        verified: false,
        ...searchCondition,
      },
      orderBy: { verifiedAt: "desc" },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      include: {
        products: true,
      },
    });

    const totalDocumentsVerified = await prisma.nFe.count({
      where: { verified: true, ...searchCondition },
    });
    const totalDocumentsNotVerified = await prisma.nFe.count({
      where: { verified: false, ...searchCondition },
    });

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
        resNotVerified: resultDocumentsNotVerified,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar NFe:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Algo deu errado",
    });
  }
};