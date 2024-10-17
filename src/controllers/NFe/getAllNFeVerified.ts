import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import NFe, { INFe } from "../../database/modelNFe";

export const getAllNFeVerified = async (req: Request, res: Response): Promise<INFe | any> => {
  try {

    const verifiedNFe = await NFe.find({ verified: true });
    return res.status(StatusCodes.OK).json(verifiedNFe);

  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Algo deu errado",
    });
  }
};
