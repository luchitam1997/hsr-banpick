import { ref, set, push } from "firebase/database";
import { database } from "@/configs/firebase";
import { CreateRoomParams, RoomData, RoomStatus, SelectType } from "./types";

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

      const pickAmount = roomData.pickBanOrder.filter(
        (item: SelectType) => item === SelectType.PICK
      ).length;
      const banAmount = roomData.pickBanOrder.filter(
        (item: SelectType) => item === SelectType.BAN
      ).length;

      const initialRoomData: RoomData = {
        id: roomId || "",
        name: roomData.name,
        createdAt: Math.floor(Date.now() / 1000),
        status: RoomStatus.WAITING, // Room is waiting for players
        teams: [
          {
            id: teamAId || "",
            name: roomData.teamA,
            bans: new Array(banAmount).fill(""),
            picks: new Array(pickAmount).fill(""),
            timeRemaining: 15 * 60, // 15 minutes
          },
          {
            id: teamBId || "",
            name: roomData.teamB,
            bans: new Array(banAmount).fill(""),
            picks: new Array(pickAmount).fill(""),
            timeRemaining: 15 * 60, // 15 minutes
          },
        ],

        order: roomData.pickBanOrder,
        turn: {
          currentPlayer: "",
          currentRound: 0,
          currentCharacter: "",
          currentSelect: "",
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
