const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import { prisma } from "../../index";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validation } from "../../middleware/validation";
import * as yup from 'yup'

interface User {
    email: string;
    name: string
}

export const createUserValidation = validation(getSchema =>({
    body: getSchema<User>(yup.object().shape({
        email: yup.string().required().email().min(5),
        name: yup.string().required().min(1),
        password: yup.string().required().min(5),
    }))
}));

export const createUser = async (req: Request, res: Response): Promise<User | any> => {
  
  const { name, email, password } = req.body;

  try {

    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email ou senha inválidos' });
    }

    const existingUser = await prisma.user.findUnique({ where: {
      email: email
    } })

    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Usuário ja existe"
      })
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    });

    return res.status(StatusCodes.CREATED).json({ message: 'User registered successfully', newUser });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating user', error });
  }
}