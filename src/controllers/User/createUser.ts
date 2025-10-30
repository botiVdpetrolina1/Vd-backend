const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import { prisma } from "../../index";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password, username } = req.body;

  try {
    if (!email || !password || !name || !username) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "All fields are required",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Email or username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username,
        role: "USER",
        createdAt: new Date(),
      },
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return res.status(StatusCodes.CREATED).json({
      message: "User successfully registered",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};
