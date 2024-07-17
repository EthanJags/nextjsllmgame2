// declare interface Players {
//   [id: string]: Player;
// }

declare interface Player {
  id: ID;
  name: string;
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
  timePerVote: number;
  timePerResults: number;
  timePerScore: number;
  promptDeck: string;
}

declare interface Answer {
  text: string;
  submittedBy: ID;
  votes: ID[];
}

declare interface LatestAnswers {
  [playerId: ID]: Answer;
}

declare type GameStates = "Answering" | "Voting" | "AwaitingResponses" | "AwaitingVotes" | "Results" | "Score" | "End";

declare interface ChatMessage {
  sender: string;
  message: string;
  timestamp: Date;
}

declare interface Game {
  code: number;
  players: Player[];
  gameSettings: GameSettings;
  latestAnswers: LatestAnswers;
  gameActive: boolean;
  currentStage: GameStates;
  currentRound: number;
  currentQuestion: string;
  timeRemaining: number;
  chatHistory: ChatMessage[];
  startTime: number;
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
