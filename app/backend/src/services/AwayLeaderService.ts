import Match from '../database/models/Match';
import TeamService from './TeamService';
import Infos from '../interfaces/Leader';

const teamService = new TeamService();

export interface IAwayLeaderService {
  getAwayMatchesFromTeam(teamId: number): Promise<Match[]>;
  getAwayWinsFromTeam(awayMatches: Match[]): number;
  getAwayDrawsFromTeam(awayMatches: Match[]): number;
  getGoals(awayMatches: Match[]): number[];
  getAwayInfoTeam(teamId: number): Promise<Infos>;
  getAwayClassification(): Promise<Infos[]>;
}

export default class AwayLeaderService implements IAwayLeaderService {
  getAwayMatchesFromTeam = async (teamId: number) => {
    const result = await Match.findAll({
      where: {
        awayTeam: teamId,
        inProgress: 0,
      },
    });

    return result;
  };

  getAwayWinsFromTeam = (awayMatches: Match[]) => {
    const victories = awayMatches.reduce((acc, match) => {
      let victory = acc;
      if (match.awayTeamGoals > match.homeTeamGoals) {
        victory += 1;
        return victory;
      }
      return acc;
    }, 0);

    return victories;
  };

  getGoals = (awayMatches: Match[]) => {
    const goalsFavor = awayMatches.reduce((acc, match) => {
      let goals: number = acc;
      goals += match.awayTeamGoals;
      return goals;
    }, 0);

    const goalsOwn = awayMatches.reduce((acc, match) => {
      let goals: number = acc;
      goals += match.homeTeamGoals;
      return goals;
    }, 0);

    return [goalsFavor, goalsOwn];
  };

  getAwayDrawsFromTeam = (awayMatches: Match[]) => {
    const draws = awayMatches.reduce((acc, match) => {
      let draw = acc;
      if (match.homeTeamGoals === match.awayTeamGoals) {
        draw += 1;
        return draw;
      }
      return acc;
    }, 0);

    return draws;
  };

  calculateTotalPoints = (awayMatches: Match[]) => this.getAwayWinsFromTeam(awayMatches) * 3
    + this.getAwayDrawsFromTeam(awayMatches);

  calculateTotalLoses = (awayMatches: Match[]) => awayMatches.length
    - (this.getAwayWinsFromTeam(awayMatches)
    + this.getAwayDrawsFromTeam(awayMatches));

  calculateEfficiency = (awayMatches: Match[]) => ((this.calculateTotalPoints(awayMatches)
    / (awayMatches.length * 3)) * 100).toFixed(2);

  getAwayInfoTeam = async (teamId: number) => {
    const awayMatches = await this.getAwayMatchesFromTeam(teamId);
    const team = await teamService.getById(teamId);

    const teamInfo: Infos = {
      name: team.teamName,
      totalPoints: this.calculateTotalPoints(awayMatches),
      totalGames: awayMatches.length,
      totalVictories: this.getAwayWinsFromTeam(awayMatches),
      totalDraws: this.getAwayDrawsFromTeam(awayMatches),
      totalLosses: this.calculateTotalLoses(awayMatches),
      goalsFavor: this.getGoals(awayMatches)[0],
      goalsOwn: this.getGoals(awayMatches)[1],
      goalsBalance: this.getGoals(awayMatches)[0] - this.getGoals(awayMatches)[1],
      efficiency: this.calculateEfficiency(awayMatches),
    };

    return teamInfo;
  };

  sortedTotalPoints = (teamsInfo: Infos[]): Infos[] => {
    const sortedTeamsInfo = teamsInfo.sort((a, b) => {
      if (a.totalPoints < b.totalPoints) {
        return 1;
      } if (a.totalPoints > b.totalPoints) {
        return -1;
      } return 0;
    });

    return sortedTeamsInfo;
  };

  sortedGoalsBalance = (teamsInfo: Infos[]): Infos[] => {
    const sortedTeamsInfo = teamsInfo.sort((a, b) => {
      if (a.totalPoints === b.totalPoints) {
        if (a.goalsBalance < b.goalsBalance) {
          return 1;
        } if (a.goalsBalance > b.goalsBalance) {
          return -1;
        }
      } return 0;
    });

    return sortedTeamsInfo;
  };

  sortedGoalsFavor = (teamsInfo: Infos[]): Infos[] => {
    const sortedTeamsInfo = teamsInfo.sort((a, b) => {
      if (a.totalPoints === b.totalPoints && a.goalsBalance === b.goalsBalance) {
        if (a.goalsFavor > b.goalsFavor) {
          return -1;
        } if (a.goalsFavor < b.goalsFavor) {
          return 1;
        }
      } return 0;
    });

    return sortedTeamsInfo;
  };

  sortedGoalsOwn = (teamsInfo: Infos[]): Infos[] => {
    const sortedTeamsInfo = teamsInfo.sort((a, b) => {
      if (
        a.totalPoints === b.totalPoints
        && a.goalsBalance === b.goalsBalance
        && a.goalsFavor === b.goalsFavor
      ) {
        if (a.goalsOwn > b.goalsOwn) {
          return 1;
        } if (a.goalsOwn < b.goalsOwn) {
          return -1;
        }
      } return 0;
    });

    return sortedTeamsInfo;
  };

  sortClassification = (teamsInfo: Infos[]): Infos[] => {
    const sortedTotalPoints = this.sortedTotalPoints(teamsInfo);

    const sortedGoalsBalance = this.sortedGoalsBalance(sortedTotalPoints);

    const sortedGoalsFavor = this.sortedGoalsFavor(sortedGoalsBalance);

    const sortedGoalsOwn = this.sortedGoalsOwn(sortedGoalsFavor);

    return sortedGoalsOwn;
  };

  getAwayClassification = async () => {
    const allTeams = await teamService.getAll();

    const promiseTeamsInfo = allTeams.map(({ id: teamId }) => this.getAwayInfoTeam(teamId));

    const teamsInfo = await Promise.all(promiseTeamsInfo);

    const sortedTeamsInfo = this.sortClassification(teamsInfo);

    return sortedTeamsInfo;
  };
}
