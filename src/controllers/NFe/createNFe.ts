



import { Request, Response } from "express";

import { StatusCodes } from "http-status-codes";

import NFe, {INFe, NFeJson} from "../../database/modelNFe";
import xml2js from 'xml2js'


const parseXmlToJson = (xmlData: any): Promise<NFeJson> => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xmlData, (err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result as NFeJson)
        })
    })
}


export const createNFe = async (req: Request, res: Response): Promise<INFe | any> => {


    try {
        
        const xmlFiles = req.files as Express.Multer.File[];
        const extractedDataArray: INFe[] = [];

        if (!xmlFiles || xmlFiles.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "No files uploaded" });
        }

        for (const file of xmlFiles) {
            const xmlString = file.buffer.toString()
            const json = await parseXmlToJson(xmlString)

            const extractedData: INFe = {
                codNFe: json.nfeProc.NFe[0].infNFe[0].$.Id.replace("NFe", ""),
                version: json.nfeProc.NFe[0].infNFe[0].$.versao,
                autXML: {
                    cpf: json.nfeProc.NFe[0].infNFe[0].autXML?.[0]?.CPF?.[0] || null,
                },
                products: json.nfeProc.NFe[0].infNFe[0].det.map((det) => ({
                        cEAN: det.prod[0].cEAN[0],
                        cEANTrib: det.prod[0].cEANTrib[0],
                        cProd: det.prod[0].cProd[0],
                        indTot: det.prod[0].indTot[0],
                        nItemPed: det.prod[0].nItemPed?.[0] || null,
                        vProd: det.prod[0].vProd[0],
                        vUnCom: det.prod[0].vUnCom[0],
                        vUnTrib: det.prod[0].vUnTrib[0],
                        xPed: det.prod[0].xPed?.[0] || null,
                        xProd: det.prod[0].xProd[0],
                    })),
                    verified: false,
                    createdAt: new Date(),
                    verifiedAt: new Date()
            };
            const existingNFe = await NFe.findOne({codNFe: json.nfeProc.NFe[0].infNFe[0].$.Id})


            if (!existingNFe) {
                extractedDataArray.push(extractedData)
            }

        }

        const result = await NFe.insertMany(extractedDataArray)
        if (!result) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "something went wrong with creation"
            })
        }
        return res.status(StatusCodes.CREATED).json(extractedDataArray)


    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "something went wrong"
        })
    }

}




