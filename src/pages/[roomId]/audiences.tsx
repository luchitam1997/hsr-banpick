import { TeamColumn } from "@/components/TeamColumn";
import { SelectCharacter } from "@/components/SelectCharacter";

import { useCallback, useEffect, useMemo, useState } from "react";
import { database } from "@/configs/firebase";
import { ref, onValue, set } from "firebase/database";
import { useRouter } from "next/router";
import WaitingScreen from "@/components/WaitingScreen";
import { RoomData, RoomStatus } from "@/hooks/types";
import Head from "next/head";

export default function AudiencePage() {
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

  const currentTurn = useMemo(() => {
    return roomData?.turn;
  }, [roomData]);

  const selectedCharacter = useMemo(() => {
    return roomData?.turn.currentCharacter || "";
  }, [roomData]);

  const disabledCharacters = useMemo(() => {
    if (!roomData) return [];
    const teamAPicks = roomData?.teams[0].picks;
    const teamABans = roomData?.teams[0].bans;
    const teamBPicks = roomData?.teams[1].picks;
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

  const countdown = useCallback(async () => {
    if (!roomData) return;

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
  }, [roomData, roomRef]);

  useEffect(() => {
    const timer = setInterval(() => {
      countdown();
    }, 1000);

    return () => clearInterval(timer);
  }, [roomData, countdown]);

  return (
    <main className="w-full h-full p-5">
      <Head>
        <title>{`HSR: All stars / ${roomData?.name}`}</title>
      </Head>
      {/* Header */}
      <div className="w-full h-full flex items-center gap-1">
        <p className="text-secondary text-2xl font-bold">
          Honkai Star Rail: All stars competition /
        </p>
        <p className="text-primary text-2xl font-bold">{roomData?.name}</p>
      </div>
      <div className="mt-4 flex flex-row gap-4">
        {/* Team A */}
        {roomData && roomData.teams[0] && (
          <TeamColumn team="blue" data={roomData.teams[0]} turn={currentTurn} />
        )}

        <SelectCharacter
          readOnly={true}
          selectedCharacter={selectedCharacter}
          disabledCharacters={disabledCharacters}
        />

        {/* Team B */}
        {roomData && roomData.teams[1] && (
          <TeamColumn team="red" data={roomData.teams[1]} turn={currentTurn} />
        )}
      </div>
      {isWaiting && <WaitingScreen />}
    </main>
  );
}
