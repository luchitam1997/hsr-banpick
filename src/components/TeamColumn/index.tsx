import characters from "@/resources/characters.json";
import { useMemo } from "react";

interface TeamColumnProps {
  team: "blue" | "red";
  name: string;
  winCount: number;
}
export function TeamColumn({ team, name, winCount }: TeamColumnProps) {
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
              <p
                className={`text-primary text-2xl font-bold -skew-x-[${
                  team === "blue" ? "20deg" : "-20deg"
                }]`}
              >
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
        {characters.slice(0, 8).map((character, index) => (
          <div className="w-full h-[120px] bg-[#1c1c1c] border border-[#272727] rounded flex items-center justify-between">
            <img
              src={character.avatar}
              alt={character.name}
              className="h-full w-auto"
            />
          </div>
        ))}
      </div>

      {/* Ban Cards */}
      <div className="w-full grid grid-cols-2 gap-3 mt-5">
        {characters.slice(0, 2).map((character, index) => (
          <div className="relative">
            <img
              src={character.avatar}
              alt={character.name}
              className="w-full h-auto grayscale"
            />
            {/* <img src="/icons/ban.png" className="absolute bottom-0" /> */}
          </div>
        ))}
      </div>
    </div>
  );
}
