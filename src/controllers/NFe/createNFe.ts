import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import NFe, { INFe, NFeJson } from "../../database/modelNFe";
import xml2js from 'xml2js';

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

export const createNFe = async (req: Request, res: Response): Promise<INFe | any> => {
    try {
        const xmlFiles = req.files as Express.Multer.File[];
        const extractedDataArray: INFe[] = [];

        if (!xmlFiles || xmlFiles.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "No files uploaded" });
        }

        for (const file of xmlFiles) {
            const xmlString = file.buffer.toString();
            const json = await parseXmlToJson(xmlString);

            console.log(JSON.stringify(json))

            const codNFe = json.nfeProc.NFe[0].infNFe[0].$.Id.replace("NFe", "");

            // Verifique se a NFe já existe antes de processar
            const existingNFe = await NFe.findOne({ codNFe });

            if (existingNFe) {
                console.log(`NFe com código ${codNFe} já existe. Ignorando duplicata.`);
                continue; // Se já existe, ignore e prossiga para o próximo arquivo
            }

            // Processando os produtos
            const products = json.nfeProc.NFe[0].infNFe[0].det.map(det => {
                const quantity = parseInt(det.prod[0].qCom[0]); // Obtém a quantidade a partir de qCom
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
                    qCom: det.prod[0].qCom[0] // Incluindo qCom aqui
                };

                // Replicando o produto conforme a quantidade de qCom
                return Array.from({ length: quantity }, () => ({
                    ...productData,
                    verified: false, // Inicializa como não verificado
                }));
            }).flat(); // Achata o array de arrays em um único array

            // Prepara os dados da NFe a serem inseridos
            const extractedData: INFe = {
                codNFe: codNFe,
                emit: {
                    name: json.nfeProc.NFe[0].infNFe[0].emit[0].xNome[0],
                    cnpj: json.nfeProc.NFe[0].infNFe[0].emit[0].CNPJ[0],
                    enderEmit: {
                        Lgr: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].xLgr[0],
                        nro: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].nro[0],
                        bairro: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].xBairro[0],
                        cMun: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].cMun[0],
                        xMun: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].xMun[0],
                        uF: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].UF[0],
                        cep: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].CEP[0],
                        cPais: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].cPais[0],
                        xPais: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].xPais[0],
                        fone: json.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].fone[0],
                    },
                    IE: json.nfeProc.NFe[0].infNFe[0].emit[0].IE[0],
                    CRT: json.nfeProc.NFe[0].infNFe[0].emit[0].CRT[0],
                },
                
                version: json.nfeProc.NFe[0].infNFe[0].$.versao,
                autXML: {
                    cpf: json.nfeProc.NFe[0].infNFe[0].autXML?.[0]?.CPF?.[0] || null,
                }, 
                products, // Utiliza a lista de produtos processada
                verified: false,
                createdAt: new Date(),
                verifiedAt: new Date(),
                table: null,
                orderCode: Number(json.nfeProc.NFe[0].infNFe[0].det[0].prod[0].xPed)
            };

            extractedDataArray.push(extractedData);
        }

        // Se existirem dados a serem inseridos, realiza a inserção
        if (extractedDataArray.length > 0) {
            const result = await NFe.insertMany(extractedDataArray);
            return res.status(StatusCodes.CREATED).json(result);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Nenhuma nova NFe a ser inserida"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong"
        });
    }
};
