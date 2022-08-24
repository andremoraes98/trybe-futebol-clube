import { Indexable } from './Username';

export default interface IMatch extends Indexable {
  homeTeam: number;
  awayTeam: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
  inProgress: boolean;
}
