const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../index";

export const getUser = async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.body;

  try {
    console.log(userId)
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      },
    });

    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
            message: 'User not Found',
          });
    }

    return res.status(StatusCodes.OK).json(user);
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error logging in',
      error: error.message,
    });
  }
};
