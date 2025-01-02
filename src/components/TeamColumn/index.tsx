import { useMemo } from "react";
import PickCard from "../PickCard";
import BanCard from "../BanCard";

interface TeamColumnProps {
  team: "blue" | "red";
  name: string;
  winCount: number;
  pick: string[];
  ban: string[];
}
export function TeamColumn({
  team,
  name,
  winCount,
  pick,
  ban,
}: TeamColumnProps) {
  console.log(pick);
  console.log(ban);
  const winCountToRoman = useMemo(() => {
    if (!winCount) return "";
    const romanNumerals = ["I", "II", "III", "IV", "V"];
    return romanNumerals[winCount - 1];
  }, [winCount]);

  return (
    <div className="basis-1/4 flex flex-col gap-4">
      {/* Title */}
      <div className="w-full flex justify-between items-center">
        {team === "blue" ? (
          <>
            <p className="text-primary text-2xl font-bold">{name}</p>
            <div
              className={`w-[100px] h-[40px] bg-blue-500 transform skew-x-[20deg] flex items-center justify-center mr-2`}
            >
              <p className={`text-primary text-2xl font-bold -skew-x-[20deg]`}>
                {winCountToRoman}
              </p>
            </div>
          </>
        ) : (
          <>
            <div
              className={`w-[100px] h-[40px] bg-red-500 transform skew-x-[-20deg] flex items-center justify-center ml-2`}
            >
              <p className={`text-primary text-2xl font-bold -skew-x-[-20deg]`}>
                {winCountToRoman}
              </p>
            </div>
            <p className="text-primary text-2xl font-bold">{name}</p>
          </>
        )}
      </div>

      {/* Pick Cards */}
      <div className="w-full grid grid-cols-2 gap-3">
        {pick.map((character, index) => (
          <PickCard key={index} name={character} />
        ))}
      </div>

      {/* Ban Cards */}
      <div className="w-full grid grid-cols-2 gap-3 mt-5">
        {ban.map((character, index) => (
          <BanCard key={index} name={character} />
        ))}
      </div>
    </div>
  );
}
