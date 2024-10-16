import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import NFe from "../../database/modelNFe";

export const updateNFe = async (req: Request, res: Response): Promise<any> => {
  try {
    // Verifique se req.body.data existe
    
    console.log(req.body)
    
    if (!req.body) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Data not provided",
      });
    }

    const { verified, codNFe, table } = req.body; // Desestrutura os dados do corpo da requisição

    const existingNFe = await NFe.findOne({ codNFe: codNFe }); // Encontra a NFe existente

    if (!existingNFe) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "NFe not Found",
      });
    }

    // Atualiza o campo 'verified' da NFe encontrada
    existingNFe.verified = verified; // Atualiza a propriedade 'verified'
    existingNFe.verifiedAt = new Date(); // Atualiza a propriedade 'verified'
    existingNFe.table = table; // Atualiza a propriedade 'verified'
    await existingNFe.save(); // Salva as alterações

    return res.status(StatusCodes.OK).json({
      message: "NFe updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
    });
  }
};
