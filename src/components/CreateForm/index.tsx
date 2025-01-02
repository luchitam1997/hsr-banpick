import { useCallback, useMemo, useState } from "react";
import { Input } from "../Input";
import Link from "next/link";
import { useCopyToClipboard } from "usehooks-ts";
import Image from "next/image";
import { ref, set, push, get } from "firebase/database";
import { database } from "@/configs/firebase";

export function CreateForm() {
  const [roomData, setRoomData] = useState({
    name: "",
    teamA: "",
    teamB: "",
    status: "waiting",
    pickBanOrder: [] as (string | null)[],
  });

  const [roomId, setRoomId] = useState("");
  const [teamAId, setTeamAId] = useState("");
  const [teamBId, setTeamBId] = useState("");

  const [, copy] = useCopyToClipboard();
  const [loading, setLoading] = useState(false);

  const { teamAUrl, teamBUrl, audienceUrl } = useMemo(() => {
    if (roomId) {
      return {
        teamAUrl: `/${roomId}/${teamAId}`,
        teamBUrl: `/${roomId}/${teamBId}`,
        audienceUrl: `/${roomId}/audiences`,
      };
    }
    return {
      teamAUrl: "",
      teamBUrl: "",
      audienceUrl: "",
    };
  }, [roomId, teamAId, teamBId]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      console.log(roomData);

      try {
        setLoading(true);
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
          (item) => item === "pick"
        ).length;
        const banAmount = roomData.pickBanOrder.filter(
          (item) => item === "ban"
        ).length;

        const initialRoomData = {
          id: roomId,
          name: roomData.name,
          createdAt: Math.floor(Date.now() / 1000),
          status: "waiting", // Room is waiting for players
          teams: [
            {
              id: teamAId,
              name: roomData.teamA,
              bans: new Array(banAmount).fill(""),
              picks: new Array(pickAmount).fill(""),
              timeRemaining: 15 * 60, // 15 minutes
            },
            {
              id: teamBId,
              name: roomData.teamB,
              bans: new Array(banAmount).fill(""),
              picks: new Array(pickAmount).fill(""),
              timeRemaining: 15 * 60, // 15 minutes
            },
          ],

          order: roomData.pickBanOrder,
          turn: {
            currentPlayer: roomData.teamA,
            currentStep: 1, // Step 1: Ban Phase
          },
        };

        console.log(initialRoomData);

        await set(newRoomRef, initialRoomData);
        if (roomId && teamAId && teamBId) {
          setRoomId(roomId);
          setTeamAId(teamAId);
          setTeamBId(teamBId);
        }
      } catch (error) {
        console.error("Error creating room:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [roomData, setRoomId, setLoading]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  const onBanClick = () => {
    setRoomData({
      ...roomData,
      pickBanOrder: [...roomData.pickBanOrder, "ban"],
    });
  };

  const onPickClick = () => {
    setRoomData({
      ...roomData,
      pickBanOrder: [...roomData.pickBanOrder, "pick"],
    });
  };

  const onClearClick = () => {
    setRoomData({ ...roomData, pickBanOrder: [] });
  };

  const onStartGameClick = useCallback(async () => {
    try {
      const roomRef = ref(database, `rooms/${roomId}`);
      const roomData = await get(roomRef);
      await set(roomRef, {
        ...roomData.val(),
        status: "playing",
      });
    } catch (error) {
      console.error("Error starting game:", error);
    }
  }, [roomId]);

  return (
    <div>
      <form onSubmit={onSubmit} className="w-full max-w-lg space-y-4">
        <div>
          <Input
            label="Room Name"
            onChange={handleChange}
            name="name"
            value={roomData.name}
            placeholder="Enter room name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              label="Team A"
              onChange={handleChange}
              name="teamA"
              value={roomData.teamA}
              placeholder="Enter team A name"
            />
          </div>

          <div>
            <Input
              label="Team B"
              onChange={handleChange}
              name="teamB"
              value={roomData.teamB}
              placeholder="Enter room name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-base font-medium text-primary">
            Build Pick/Ban Order
          </label>
          <div className="flex gap-4">
            <div className="basis-1/3 flex flex-col gap-4">
              <button
                type="button"
                className="w-full bg-red-500 text-primary rounded-md py-2 hover:bg-secondary/80 transition-colors"
                onClick={onBanClick}
              >
                Ban
              </button>
              <button
                type="button"
                className="w-full bg-blue-500 text-primary rounded-md py-2 hover:bg-secondary/80 transition-colors"
                onClick={onPickClick}
              >
                Pick
              </button>

              <button
                type="button"
                className="w-full bg-transparent text-primary rounded-md py-2 border border-primary"
                onClick={onClearClick}
              >
                Clear
              </button>
            </div>
            <div className="basis-2/3 grid grid-cols-4 gap-2 border border-primary rounded-md p-4">
              {roomData.pickBanOrder.map((item, index) => (
                <div
                  key={index}
                  className={`w-full h-fit text-primary text-sm p-2 rounded-md bg-${
                    item === "ban" ? "red" : "blue"
                  }-500`}
                >
                  {index + 1}. {item === "ban" ? "Ban" : "Pick"}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-secondary text-white rounded-md py-2 hover:bg-secondary/80 transition-colors"
        >
          {loading ? "Creating Room..." : "Create Room"}
        </button>
      </form>
      {roomId && (
        <div className="flex flex-col gap-4 mt-4">
          {/* Divider */}
          <div className="w-full h-[1px] bg-primary"></div>
          {/* Team A */}
          <div className="w-full flex gap-4 items-center">
            <Link
              href={teamAUrl}
              className="max-w-[200px] truncate text-primary text-sm p-2"
            >
              TeamA: {teamAUrl}
            </Link>

            <Image
              src="/icons/copy.png"
              alt="copy"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={() => copy(teamAUrl)}
            />

            <Image
              src="/icons/redirect.png"
              alt="redirect"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={() => window.open(teamAUrl, "_blank")}
            />
          </div>

          {/* Team B */}
          <div className="w-full flex gap-4 items-center">
            <Link
              href={teamBUrl}
              className="max-w-[200px] truncate text-primary text-sm p-2"
            >
              TeamB: {teamBUrl}
            </Link>

            <Image
              src="/icons/copy.png"
              alt="copy"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={() => copy(teamBUrl)}
            />

            <Image
              src="/icons/redirect.png"
              alt="redirect"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={() => window.open(teamBUrl, "_blank")}
            />
          </div>

          {/* Audience */}
          <div className="w-full flex gap-4 items-center">
            <Link
              href={audienceUrl}
              className="max-w-[200px] truncate text-primary text-sm p-2"
            >
              Audiences: {audienceUrl}
            </Link>

            <Image
              src="/icons/copy.png"
              alt="copy"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={() => copy(audienceUrl)}
            />

            <Image
              src="/icons/redirect.png"
              alt="redirect"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={() => window.open(audienceUrl, "_blank")}
            />
          </div>

          {/* Start game button */}
          <button
            className="w-full bg-secondary text-white rounded-md py-2 hover:bg-secondary/80 transition-colors"
            onClick={onStartGameClick}
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}
