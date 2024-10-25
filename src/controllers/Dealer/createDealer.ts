import { Request, Response } from "express";
import xlsx from 'xlsx';
import Dealer from "../../database/modelDealer";
const fs = require('fs');

interface FinalObject {
    [key: string]: any[]; // Definindo que as chaves são strings e os valores são arrays
}

const finalObject: FinalObject = {};


export const createDealer = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).send('Nenhum arquivo foi enviado.');
        return;
    }

    const fileBuffer = req.file.buffer;

    try {
        // Converte o buffer do arquivo Excel para JSON
        const data = xlsx.read(fileBuffer, { type: 'buffer' });

        console.log('Dados da planilha:', data); // Log do conteúdo da planilha

        // Processa cada planilha no arquivo
        data.SheetNames.forEach(sheetName => {
            const rowObject = xlsx.utils.sheet_to_json(data.Sheets[sheetName]);
            finalObject[sheetName] = rowObject; // Armazena no objeto final
        });

        console.log('Objeto final:', finalObject.Pag); // Log do objeto final
        
        const dealers = finalObject.Pag.map((item) => ({
            orderCode: item.CodigoPedido,
            responsibleStructure: item['Responsável Estrutura']
        }))

        await Dealer.insertMany(dealers)
        
        res.json(finalObject); // Retorna o objeto final como resposta



    } catch (error) {
        console.error('Erro ao processar o arquivo:', error);
        res.status(500).send('Erro ao processar o arquivo.');
    }
};

// // Função para converter o arquivo Excel em JSON
// function excelToJson(fileBuffer: Buffer): { [key: string]: string } {
//     const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    
//     // Assumindo que só existe uma planilha
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     // Converte a aba em um array de objetos
//     const jsonData = xlsx.utils.sheet_to_json(sheet);

//     // Mapeia CodigoPedido para Responsável
//     const pedidoParaNome: { [key: string]: string } = {};
//     jsonData.forEach((row: any) => {
//         const codigoPedido = row["CodigoPedido"];
//         const responsavel = row["Responsável"];
//         if (codigoPedido && responsavel) { // Verifica se ambos existem
//             pedidoParaNome[codigoPedido] = responsavel;
//         }
//     });

//     return pedidoParaNome;
// }
