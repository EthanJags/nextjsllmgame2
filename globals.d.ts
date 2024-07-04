declare interface Players {
  [id: string]: Player;
}

declare interface Player {
  id: ID | null;
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

declare interface Game {
  code: number;
  players: [Player];
  highScore: number;
  highScorePlayer: string | null;
  gameSettings: GameSettings;
}



declare type ID = string | undefined;
