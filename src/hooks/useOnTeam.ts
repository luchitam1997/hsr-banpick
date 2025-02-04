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
    if (!roomData || !currentTeam) return;

    // if character is not be selected, then return
    if (!roomData.turn.currentCharacter) return;

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

    // next turn
    const nextTurn: Turn = isLastTurn
      ? {
          currentSelect: null,
          currentCharacter: "",
          currentPriority: null,
          currentNode: null,
          currentRound: 0,
          currentPlayer: "",
        }
      : {
          currentSelect: nextSelect,
          currentCharacter: "",
          currentRound: nextRound,
          currentPlayer: nextPlayer,
          currentPriority: null,
          currentNode: null,
        };

    await set(roomRef, {
      ...roomData,
      teams: roomData.teams.map((team) =>
        team.id === roomData.turn.currentPlayer ? currentTeam : team
      ),
      turn: nextTurn,
    });
  };

  const handleConfirmBan = async () => {
    if (!roomData || !currentTeam) return;

    // if character is not be selected, then return
    if (!roomData.turn.currentCharacter) return;

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
      currentPriority: null,
      currentNode: null,
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

    await set(roomRef, updateRoomData);
  };

  const handleSelectPriority = async (priority: DiceType) => {
    if (!roomData || !currentTeam || !opponentTeam) return;

    if (currentTeam.selectPriority) return;

    const updateRoomData: RoomData = {
      ...roomData,
      turn: {
        ...roomData.turn,
        currentPriority: priority,
      },
    };
    await set(roomRef, updateRoomData);
  };

  const handleSelectNode = async (map: "11.1" | "11.2" | "12.1" | "12.2") => {
    if (!roomData || !currentTeam || !opponentTeam) return;

    if (currentTeam.node) return;

    // const updatedTeam: Team = {
    //   ...currentTeam,
    //   node: map,
    // };

    const updateRoomData: RoomData = {
      ...roomData,
      turn: {
        ...roomData.turn,
        currentNode: map,
      },
    };

    await set(roomRef, updateRoomData);
  };

  const handleConfirmPriority = async () => {
    if (!roomData || !currentTeam || !opponentTeam) return;
    if (!roomData.turn.currentPriority) return;

    const updateTeam: Team = {
      ...currentTeam,
      selectPriority: roomData.turn.currentPriority,
    };

    const updateRoomData: RoomData = {
      ...roomData,
      teams: roomData.teams.map((team) =>
        team.id === teamId ? updateTeam : team
      ),
      turn: {
        ...roomData.turn,
        currentPriority: null,
        currentPlayer: opponentTeam.id,
      },
    };
    await set(roomRef, updateRoomData);
  };

  const handleConfirmNode = async () => {
    if (!roomData || !currentTeam || !opponentTeam) return;
    if (!roomData.turn.currentNode) return;

    const updatedTeam: Team = {
      ...currentTeam,
      node: roomData.turn.currentNode,
    };

    const updateRoomData: RoomData = {
      ...roomData,
      teams: roomData.teams.map((team) =>
        team.id === teamId ? updatedTeam : team
      ),
      turn: {
        ...roomData.turn,
        currentNode: null,
        currentPlayer: opponentTeam.id,
      },
    };

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

    (updatedTeam.totalPoints = updatedTeam.picks.reduce(
      (acc, pick) => acc + pick.point,
      0
    )),
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
    handleConfirmNode,
    handleConfirmPriority,
  };
};
