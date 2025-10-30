import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../index';

export const updateCurrentUser = async (req: Request, res: Response): Promise<any>  => {


    try {
        const { name, username } = req.body

        const user = await prisma.user.findUnique({ where: { id: req.body.userId } })

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" }) // se user nao existir retornamos O Codigo 401 
        }

        await prisma.user.update({where: {
            id: user.id
        }, 
        data: {
            name: name,
            username: username
        }})
        return res.status(StatusCodes.NO_CONTENT).send(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to update a user" })
    }

}