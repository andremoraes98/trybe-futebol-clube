import { Op } from 'sequelize';
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

export interface ILeaderService {
  getMatchesFromTeam(teamId: number): Promise<Match[]>;
  getWinsFromTeam(teamId: number, matches: Match[]): number;
  getDrawsFromTeam(matches: Match[]): number;
  getGoalsFavor(teamId: number, matches: Match[]): number;
  getGoalsOwn(teamId: number, matches: Match[]): number;
  getInfoTeam(teamId: number): Promise<Infos>;
  getClassification(): Promise<Infos[]>;
}

export default class LeaderService implements ILeaderService {
  getMatchesFromTeam = async (teamId: number) => {
    const result = await Match.findAll({
      where: {
        [Op.or]: [{
          awayTeam: teamId,
        }, {
          homeTeam: teamId,
        }],
        inProgress: 0,
      },
      logging: console.log,
    });

    return result;
  };

  getWinsFromTeam = (teamId: number, matches: Match[]) => {
    const victories = matches.reduce((acc, match) => {
      if (match.awayTeam === teamId) {
        let victory = acc;
        if (match.awayTeamGoals > match.homeTeamGoals) {
          victory += 1;
          return victory;
        }
      } if (match.homeTeam === teamId) {
        let victory = acc;
        if (match.awayTeamGoals < match.homeTeamGoals) {
          victory += 1;
          return victory;
        }
      }
      return acc;
    }, 0);

    return victories;
  };

  getGoalsFavor = (teamId: number, matches: Match[]) => {
    const goalsFavor = matches.reduce((acc, match) => {
      if (match.awayTeam === teamId) {
        let goals: number = acc;
        goals += match.awayTeamGoals;
        return goals;
      } if (match.homeTeam === teamId) {
        let goals: number = acc;
        goals += match.homeTeamGoals;
        return goals;
      }
      return acc;
    }, 0);

    return goalsFavor;
  };

  getGoalsOwn = (teamId: number, matches: Match[]) => {
    const goalsOwn = matches.reduce((acc, match) => {
      if (match.awayTeam === teamId) {
        let goals: number = acc;
        goals += match.homeTeamGoals;
        return goals;
      } if (match.homeTeam === teamId) {
        let goals: number = acc;
        goals += match.awayTeamGoals;
        return goals;
      }
      return acc;
    }, 0);

    return goalsOwn;
  };

  getDrawsFromTeam = (matches: Match[]) => {
    const draws = matches.reduce((acc, match) => {
      let draw = acc;
      if (match.homeTeamGoals === match.awayTeamGoals) {
        draw += 1;
        return draw;
      }
      return acc;
    }, 0);

    return draws;
  };

  calculateTotalPoints = (
    teamId: number,
    matches: Match[],
  ) => this.getWinsFromTeam(teamId, matches) * 3 + this.getDrawsFromTeam(matches);

  calculateTotalLoses = (teamId: number, matches: Match[]) => matches.length
    - (this.getWinsFromTeam(teamId, matches)
    + this.getDrawsFromTeam(matches));

  calculateEfficiency = (
    teamId: number,
    matches: Match[],
  ) => ((this.calculateTotalPoints(teamId, matches)
    / (matches.length * 3)) * 100).toFixed(2);

  getInfoTeam = async (teamId: number) => {
    const matches = await this.getMatchesFromTeam(teamId);
    const team = await teamService.getById(teamId);

    const teamInfo: Infos = {
      name: team.teamName,
      totalPoints: this.calculateTotalPoints(teamId, matches),
      totalGames: matches.length,
      totalVictories: this.getWinsFromTeam(teamId, matches),
      totalDraws: this.getDrawsFromTeam(matches),
      totalLosses: this.calculateTotalLoses(teamId, matches),
      goalsFavor: this.getGoalsFavor(teamId, matches),
      goalsOwn: this.getGoalsOwn(teamId, matches),
      goalsBalance: this.getGoalsFavor(teamId, matches) - this.getGoalsOwn(teamId, matches),
      efficiency: this.calculateEfficiency(teamId, matches),
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

    // const sortedGoalsOwn = this.sortedGoalsOwn(sortedGoalsFavor);

    return sortedGoalsFavor;
  };

  getClassification = async () => {
    const allTeams = await teamService.getAll();

    const promiseTeamsInfo = allTeams.map(({ id: teamId }) => this.getInfoTeam(teamId));

    const teamsInfo = await Promise.all(promiseTeamsInfo);

    const sortedTeamsInfo = this.sortClassification(teamsInfo);

    return sortedTeamsInfo;
  };
}
