declare interface Players {
  [key: string]: Player | undefined;
}

declare interface Player {
  id: ID;
  name: string;
  score: number;
  isHost: boolean;
  // Add other player properties here if needed
}

declare interface Rooms {
  [code: string]: Room;
}

declare interface Room {
  code: number;
  name: string;
  Players: Players;
  highScore: number;
  highScorePlayer: string;
}

interface ChangeLanguageAction {
  type: typeof CHANGE_LANGUAGE;
  payload: boolean;
}

declare type ID = string | undefined;
