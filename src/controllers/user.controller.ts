import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { ILoginUser, IRegisterUser } from '../../types/user';
const prisma = new PrismaClient();
import argon2 from 'argon2';
import { generateToken } from '../../helpers/jwt';
import { AuthRequest } from '../../types/request';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const data: IRegisterUser = req.body;

    // Check if password and confirm password match

    if (data.password !== data.confirmPassword) {
      res.status(400).json({
        isSuccess: false,
        message: 'Password must match'
      });

      return;
    }

    // CHECK IF THE USER IS EXISTING
    const user = await prisma.users.findFirst({
      where: {
        email: data.email
      }
    });

    if (user) {
      res.status(409).json({
        isSuccess: false,
        message: 'User already exists.'
      });

      return;
    }

    // HASH THE PASSWORD

    const hashedPassword = await argon2.hash(data.password);

    // CREATE THE USER

    const newUser = await prisma.users.create({
      data: {
        fullname: data.fullname,
        email: data.email.toLowerCase(),
        phone_number: data.phone_number,
        password: hashedPassword
      }
    });

    res.status(201).json({
      isSuccess: true,
      message: 'Success',
      newUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      isSuccess: false,
      message: 'Something went wrong!'
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const data: ILoginUser = req.body;

    const user = await prisma.users.findUnique({
      where: {
        email: data.email.toLowerCase()
      }
    });

    if (!user) {
      res.status(401).json({
        isSuccess: false,
        message: 'Incorrect email or password'
      });

      return;
    }

    const isPasswordCorrect = await argon2.verify(user.password, data.password);

    if (!isPasswordCorrect) {
      res.status(401).json({
        isSuccess: false,
        message: 'Incorrect email or password'
      });

      return;
    }

    const { password, last_login, ...rest } = user;
    const token = generateToken(user.id);

    res.status(200).json({
      isSuccess: true,
      user: rest,
      token: token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      isSuccess: false,
      message: 'Something went wrong!'
    });
  }
};

export const whoami = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const user = await prisma.users.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: 'User not found'
      });

      return;
    }

    const { password, ...rest } = user;

    res.status(200).json({
      isSuccess: true,
      message: 'Success',
      user: rest
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      isSuccess: false,
      message: 'Something went wrong!'
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    const hashedPassword = await argon2.hash(newPassword);

    const updatedUser = await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      isSuccess: true,
       message: 'Password reset successfully'
       });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
       error: 'Failed to reset password'
    });
  }
};

