import { body } from 'express-validator';

export const CreateCommentSchema = [
  body('comment').isLength({ min: 3, max: 128 }).withMessage(
      'Comment must be atleast 3 characters long and 128 characters at most'
    ),

  body('articleId').isNumeric()
];
