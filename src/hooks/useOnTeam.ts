import { useCallback, useEffect, useMemo, useState } from "react";
import { database } from "@/configs/firebase";
import { ref, onValue, set } from "firebase/database";
import { useRouter } from "next/router";

import {
  Character,
  CharacterSelect,
  DiceType,
  RoomData,
  RoomStatus,
  SelectType,
  Team,
  Turn,
} from "@/hooks/types";

export const useOnTeam = () => {
  const router = useRouter();
  const { roomId, teamId } = router.query;

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

  const isCurrentTurn = useMemo(() => {
    return roomData?.turn.currentPlayer === teamId;
  }, [roomData, teamId]);

  const currentTurn = useMemo(() => {
    return roomData?.turn;
  }, [roomData]);

  const currentTeam = useMemo(() => {
    return roomData?.teams.find((team) => team.id === teamId);
  }, [roomData, teamId]);

  const opponentTeam = useMemo(() => {
    return roomData?.teams.find((team) => team.id !== teamId);
  }, [roomData, teamId]);

  const selectedCharacter = useMemo(() => {
    return roomData?.turn.currentCharacter || "";
  }, [roomData]);

  const teamIndex = useMemo(() => {
    if (!roomData) return -1;
    return roomData.teams.findIndex((team) => team.id === teamId);
  }, [roomData, teamId]);

  // const opponentTeamIndex = useMemo(() => {
  //   if (!roomData) return -1;
  //   return roomData.teams.findIndex((team) => team.id !== teamId);
  // }, [roomData, teamId]);

  const isDicing = useMemo(() => {
    if (!roomData || teamIndex < 0) return false;
    return roomData.status === RoomStatus.DICING;
  }, [roomData, teamIndex]);

  const isSelectingPriority = useMemo(() => {
    if (!roomData || teamIndex < 0) return false;
    return roomData.status === RoomStatus.SELECTING_PRIORITY;
  }, [roomData, teamIndex]);

  const isSelectingNode = useMemo(() => {
    if (!roomData || teamIndex < 0) return false;
    return roomData.status === RoomStatus.SELECTING_NODE;
  }, [roomData, teamIndex]);

  const isPlaying = useMemo(() => {
    if (!roomData || teamIndex < 0) return false;
    return roomData.status === RoomStatus.PLAYING;
  }, [roomData, teamIndex]);

  const isFinished = useMemo(() => {
    if (!roomData || teamIndex < 0) return false;
    return roomData.status === RoomStatus.FINISHED;
  }, [roomData, teamIndex]);

  const disabledCharacters = useMemo(() => {
    if (!roomData) return [];
    const teamAPicks = roomData?.teams[0].picks.map(
      (character) => character.character
    );
    const teamABans = roomData?.teams[0].bans;
    const teamBPicks = roomData?.teams[1].picks.map(
      (character) => character.character
    );
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

  const nodeDisabled = useMemo(() => {
    if (!roomData || !opponentTeam) return;
    return opponentTeam.node as "11.1" | "11.2" | "12.1" | "12.2";
  }, [roomData, opponentTeam]);

  const handleSelect = async (character: Character) => {
    if (!roomData) return;

    await set(roomRef, {
      ...roomData,
      turn: {
        ...roomData.turn,
        currentCharacter: character.name,
      },
    });
  };

  const handleConfirmPick = async (params: CharacterSelect) => {
    if (!roomData || !currentTeam || !opponentTeam) return;

    // Check if this is the last pick/ban
    const isLastTurn = roomData.turn.currentRound === roomData.order.length - 1;

    const currentType = roomData.order[roomData.turn.currentRound];

    if (currentType.order === SelectType.PICK) {
      for (let i = 0; i < currentTeam.picks.length; i++) {
        if (!currentTeam.picks[i].character) {
          currentTeam.picks[i] = params;
          break;
        }
      }
    }

    currentTeam.totalPoints += params.point;

    const nextRound = isLastTurn
      ? roomData.turn.currentRound
      : roomData.turn.currentRound + 1;

    const nextSelect = roomData.order[nextRound];

    const nextPlayer =
      nextSelect.team === "blue" ? roomData.teams[0].id : roomData.teams[1].id;

    const whoLessPoints =
      currentTeam.totalPoints < opponentTeam.totalPoints
        ? currentTeam.id
        : opponentTeam.id;

    // next turn
    const nextTurn: Turn = isLastTurn
      ? {
          currentSelect: null,
          currentCharacter: "",
          currentRound: 0,
          currentPlayer: whoLessPoints,
        }
      : {
          currentSelect: nextSelect,
          currentCharacter: "",
          currentRound: nextRound,
          currentPlayer: nextPlayer,
        };

    const status = isLastTurn
      ? RoomStatus.PLAYING
      : RoomStatus.SELECTING_CHARACTER;

    await set(roomRef, {
      ...roomData,
      teams: roomData.teams.map((team) =>
        team.id === roomData.turn.currentPlayer ? currentTeam : team
      ),
      turn: nextTurn,
      status,
    });
  };

  const handleConfirmBan = async () => {
    if (!roomData) return;

    const currentTeam = roomData.teams.find(
      (team) => team.id === roomData.turn.currentPlayer
    );

    if (!currentTeam) return;

    for (let i = 0; i < currentTeam.bans.length; i++) {
      if (!currentTeam.bans[i]) {
        currentTeam.bans[i] = roomData.turn.currentCharacter;
        break;
      }
    }

    const nextRound = roomData.turn.currentRound + 1;

    const nextSelect = roomData.order[nextRound];

    const nextPlayer =
      nextSelect.team === "blue" ? roomData.teams[0].id : roomData.teams[1].id;

    // next turn
    const nextTurn: Turn = {
      currentSelect: nextSelect,
      currentCharacter: "",
      currentRound: nextRound,
      currentPlayer: nextPlayer,
    };

    const status = RoomStatus.SELECTING_CHARACTER;

    await set(roomRef, {
      ...roomData,
      teams: roomData.teams.map((team) =>
        team.id === roomData.turn.currentPlayer ? currentTeam : team
      ),
      turn: nextTurn,
      status,
    });
  };

  const countdown = useCallback(async () => {
    if (!roomData || !isCurrentTurn) return;

    const currentTeam = roomData.teams.find(
      (team) => team.id === roomData.turn.currentPlayer
    );

    if (!currentTeam || currentTeam.timeRemaining <= 0) return;

    const updatedTeam = {
      ...currentTeam,
      timeRemaining: currentTeam.timeRemaining - 1,
    };

    await set(roomRef, {
      ...roomData,
      teams: roomData.teams.map((team) =>
        team.id === roomData.turn.currentPlayer ? updatedTeam : team
      ),
    });
  }, [roomData, roomRef, isCurrentTurn]);

  useEffect(() => {
    if (roomData && roomData.status === RoomStatus.SELECTING_CHARACTER) {
      const timer = setInterval(() => {
        countdown();
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [roomData, countdown]);

  const handleRoll = async (value: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (!roomData || !currentTeam || !opponentTeam) return;

    const updatedTeam: Team = {
      ...currentTeam,
      dice: value,
    };

    const updateRoomData = {
      ...roomData,
      teams: roomData.teams.map((team) =>
        team.id === teamId ? updatedTeam : team
      ),
    };

    if (opponentTeam.dice) {
      if (value === opponentTeam.dice) {
        roomData.teams.map((team) => delete team.dice);
        await set(roomRef, {
          ...roomData,
          teams: roomData.teams,
        });
        return;
      }
      const winner =
        value > opponentTeam.dice ? currentTeam.id : opponentTeam.id;
      updateRoomData.status = RoomStatus.SELECTING_PRIORITY;
      updateRoomData.turn.currentPlayer = winner;
    }

    await set(roomRef, updateRoomData);
  };

  const handleSelectPriority = async (priority: DiceType) => {
    if (!roomData || !currentTeam || !opponentTeam) return;

    const opponentPriority =
      priority === DiceType.NODE ? DiceType.BANPICK_FIRST : DiceType.NODE;

    const isSwitchTeam =
      (priority === DiceType.BANPICK_FIRST && teamIndex === 1) ||
      (priority === DiceType.BANPICK_LAST && teamIndex === 0) ||
      (priority === DiceType.NODE && teamIndex === 0);

    const newTeams = isSwitchTeam ? roomData.teams.reverse() : roomData.teams;

    const updateRoomData = {
      ...roomData,
      status: RoomStatus.SELECTING_NODE,
      turn: {
        ...roomData.turn,
        currentPlayer:
          priority === DiceType.NODE ? currentTeam.id : opponentTeam.id,
      },
      teams: newTeams.map((team) =>
        team.id === teamId
          ? { ...team, selectPriority: priority }
          : {
              ...team,
              selectPriority: opponentPriority,
            }
      ),
    };
    await set(roomRef, updateRoomData);
  };

  const handleSelectNode = async (map: "11.1" | "11.2" | "12.1" | "12.2") => {
    if (!roomData || !currentTeam || !opponentTeam) return;

    const updatedTeam: Team = {
      ...currentTeam,
      node: map,
    };

    const updateRoomData = {
      ...roomData,
      teams: roomData.teams.map((team) =>
        team.id === teamId ? updatedTeam : team
      ),
    };

    if (opponentTeam.node) {
      updateRoomData.status = RoomStatus.SELECTING_CHARACTER;
      updateRoomData.turn.currentPlayer = roomData.teams[0].id;
      updateRoomData.turn.currentCharacter = "";
      updateRoomData.turn.currentRound = 0;
      updateRoomData.turn.currentSelect = roomData.order[0];
    } else {
      updateRoomData.turn.currentPlayer = opponentTeam.id;
    }

    await set(roomRef, updateRoomData);
  };

  const handleSelectRelic = async (characterSelect: CharacterSelect) => {
    if (!roomData || !currentTeam) return;

    const updatedTeam: Team = {
      ...currentTeam,
      picks: currentTeam.picks.map((pick) =>
        pick.character === characterSelect.character ? characterSelect : pick
      ),
    };

    await set(roomRef, {
      ...roomData,
      teams: roomData.teams.map((team) =>
        team.id === teamId ? updatedTeam : team
      ),
    });
  };

  return {
    roomData,
    isWaiting,
    isDicing,
    isSelectingNode,
    isSelectingPriority,
    isPlaying,
    isFinished,
    isCurrentTurn,
    currentTurn,
    currentTeam,
    opponentTeam,
    disabledCharacters,
    selectedCharacter,
    nodeDisabled,
    teamIndex,
    handleConfirmBan,
    handleConfirmPick,
    handleSelect,
    handleRoll,
    handleSelectNode,
    handleSelectPriority,
    handleSelectRelic,
  };
};
