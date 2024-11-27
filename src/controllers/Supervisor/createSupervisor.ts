import { Request, Response } from "express";
import xlsx from 'xlsx';
import Supervisor from "../../database/modelSupervisor";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../..";

export interface ISupervisor  {
    cpf_cnpj: string | null;
    responsibleStructure: string | null,
}


interface FinalObject {
    [key: string]: any[];
}


export const createSupervisor = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(StatusCodes.BAD_REQUEST).send('Nenhum arquivo foi enviado.');
        return;
    }

    const fileBuffer = req.file.buffer;

    try {
        const data = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheetName = data.SheetNames[0];
        const sheet = data.Sheets[sheetName];
        const supervisores: ISupervisor[] = xlsx.utils.sheet_to_json(sheet, { header: 1 })
            .map((item: any) => ({
                cpf_cnpj: item[0] ? item[0].toString().trim() : null,
                responsibleStructure: item[1] || null,
            }))
            .filter(supervisor => supervisor.cpf_cnpj); // Filtrar supervisores sem CPF

        // Carregar supervisores existentes no banco
        const existingSupervisors = await prisma.dealer.findMany({
            select: { cpf_cnpj: true },
        });
        const existingCpfCnpjs = new Set(existingSupervisors.map(s => s.cpf_cnpj));

        // Filtrar duplicatas antes da inserção
        const newSupervisors = supervisores.filter(s => !existingCpfCnpjs.has(s.cpf_cnpj));

        if (newSupervisors.length > 0) {
            const result = await prisma.dealer.createMany({
                data: newSupervisors,
            });
            res.status(StatusCodes.CREATED).json({ insertedCount: result.count });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Nenhuma nova entrada a ser inserida",
            });
        }
    } catch (error) {
        console.error('Erro ao processar o arquivo:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erro interno do servidor",
        });
    }
};
