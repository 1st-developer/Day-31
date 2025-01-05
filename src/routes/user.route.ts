import { Router } from 'express';
import { loginUser, registerUser, resetPassword, whoami } from '../controllers/user.controller';
import { loginUserSchema, RegistrationSchema } from '../../schema/user';
import { validationMiddleware } from '../../middlewares/validation';
import { authenticate } from '../../middlewares/authenticate.middleware';
const router = Router();

router.post('/new', RegistrationSchema, validationMiddleware, registerUser);
router.post('/login', loginUserSchema, validationMiddleware, loginUser);
router.get('/whoami', authenticate, whoami);
router.post('/reset-password', resetPassword);

export default router;
