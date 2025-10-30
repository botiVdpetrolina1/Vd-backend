const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import { prisma } from "../../index";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validation } from "../../middleware/validation";
import * as yup from 'yup'

interface User {
    username_or_email: string;
    password: string
}

export const createUserValidation = validation(getSchema =>({
    body: getSchema<User>(yup.object().shape({
        username_or_email: yup.string().required().min(1),
        password: yup.string().required().min(5),
    }))
}));

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { password, username_or_email } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: username_or_email }, { username: username_or_email }],
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' },
    );

    return res.status(StatusCodes.OK).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error logging in',
      error: error.message,
    });
  }
};
