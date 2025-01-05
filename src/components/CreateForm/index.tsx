import { useCallback, useMemo, useState } from "react";
import { Input } from "../Input";
import Link from "next/link";
import { useCopyToClipboard } from "usehooks-ts";
import Image from "next/image";
import { ref, set, get } from "firebase/database";
import { database } from "@/configs/firebase";
import { useCreateRoom } from "@/hooks/useCreateRoom";
import { Order, RoomData, RoomStatus, SelectType } from "@/hooks/types";
import { CreateRoomParams } from "@/hooks/types";

export function CreateForm() {
  const [roomData, setRoomData] = useState<CreateRoomParams>({
    name: "",
    teamA: "",
    teamB: "",
    status: RoomStatus.WAITING,
    pickBanOrder: [] as Order[],
    timeRemaining: 0,
  });

  const [roomId, setRoomId] = useState("");
  const [teamAId, setTeamAId] = useState("");
  const [teamBId, setTeamBId] = useState("");

  const [, copy] = useCopyToClipboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log(error);

  const { createRoom } = useCreateRoom();

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
        const result = await createRoom(roomData);
        if (result) {
          setRoomId(result.roomId);
          setTeamAId(result.teamAId);
          setTeamBId(result.teamBId);
        }
      } catch (error) {
        setError("Error creating room");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [roomData, setLoading, createRoom]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  const onSelectOrder = (order: Order) => {
    setRoomData({
      ...roomData,
      pickBanOrder: [...roomData.pickBanOrder, order],
    });
  };

  const onClearClick = () => {
    setRoomData({ ...roomData, pickBanOrder: [] });
  };

  const onStartGameClick = useCallback(async () => {
    try {
      const roomRef = ref(database, `rooms/${roomId}`);
      const roomData = await get(roomRef);
      const data = roomData.val() as RoomData;
      await set(roomRef, {
        ...data,
        status: RoomStatus.SELECTING,
        turn: {
          currentPlayer: data.teams[0].id,
          currentRound: 0,
          currentCharacter: "",
          currentSelect: data.order[0], // First pick/ban
        },
      });
    } catch (error) {
      console.error("Error starting game:", error);
    }
  }, [roomId]);

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={onSubmit} className="w-full space-y-4">
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
              label="Blue Team"
              onChange={handleChange}
              name="teamA"
              value={roomData.teamA}
              placeholder="Enter team A name"
            />
          </div>

          <div>
            <Input
              label="Red Team"
              onChange={handleChange}
              name="teamB"
              value={roomData.teamB}
              placeholder="Enter team B name"
            />
          </div>
        </div>

        <div>
          <Input
            label="Time Remaining"
            onChange={handleChange}
            name="timeRemaining"
            value={roomData.timeRemaining}
            placeholder="Enter time remaining (seconds)"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-base font-medium text-primary">
            Build Pick/Ban Order
          </label>
          <div className="flex gap-4">
            <div className="basis-1/3 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="w-full bg-blue-500 text-primary rounded-md py-2 hover:bg-secondary/80 transition-colors"
                  onClick={() =>
                    onSelectOrder({ team: "blue", order: SelectType.BAN })
                  }
                >
                  Ban
                </button>
                <button
                  type="button"
                  className="w-full bg-blue-500 text-primary rounded-md py-2 hover:bg-secondary/80 transition-colors"
                  onClick={() =>
                    onSelectOrder({ team: "blue", order: SelectType.PICK })
                  }
                >
                  Pick
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="w-full bg-red-500 text-primary rounded-md py-2 hover:bg-secondary/80 transition-colors"
                  onClick={() =>
                    onSelectOrder({ team: "red", order: SelectType.BAN })
                  }
                >
                  Ban
                </button>
                <button
                  type="button"
                  className="w-full bg-red-500 text-primary rounded-md py-2 hover:bg-secondary/80 transition-colors"
                  onClick={() =>
                    onSelectOrder({ team: "red", order: SelectType.PICK })
                  }
                >
                  Pick
                </button>
              </div>
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
                    item.team === "red" ? "red" : "blue"
                  }-500`}
                >
                  {index + 1}. {item.order === SelectType.BAN ? "Ban" : "Pick"}
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
