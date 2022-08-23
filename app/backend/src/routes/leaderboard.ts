import { Request, Response, Router } from 'express';
import HomeLeaderController from '../controller/HomeLeaderController';
import HomeLeaderService from '../services/HomeLeaderService';

const homeLeaderService = new HomeLeaderService();
const homeLeaderController = new HomeLeaderController(homeLeaderService);

const route = Router();

route.get(
  '/home',
  (req: Request, res: Response) => homeLeaderController.getHomeClassification(req, res),
);

export default route;
