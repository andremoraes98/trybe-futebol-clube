import Match from '../database/models/Match';
import TeamService from './TeamService';

const teamService = new TeamService();

interface Infos {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: string;
}

export interface IHomeLeaderService {
  getHomeMatchesFromTeam(teamId: number): Promise<Match[]>;
  getHomeWinsFromTeam(homeMatches: Match[]): number;
  getHomeDrawsFromTeam(homeMatches: Match[]): number;
  getGoals(homeMatches: Match[]): number[];
  getHomeInfoTeam(teamId: number): Promise<Infos>;
  getHomeClassification(): Promise<Infos[]>;
}

export default class HomeLeaderService implements IHomeLeaderService {
  getHomeMatchesFromTeam = async (teamId: number) => {
    const result = await Match.findAll({
      where: {
        homeTeam: teamId,
        inProgress: 0,
      },
    });

    return result;
  };

  getHomeWinsFromTeam = (homeMatches: Match[]) => {
    const victories = homeMatches.reduce((acc, match) => {
      let victory = acc;
      if (match.homeTeamGoals > match.awayTeamGoals) {
        victory += 1;
        return victory;
      }
      return acc;
    }, 0);

    return victories;
  };

  getGoals = (homeMatches: Match[]) => {
    const goalsFavor = homeMatches.reduce((acc, match) => {
      let goals: number = acc;
      goals += match.homeTeamGoals;
      return goals;
    }, 0);

    const goalsOwn = homeMatches.reduce((acc, match) => {
      let goals: number = acc;
      goals += match.awayTeamGoals;
      return goals;
    }, 0);

    return [goalsFavor, goalsOwn];
  };

  getHomeDrawsFromTeam = (homeMatches: Match[]) => {
    const draws = homeMatches.reduce((acc, match) => {
      let draw = acc;
      if (match.homeTeamGoals === match.awayTeamGoals) {
        draw += 1;
        return draw;
      }
      return acc;
    }, 0);

    return draws;
  };

  calculateTotalPoints = (homeMatches: Match[]) => this.getHomeWinsFromTeam(homeMatches) * 3
    + this.getHomeDrawsFromTeam(homeMatches);

  calculateTotalLoses = (homeMatches: Match[]) => homeMatches.length
    - (this.getHomeWinsFromTeam(homeMatches)
    + this.getHomeDrawsFromTeam(homeMatches));

  calculateEfficiency = (homeMatches: Match[]) => ((this.calculateTotalPoints(homeMatches)
    / (homeMatches.length * 3)) * 100).toFixed(2);

  getHomeInfoTeam = async (teamId: number) => {
    const homeMatches = await this.getHomeMatchesFromTeam(teamId);
    const team = await teamService.getById(teamId);

    const teamInfo: Infos = {
      name: team.teamName,
      totalPoints: this.calculateTotalPoints(homeMatches),
      totalGames: homeMatches.length,
      totalVictories: this.getHomeWinsFromTeam(homeMatches),
      totalDraws: this.getHomeDrawsFromTeam(homeMatches),
      totalLosses: this.calculateTotalLoses(homeMatches),
      goalsFavor: this.getGoals(homeMatches)[0],
      goalsOwn: this.getGoals(homeMatches)[1],
      goalsBalance: this.getGoals(homeMatches)[0] - this.getGoals(homeMatches)[1],
      efficiency: this.calculateEfficiency(homeMatches),
    };

    return teamInfo;
  };

  sortedTotalPoints = (teamsInfo: Infos[]): Infos[] => {
    const sortedTeamsInfo = teamsInfo.sort((a, b) => {
      if (a.totalPoints > b.totalPoints) {
        return -1;
      } if (a.totalPoints < b.totalPoints) {
        return 1;
      } return 0;
    });

    return sortedTeamsInfo;
  };

  sortedGoalsBalance = (teamsInfo: Infos[]): Infos[] => {
    const sortedTeamsInfo = teamsInfo.sort((a, b) => {
      if (a.totalPoints === b.totalPoints) {
        if (a.goalsBalance > b.goalsBalance) {
          return -1;
        } if (a.goalsBalance < b.goalsBalance) {
          return 1;
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

  getHomeClassification = async () => {
    const allTeams = await teamService.getAll();

    const promiseTeamsInfo = allTeams.map(({ id: teamId }) => this.getHomeInfoTeam(teamId));

    const teamsInfo = await Promise.all(promiseTeamsInfo);

    const sortedTeamsInfo = this.sortClassification(teamsInfo);

    return sortedTeamsInfo;
  };
}
