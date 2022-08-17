import { Request, Response } from 'express';
import { IUserService } from '../services/UserService';

export default class UserController {
  constructor(private userService: IUserService) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const token = await this.userService.login({ email, password });

    res.status(200).json(token);
  }
}
