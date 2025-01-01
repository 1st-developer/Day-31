import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/request';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req?.headers?.authorization;

    if (!authHeader) {
      res.status(401).json({
        isSuccess: false,
        message: 'Unauthorized (NO AUTHHEADER)'
      });

      return;
    }

    // Bearer token
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        isSuccess: false,
        message: 'Unauthorized (NO TOKEN)'
      });

      return;
    }

    const result: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    if (!result) {
      res.status(401).json({
        isSuccess: false,
        message: 'Unauthorized (NO RESULT)'
      });

      return;
    }

    req.userId = result.userId;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      isSuccess: false,
      message: 'Unauthorized'
    });
  }
};
