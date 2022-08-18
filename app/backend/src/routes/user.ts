import { Router } from 'express';
import { validateBody,
  validateEmail,
  validatePassword } from '../middleware/user/validateLoginBody';
import UserController from '../controller/UserController';
import UserService from '../services/UserService';

const userService = new UserService();
const userController = new UserController(userService);

const router = Router();

router.post(
  '/login',
  validateBody,
  validateEmail,
  validatePassword,
  (req, res) => userController.login(req, res),
);

export default router;
