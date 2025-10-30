const jwt = require('jsonwebtoken');


import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../index';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Token not provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.body.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};



export const jwtParse = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { authorization } = req.headers;
  if(!authorization || !authorization.startsWith("Bearer")) {
      console.log("Caiu no if !authorization !authorization.startsWith")
      return res.sendStatus(StatusCodes.UNAUTHORIZED).json({ message: "Unathorized" })
  }
  const token = authorization.split(' ')[1];

  try {
      console.log("executando o auth middlware")
      const decoded = jwt.decode(token)
      console.log(decoded)

      const user = await prisma.user.findUnique({ where: { id: decoded.id } })

      if(!user) {
          return res.sendStatus(StatusCodes.NOT_FOUND)
      }
      req.body.userId = user.id.toString()
      next()
  } catch (error) {
      console.log(error)
      return res.sendStatus(StatusCodes.UNAUTHORIZED)
  }
}