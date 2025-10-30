import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../index";


export const getNFeById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const orderCode = !isNaN(Number(id)) && Number(id) <= Number.MAX_SAFE_INTEGER 
      ? Number(id) 
      : undefined;

    // Cria as condições de busca dinamicamente
    const whereConditions: any[] = [{ codNFe: id }];
    if (orderCode !== undefined) {
      whereConditions.push({ orderCode });
    }

    const nfe = await prisma.nFe.findFirst({
      where: {
        OR: whereConditions,
      },
      include: {
        products: true
      }
    });

    if (!nfe) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Nota fiscal não encontrada",
      });
    }


    const dealer = await prisma.dealer.findFirst({
      where: {
        orderCode: nfe?.orderCode
      }
    });

    console.log(dealer)

    const result = {
      nfe: nfe,
      dealer: dealer || null
    };

    return res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    console.error("Error fetching NFe:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Algo deu errado",
      error: error.message 
    });
  }
};
