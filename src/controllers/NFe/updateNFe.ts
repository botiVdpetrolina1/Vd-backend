import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../..";

export const updateNFe = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log(req.body);

    if (!req.body) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Data not provided",
      });
    }

    const { verified, codNFe, table } = req.body;

    // Determina se o codNFe pode ser tratado como número para o campo orderCode
    const orderCode = !isNaN(Number(codNFe)) && Number(codNFe) <= Number.MAX_SAFE_INTEGER 
      ? Number(codNFe) 
      : undefined;

    // Cria as condições de busca dinamicamente
    const whereConditions: any[] = [{ codNFe: codNFe }];
    if (orderCode !== undefined) {
      whereConditions.push({ orderCode });
    }

    // Busca a NFe existente
    const existingNFe = await prisma.nFe.findFirst({
      where: {
        OR: whereConditions,
      },
    });

    if (!existingNFe) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "NFe not found",
      });
    }

    const updatedNFe = await prisma.nFe.update({
      where: { id: existingNFe.id },
      data: {
        verified,
        verifiedAt: new Date(),
        table,
      },
    });

    return res.status(StatusCodes.OK).json({
      message: "NFe updated successfully",
      updatedNFe,
    });
  } catch (error: any) {
    console.error("Error updating NFe:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
