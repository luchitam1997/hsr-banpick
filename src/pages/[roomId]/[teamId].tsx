import { TeamColumn } from "@/components/TeamColumn";
import { SelectCharacter } from "@/components/SelectCharacter";

import { useEffect, useMemo, useState } from "react";
import { database } from "@/configs/firebase";
import { ref, onValue } from "firebase/database";
import { useRouter } from "next/router";
import WaitingScreen from "@/components/WaitingScreen";

export default function TeamPage() {
  const router = useRouter();
  const { roomId, teamId } = router.query;
  console.log(roomId, teamId);

  const { roomRef } = useMemo(
    () => ({
      roomRef: ref(database, `rooms/${roomId}`),
    }),
    [roomId, teamId]
  );

  // Check status of the room
  const [roomData, setRoomData] = useState<any>(null);

  useEffect(() => {
    const unsubscribeRoom = onValue(roomRef, (snapshot) => {
      setRoomData(snapshot.val());
    });

    return () => {
      unsubscribeRoom();
    };
  }, [roomRef]);

  console.log(roomData);

  const isWaiting = useMemo(() => {
    return roomData?.status === "waiting";
  }, [roomData]);

  return (
    <main className="w-full h-full p-5">
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
          <TeamColumn
            team="blue"
            name={roomData.teams[0].name}
            winCount={roomData.teams[0].winCount}
            pick={roomData.teams[0].picks}
            ban={roomData.teams[0].bans}
          />
        )}

        <SelectCharacter />

        {/* Team B */}
        {roomData && roomData.teams[1] && (
          <TeamColumn
            team="red"
            name={roomData.teams[1].name}
            winCount={roomData.teams[1].winCount}
            pick={roomData.teams[1].picks}
            ban={roomData.teams[1].bans}
          />
        )}
      </div>

      {isWaiting && <WaitingScreen />}
    </main>
  );
}
