import { Request, Response } from 'express';
import { IUserService } from '../services/UserService';

export default class UserController {
  constructor(private userService: IUserService) {}

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await this.userService.login({ email, password });

    res.status(200).json(token);
  };

  validate = async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const token = authorization as string;

    const role = await this.userService.validate(token);

    res.status(200).json({ role });
  };
}
