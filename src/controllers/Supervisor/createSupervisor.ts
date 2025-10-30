import { Request, Response } from "express";
import xlsx from 'xlsx';
import Dealer, { IDealer } from "../../database/modelDealer";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../..";

interface FinalObject {
    [key: string]: any[]; 
}

const finalObject: FinalObject = {};


export const createSupervisor = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).send('Nenhum arquivo foi enviado.');
        return;
    }
    const extractedDataArray: IDealer[] = [];
    const fileBuffer = req.file.buffer;

    try {
        
        const data = xlsx.read(fileBuffer, { type: 'buffer' });

        data.SheetNames.forEach(sheetName => {
            const rowObject = xlsx.utils.sheet_to_json(data.Sheets[sheetName]);
            finalObject[sheetName] = rowObject; 
        });

        const dealers = finalObject.Pag.map((item) => ({
            orderCode: item.CodigoPedido,
            responsibleStructure: item['Responsável Estrutura'] || null,
            deliveryForecast: item['Previsão Entrega'] || null,
            batch: item['Lote de separação']
        }));
        
        for (const file of dealers) {
            const existingData = await prisma.dealer.findFirst({ where: {
                orderCode: file.orderCode } });

            if (existingData) {
                console.log(`NFe com código ${file.orderCode} já existe. Ignorando duplicata.`);
                continue; 
            }


            const dataUpdated = {
                orderCode: file.orderCode,
                responsibleStructure: file.responsibleStructure,
                deliveryForecast: file.deliveryForecast,
                batch: file.batch,
            }

            extractedDataArray.push(dataUpdated)

        }

        if (extractedDataArray.length > 0) {
            const result = await prisma.dealer.createMany( { data: dealers })
            res.status(StatusCodes.CREATED).json(result);
            return;
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Nenhuma nova Planilha a ser inserida"
            });
            return;
        }


    } catch (error) {
        console.error('Erro ao processar o arquivo:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erro interno do servidor"
        });
    }
};

