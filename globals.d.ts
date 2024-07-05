declare interface Players {
  [id: string]: Player;
}

declare interface Player {
  id: ID;
  name: string | null;
  score: number;
  isHost: boolean;
  // Add other player properties here if needed
}

declare interface Games {
  [code: number]: Game;
}

declare interface GameSettings {
  // Add game settings here
  rounds: number;
  timePerQuestion: number;
}

declare type GameStates = 'Answering' | 'Choosing' | 'AwaitingResponses';
declare interface Game {
  code: number;
  players: Player[];
  highScore: number;
  highScorePlayer: string | null;
  gameSettings: GameSettings;
  answers: { [playerId: string]: string };
  gameActive: boolean;
  currentStage: GameStates;
  currentQuestion: string;
}

// declare interface BackendGame {
//   code: number;
//   players: Player[];
//   highScore: number;
//   highScorePlayer: string | null;
//   gameSettings: GameSettings;
//   answers: { [playerId: string]: string };
//   gameActive: boolean;
//   currentStage: GameStates;
//   currentQuestion: string;
// }

declare type ID = string;
