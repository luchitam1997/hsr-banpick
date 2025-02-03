import { useEffect, useMemo, useState } from "react";
import { database, firestore } from "@/configs/firebase";
import { ref, onValue, set } from "firebase/database";
import { useRouter } from "next/router";
import { DiceType, RoomData, RoomStatus, Team } from "@/hooks/types";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const useOnAudiences = () => {
  const router = useRouter();
  const { roomId } = router.query;

  const { roomRef } = useMemo(
    () => ({
      roomRef: ref(database, `rooms/${roomId}`),
    }),
    [roomId]
  );

  // Check status of the room
  const [roomData, setRoomData] = useState<RoomData | null>(null);

  useEffect(() => {
    const unsubscribeRoom = onValue(roomRef, (snapshot) => {
      setRoomData(snapshot.val() as RoomData);
    });

    return () => {
      unsubscribeRoom();
    };
  }, [roomRef]);

  const isWaiting = useMemo(() => {
    return roomData?.status === RoomStatus.WAITING;
  }, [roomData]);

  const isFinished = useMemo(() => {
    return roomData?.status === RoomStatus.FINISHED;
  }, [roomData]);

  const isDicing = useMemo(() => {
    return roomData?.status === RoomStatus.DICING;
  }, [roomData]);

  const isSelectCharacter = useMemo(() => {
    return roomData?.status === RoomStatus.SELECTING_CHARACTER;
  }, [roomData]);

  const isSelectNode = useMemo(() => {
    return roomData?.status === RoomStatus.SELECTING_NODE;
  }, [roomData]);

  const isSelectPriority = useMemo(() => {
    return roomData?.status === RoomStatus.SELECTING_PRIORITY;
  }, [roomData]);

  const currentTurn = useMemo(() => {
    return roomData?.turn;
  }, [roomData]);

  const currentTeam = useMemo(() => {
    return roomData?.teams.find(
      (team) => team.id === currentTurn?.currentPlayer
    );
  }, [roomData, currentTurn]);

  const selectedCharacter = useMemo(() => {
    return roomData?.turn.currentCharacter || "";
  }, [roomData]);

  const winnerTeam = useMemo(() => {
    return roomData?.teams.find((team) => team.id === roomData?.winner);
  }, [roomData]);

  const disabledCharacters = useMemo(() => {
    if (!roomData) return [];
    const teamAPicks = roomData?.teams[0].picks.map((pick) => pick.character);
    const teamABans = roomData?.teams[0].bans;
    const teamBPicks = roomData?.teams[1].picks.map((pick) => pick.character);
    const teamBBans = roomData?.teams[1].bans;
    const currentSelect = roomData.turn.currentCharacter;
    return [
      ...teamAPicks,
      ...teamABans,
      ...teamBPicks,
      ...teamBBans,
      currentSelect,
    ];
  }, [roomData]);

  const handleEndGame = async (teams: Team[]) => {
    if (!roomData) return;

    const whoWin =
      teams[0].totalPoints < teams[1].totalPoints ? teams[0].id : teams[1].id;

    const updatedRoom: RoomData = {
      ...roomData,
      status: RoomStatus.FINISHED,
      winner: whoWin,
    };

    // Get all picks and bans from both teams
    const teamA = teams[0];
    const teamB = teams[1];
    const teamAPicks = teamA.picks.map((pick) => pick.character);
    const teamABans = teamA.bans;
    const teamBPicks = teamB.picks.map((pick) => pick.character);
    const teamBBans = teamB.bans;

    // Reference to the single history document
    const historyRef = doc(firestore, "history", "game-history");
    const historyDoc = await getDoc(historyRef);

    // Get existing data or create initial structure
    const existingData = historyDoc.exists()
      ? historyDoc.data()
      : {
          picks: [],
          bans: [],
          wons: [],
          totalGames: 0,
        };

    // Append new game data to existing arrays
    const updatedHistory = {
      picks: [...existingData.picks, ...teamAPicks, ...teamBPicks],
      bans: [...existingData.bans, ...teamABans, ...teamBBans],
      wons: [
        ...existingData.wons,
        ...(whoWin === teamA.id ? teamAPicks : teamBPicks),
      ],
      totalGames: existingData.totalGames + 1,
      updatedAt: Math.floor(Date.now() / 1000),
    };

    // Save to Firestore
    await setDoc(historyRef, updatedHistory);

    // Update room status
    await set(roomRef, updatedRoom);
  };

  const handleNextDicing = async () => {
    if (!roomData) return;

    const teamA = roomData.teams[0];
    const teamB = roomData.teams[1];

    const updatedRoomData = {
      ...roomData,
    };

    if (!teamA.dice || !teamB.dice) return;

    // If dice is equal, reset dice and continue
    if (teamA.dice === teamB.dice) {
      delete updatedRoomData.teams[0].dice;
      delete updatedRoomData.teams[1].dice;

      await set(roomRef, updatedRoomData);
      return;
    }

    const whoWinDicing = teamA.dice > teamB.dice ? teamA.id : teamB.id;
    const updatedRoom: RoomData = {
      ...roomData,
      status: RoomStatus.SELECTING_PRIORITY,
      turn: {
        ...roomData.turn,
        currentPlayer: whoWinDicing,
      },
    };
    await set(roomRef, updatedRoom);
  };

  const handleNextSelectPriority = async () => {
    if (!roomData) return;

    const teamSelected = roomData.teams.find((team) => team.selectPriority);

    if (!teamSelected) return;

    const opponentTeam = roomData.teams.find(
      (team) => team.id !== teamSelected.id
    );

    if (!opponentTeam) return;

    const opponentPriority =
      teamSelected.selectPriority === DiceType.NODE
        ? DiceType.BANPICK_FIRST
        : DiceType.NODE;

    const isSwitchTeam =
      (teamSelected.selectPriority === DiceType.BANPICK_FIRST &&
        teamSelected.id === roomData.teams[1].id) ||
      (teamSelected.selectPriority === DiceType.BANPICK_LAST &&
        teamSelected.id === roomData.teams[0].id) ||
      (teamSelected.selectPriority === DiceType.NODE &&
        teamSelected.id === roomData.teams[0].id);

    const newTeams = isSwitchTeam ? roomData.teams.reverse() : roomData.teams;

    const updateRoomData = {
      ...roomData,
      status: RoomStatus.SELECTING_NODE,
      turn: {
        ...roomData.turn,
        currentPlayer:
          teamSelected.selectPriority === DiceType.NODE
            ? teamSelected.id
            : opponentTeam.id,
      },
      teams: newTeams.map((team) =>
        team.id === opponentTeam.id
          ? { ...team, selectPriority: opponentPriority }
          : team
      ),
    };

    await set(roomRef, updateRoomData);
  };

  const handleNextSelectNode = async () => {
    if (!roomData) return;

    const updatedRoomData = {
      ...roomData,
    };

    const teamNotSelectNode = roomData.teams.find((team) => !team.node);

    if (teamNotSelectNode) {
      updatedRoomData.turn.currentPlayer = teamNotSelectNode.id;
    } else {
      updatedRoomData.status = RoomStatus.SELECTING_CHARACTER;
      updatedRoomData.turn.currentPlayer = roomData.teams[0].id;
      updatedRoomData.turn.currentCharacter = "";
      updatedRoomData.turn.currentRound = 0;
      updatedRoomData.turn.currentSelect = roomData.order[0];
    }

    await set(roomRef, updatedRoomData);
  };

  return {
    roomData,
    isFinished,
    winnerTeam,
    disabledCharacters,
    selectedCharacter,
    currentTurn,
    isWaiting,
    isDicing,
    isSelectNode,
    isSelectCharacter,
    isSelectPriority,
    currentTeam,
    handleNextDicing,
    handleNextSelectPriority,
    handleEndGame,
    handleNextSelectNode,
  };
};
