import { useState } from "react";
import { Input } from "../Input";
import Link from "next/link";
import { useCopyToClipboard } from "usehooks-ts";
import Image from "next/image";

export function CreateForm() {
  const [roomData, setRoomData] = useState({
    name: "",
    teamA: "",
    teamB: "",
    status: "waiting",
    pickBanOrder: [] as string[],
  });

  const [, copy] = useCopyToClipboard();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(roomData);
  };

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

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
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
        Create Room
      </button>

      <div className="flex flex-col gap-4 mt-4">
        {/* Team A */}
        <div className="w-full flex gap-4 items-center">
          <Link
            href="https://hsr-banpick-app.vercel.app/uuid/teamA"
            className="max-w-[200px] truncate text-primary text-sm p-2"
          >
            TeamA: https://hsr-banpick-app.vercel.app/uuid/teamA
          </Link>

          <Image
            src="/icons/copy.png"
            alt="copy"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() =>
              copy("https://hsr-banpick-app.vercel.app/uuid/teamA")
            }
          />

          <Image
            src="/icons/redirect.png"
            alt="redirect"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() =>
              window.open(
                "https://hsr-banpick-app.vercel.app/uuid/teamA",
                "_blank"
              )
            }
          />
        </div>

        {/* Team B */}
        <div className="w-full flex gap-4 items-center">
          <Link
            href="https://hsr-banpick-app.vercel.app/uuid/teamB"
            className="max-w-[200px] truncate text-primary text-sm p-2"
          >
            TeamB: https://hsr-banpick-app.vercel.app/uuid/teamB
          </Link>

          <Image
            src="/icons/copy.png"
            alt="copy"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() =>
              copy("https://hsr-banpick-app.vercel.app/uuid/teamB")
            }
          />

          <Image
            src="/icons/redirect.png"
            alt="redirect"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() =>
              window.open(
                "https://hsr-banpick-app.vercel.app/uuid/teamB",
                "_blank"
              )
            }
          />
        </div>

        {/* Audience */}
        <div className="w-full flex gap-4 items-center">
          <Link
            href="https://hsr-banpick-app.vercel.app/uuid/audience"
            className="max-w-[200px] truncate text-primary text-sm p-2"
          >
            Audience: https://hsr-banpick-app.vercel.app/uuid/audience
          </Link>

          <Image
            src="/icons/copy.png"
            alt="copy"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() =>
              copy("https://hsr-banpick-app.vercel.app/uuid/audience")
            }
          />

          <Image
            src="/icons/redirect.png"
            alt="redirect"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() =>
              window.open(
                "https://hsr-banpick-app.vercel.app/uuid/audience",
                "_blank"
              )
            }
          />
        </div>
      </div>
    </form>
  );
}
