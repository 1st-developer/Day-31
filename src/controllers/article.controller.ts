import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { ICreateArtcile } from '../../types/article';
import { AuthRequest } from '../../types/request';
const prisma = new PrismaClient();

export const createArticle = async (req: AuthRequest, res: Response) => {
  try {
    const data: ICreateArtcile = req.body;

    const newArticle = await prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        is_published: data.isPublished,
        user_id: req.userId!
      }
    });

    res.status(200).json({
      isSuccess: true,
      message: 'New article is successfully created!',
      newArticle
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      isSuccess: false,
      message: 'Something went wrong!'
    });
  }
};

// TODO: Get all articles (only published ones)
export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      where: {
        is_published: true
      }
    });

    res.status(200).json({
      isSuccess: true,
      articles
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      isSuccess: false,
      message: 'Something went wrong!'
    });
  }
};

// TODO: Get my articles (published/unpublished)
export const getMyArticles = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const myArticles = await prisma.article.findMany({
      where: {
        user_id: userId
      },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      isSuccess: true,
      articles: myArticles
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      isSuccess: false,
      message: 'Something went wrong!'
    });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updatedArticle = await prisma.article.update({
      where: { id: Number(id) },
      data: { title, content },
    });

    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article' });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.article.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
};

