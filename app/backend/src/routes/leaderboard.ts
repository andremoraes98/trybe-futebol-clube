import { Request, Response, Router } from 'express';
import HomeLeaderController from '../controller/HomeLeaderController';
import HomeLeaderService from '../services/HomeLeaderService';
import AwayLeaderController from '../controller/AwayLeaderController';
import AwayLeaderService from '../services/AwayLeaderService';

const homeLeaderService = new HomeLeaderService();
const homeLeaderController = new HomeLeaderController(homeLeaderService);
const awayLeaderService = new AwayLeaderService();
const awayLeaderController = new AwayLeaderController(awayLeaderService);

const route = Router();

route.get(
  '/home',
  (req: Request, res: Response) => homeLeaderController.getHomeClassification(req, res),
);

route.get(
  '/away',
  (req: Request, res: Response) => awayLeaderController.getAwayClassification(req, res),
);

export default route;
