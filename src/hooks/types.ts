export interface CreateRoomParams {
  name: string;
  teamA: string;
  teamB: string;
  status: RoomStatus;
  timeRemaining: number;
  pickBanOrder: Order[];
}

export enum RoomStatus {
  WAITING = "waiting",
  SELECTING = "selecting",
  PLAYING = "playing",
  FINISHED = "finished",
}

export enum SelectType {
  PICK = "pick",
  BAN = "ban",
}

export interface Team {
  id: string;
  name: string;
  bans: string[];
  picks: string[];
  timeRemaining: number;
}

export interface Turn {
  currentPlayer: string;
  currentRound: number;
  currentCharacter: string;
  currentSelect: Order | null;
}

export interface Order {
  team: "blue" | "red";
  order: SelectType;
}

export interface RoomData {
  id: string;
  name: string;
  createdAt: number;
  status: RoomStatus;
  teams: Team[];
  order: Order[];
  turn: Turn;
  winner?: "blue" | "red";
}

export interface Character {
  id: number;
  name: string;
  element: string;
  destiny: string;
  rarity: number;
  image: string;
  avatar: string;
}
