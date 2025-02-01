import { ref, set, push } from "firebase/database";
import { database } from "@/configs/firebase";
import {
  CharacterSelect,
  CreateRoomParams,
  Order,
  RoomData,
  RoomStatus,
  SelectType,
} from "./types";

export const useCreateRoom = () => {
  const createRoom = async (roomData: CreateRoomParams) => {
    try {
      const roomRef = ref(database, "rooms");
      const newRoomRef = push(roomRef);
      const roomId = newRoomRef.key;
      const teamARef = ref(database, `rooms/${roomId}/teams/0`);
      const teamBRef = ref(database, `rooms/${roomId}/teams/1`);

      const newTeamARef = push(teamARef);
      const newTeamBRef = push(teamBRef);

      const teamAId = newTeamARef.key;
      const teamBId = newTeamBRef.key;

      let bluePick = 0;
      let blueBan = 0;
      let redPick = 0;
      let redBan = 0;

      roomData.pickBanOrder.forEach((item: Order) => {
        if (item.team === "blue") {
          item.order === SelectType.PICK ? bluePick++ : blueBan++;
        } else {
          item.order === SelectType.PICK ? redPick++ : redBan++;
        }
      });

      const initialRoomData: RoomData = {
        id: roomId || "",
        name: roomData.name,
        createdAt: Math.floor(Date.now() / 1000),
        status: RoomStatus.WAITING, // Room is waiting for players
        teams: [
          {
            id: teamAId || "",
            name: roomData.teamA,
            bans: new Array(blueBan).fill(""),
            picks: new Array(bluePick).fill({
              character: "",
              relic: 0,
              weapon: "",
              weaponLevel: 0,
              point: 0,
            }) as CharacterSelect[],
            timeRemaining: roomData.timeRemaining,
            totalPoints: 0,
            cycle: 0,
          },
          {
            id: teamBId || "",
            name: roomData.teamB,
            bans: new Array(redBan).fill(""),
            picks: new Array(redPick).fill({
              character: "",
              relic: 0,
              weapon: "",
              weaponLevel: 0,
              point: 0,
            }) as CharacterSelect[],
            timeRemaining: roomData.timeRemaining,
            totalPoints: 0,
            cycle: 0,
          },
        ],

        order: roomData.pickBanOrder,
        turn: {
          currentPlayer: "",
          currentRound: 0,
          currentCharacter: "",
          currentSelect: null,
        },
      };

      console.log(initialRoomData);

      await set(newRoomRef, initialRoomData);
      if (roomId && teamAId && teamBId) {
        return { roomId, teamAId, teamBId };
      }
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  };

  return { createRoom };
};
