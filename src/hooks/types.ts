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
  DICING = "dicing",
  SELECTING_NODE = "selecting_node",
  SELECTING_CHARACTER = "selecting_character",
  PLAYING = "playing",
  FINISHED = "finished",
}

export enum SelectType {
  PICK = "pick",
  BAN = "ban",
  ROLL = "roll",
  SELECT_NODE = "select_node",
}

export enum DiceType {
  NODE = "node",
  BANPICK = "banpick",
}

export enum WeaponType {
  COMMON = "Common",
  STANDARD = "Standard",
  LIMITED = "Limited",
  SPECIAL = "Special",
}

export interface CharacterSelect {
  character: string;
  relic: number;
  weapon: WeaponType;
  weaponLevel: number;
  point: number;
}

export interface Team {
  id: string;
  dice?: 1 | 2 | 3 | 4 | 5 | 6;
  selectPriority?: DiceType;
  node?: string;
  name: string;
  bans: string[];
  picks: CharacterSelect[];
  timeRemaining: number;
  totalPoints: number;
  cycle: number;
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
