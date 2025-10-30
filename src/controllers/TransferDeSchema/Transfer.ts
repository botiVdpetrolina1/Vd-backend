import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import NFe from "../../database/modelNFe";
import { prisma } from "../..";
import { ObjectId } from "mongodb";

export const transfer = async (req: Request, res: Response): Promise<void> => {
    const batchSize = 50; // Reduza o tamanho do lote se necessário

    try {
        const allNFes = await NFe.find({});

        // Dividir os dados em lotes menores
        for (let i = 0; i < allNFes.length; i += batchSize) {
            const batchNFes = allNFes.slice(i, i + batchSize);

            const createData = [];

            for (const nfe of batchNFes) {
                const existNFe = await prisma.nFe.findFirst({
                    where: {
                        orderCode: nfe.orderCode,
                    },
                });

                if (!existNFe) {
                    const productsData = nfe.products
                        .map(product => {
                            const quantity = parseInt(product.qCom);
                            const productData = {
                                cEAN: product.cEAN,
                                cEANTrib: product.cEANTrib,
                                cProd: product.cProd,
                                indTot: product.indTot,
                                nItemPed: product.nItemPed || null,
                                vProd: product.vProd,
                                vUnCom: product.vUnCom,
                                vUnTrib: product.vUnTrib,
                                xPed: product.xPed || null,
                                xProd: product.xProd,
                                qCom: product.qCom,
                            };
                            return Array.from({ length: quantity }, () => ({
                                ...productData,
                            }));
                        })
                        .flat();

                    createData.push(
                        prisma.nFe.create({
                            data: {
                                codNFe: nfe.codNFe,
                                version: nfe.version,
                                createdAt: nfe.createdAt,
                                verifiedAt: nfe.verifiedAt,
                                userId: new ObjectId("6768b6216d13978d120ed7ad").toString(),
                                orderCode: nfe.orderCode,
                                emitName: nfe.emit.name,
                                emitCnpj: nfe.emit.cnpj,
                                emitIE: nfe.emit.IE,
                                emitCRT: nfe.emit.CRT,
                                enderEmitLgr: nfe.emit.enderEmit.Lgr,
                                enderEmitNro: nfe.emit.enderEmit.nro,
                                enderEmitBairro: nfe.emit.enderEmit.bairro,
                                enderEmitcMun: nfe.emit.enderEmit.cMun,
                                enderEmitxMun: nfe.emit.enderEmit.xMun,
                                enderEmitUF: nfe.emit.enderEmit.uF,
                                enderEmitCep: nfe.emit.enderEmit.cep,
                                enderEmitcPais: nfe.emit.enderEmit.cPais,
                                enderEmitxPais: nfe.emit.enderEmit.xPais,
                                enderEmitFone: nfe.emit.enderEmit.fone,
                                destCpf: nfe.dest.cpf || null,
                                destxNome: nfe.dest.xNome,
                                destEmail: nfe.dest.email,
                                destindIEDest: nfe.dest.indIEDest,
                                enderDestLgr: nfe.dest.enderDest.Lgr,
                                enderDestNro: nfe.dest.enderDest.nro || null,
                                enderDestBairro: nfe.dest.enderDest.bairro,
                                enderDestcMun: nfe.dest.enderDest.cMun,
                                enderDestxMun: nfe.dest.enderDest.xMun,
                                enderDestUF: nfe.dest.enderDest.uF,
                                enderDestCep: nfe.dest.enderDest.cep,
                                enderDestcPais: nfe.dest.enderDest.cPais,
                                enderDestxPais: nfe.dest.enderDest.xPais,
                                enderDestFone: nfe.dest.enderDest.fone,
                                autXmlCpf: nfe.autXML.cpf || null,
                                verified: nfe.verified,
                                table: nfe.table,
                                products: { create: productsData },
                            },
                        })
                    );
                }
            }

            // Usar transação para o lote atual
            await prisma.$transaction(createData);
        }

        res.status(StatusCodes.OK).json({
            message: "Transferência de NFes concluída com sucesso.",
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erro interno do servidor",
        });
    }
};
