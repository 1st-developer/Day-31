import { Router } from 'express';
import { CreateArticle } from '../../schema/article';
import { validationMiddleware } from '../../middlewares/validation';
import { authenticate } from '../../middlewares/authenticate.middleware';
import {
  createArticle,
  getAllArticles,
  getMyArticles
} from '../controllers/article.controller';
const router = Router();

router.post(
  '/new',
  authenticate,
  CreateArticle,
  validationMiddleware,
  createArticle
);

router.get('/my-articles', authenticate, getMyArticles);
router.get('/list', getAllArticles);

export default router;
