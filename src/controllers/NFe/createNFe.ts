import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import NFe, { INFe, NFeJson } from "../../database/modelNFe";
import xml2js from 'xml2js';
import { prisma } from "../../index";
import { create } from "domain";
import { ObjectId } from "mongodb";

const parseXmlToJson = (xmlData: any): Promise<NFeJson> => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xmlData, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result as NFeJson);
        });
    });
}

export const createNFe = async (req: Request, res: Response): Promise<any> => {
    try {
        const xmlFiles = req.files as Express.Multer.File[];

        if (!xmlFiles || xmlFiles.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "No files uploaded" });
        }

        const userId = new ObjectId(req.body.userId)

        for (const file of xmlFiles) {
            const xmlString = file.buffer.toString();
            const json = await parseXmlToJson(xmlString);

            const codNFe = json.nfeProc.NFe[0].infNFe[0].$.Id.replace("NFe", "");

            // Verificar se a NFe já existe
            const existingNFe = await prisma.nFe.findFirst({
                where: { codNFe },
            });

            if (existingNFe) {
                console.log(`NFe com código ${codNFe} já existe. Ignorando duplicata.`);
                continue;
            }


            // Criar os produtos
            const productsData = json.nfeProc.NFe[0].infNFe[0].det.map(det => {
                const quantity = parseInt(det.prod[0].qCom[0]);
                const productData = {
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
                    qCom: det.prod[0].qCom[0] 
                };

                return Array.from({ length: quantity }, () => ({
                    ...productData,
                }));
            }).flat();

            const newNFe = await prisma.nFe.create({
                data: {
                    codNFe,
                    version: json.nfeProc.NFe[0].infNFe[0].$.versao,
                    createdAt: new Date(),
                    verifiedAt: new Date(),
                    userId: userId.toString(),
                    orderCode: Number(json.nfeProc.NFe[0].infNFe[0].det[0].prod[0].xPed),

                    emitName: json.nfeProc.NFe[0].infNFe[0].emit[0].xNome[0],
                    emitCnpj: json.nfeProc.NFe[0].infNFe[0].emit[0].CNPJ[0],
                    emitIE: json.nfeProc.NFe[0].infNFe[0].emit[0].IE[0],
                    emitCRT:json.nfeProc.NFe[0].infNFe[0].emit[0].CRT[0],
                    enderEmitLgr: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].xLgr[0],
                    enderEmitNro: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].nro[0],
                    enderEmitBairro: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].xBairro[0],
                    enderEmitcMun: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].cMun[0],
                    enderEmitxMun: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].xMun[0],
                    enderEmitUF: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].UF[0],
                    enderEmitCep: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].CEP[0],
                    enderEmitcPais: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].cPais[0],
                    enderEmitxPais: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].xPais[0],
                    enderEmitFone: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].fone[0],

                    destCpf: json.nfeProc.NFe[0].infNFe[0].dest[0].CPF?.[0] || null,
                    destxNome: json.nfeProc.NFe[0].infNFe[0].dest[0].xNome?.[0],
                    destEmail: json.nfeProc.NFe[0].infNFe[0].dest[0].email?.[0],
                    destindIEDest: json.nfeProc.NFe[0].infNFe[0].dest[0].indIEDest?.[0],
                    enderDestLgr: json.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].xLgr?.[0],
                    enderDestNro: json.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].nro?.[0] || null,
                    enderDestBairro: json.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].xBairro?.[0],
                    enderDestcMun: json.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].cMun?.[0],
                    enderDestxMun: json.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].xMun?.[0],
                    enderDestUF: json.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].UF?.[0],
                    enderDestCep: json.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].CEP?.[0],
                    enderDestcPais: json.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].cPais?.[0],
                    enderDestxPais: json.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].xPais?.[0],
                    enderDestFone: json.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].fone?.[0],
                    autXmlCpf: json.nfeProc.NFe[0].infNFe[0].autXML?.[0]?.CPF?.[0] || null,

                    verified: false,

                    products: {
                        create: productsData,
                    },
                    
                },
            });

            console.log(`NFe criada com ID: ${newNFe.id}`);
        }

        return res.status(StatusCodes.CREATED).json({ message: "NFes criadas com sucesso!" });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erro ao processar NFes",
        });
    }
};
