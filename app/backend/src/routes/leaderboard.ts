import { Request, Response, Router } from 'express';
import HomeLeaderController from '../controller/HomeLeaderController';
import HomeLeaderService from '../services/HomeLeaderService';
import AwayLeaderController from '../controller/AwayLeaderController';
import AwayLeaderService from '../services/AwayLeaderService';
import LeaderController from '../controller/LeaderController';
import LeaderService from '../services/LeaderService';

const homeLeaderService = new HomeLeaderService();
const homeLeaderController = new HomeLeaderController(homeLeaderService);
const awayLeaderService = new AwayLeaderService();
const awayLeaderController = new AwayLeaderController(awayLeaderService);
const leaderService = new LeaderService();
const leaderController = new LeaderController(leaderService);

const route = Router();

route.get(
  '/',
  (req: Request, res: Response) => leaderController.getAwayClassification(req, res),
);

route.get(
  '/home',
  (req: Request, res: Response) => homeLeaderController.getHomeClassification(req, res),
);

route.get(
  '/away',
  (req: Request, res: Response) => awayLeaderController.getAwayClassification(req, res),
);

export default route;
