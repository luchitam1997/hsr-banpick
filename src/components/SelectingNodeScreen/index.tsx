import { Enemy, Team } from "@/hooks/types";
import enemies from "@/resources/enemies.json";
import Image from "next/image";
import { useMemo } from "react";

interface SelectingNodeScreenProps {
  onSelectNode?: (node: "11.1" | "11.2" | "12.1" | "12.2") => void;
  nodeDisabled?: "11.1" | "11.2" | "12.1" | "12.2";
  readonly?: boolean;
  isCurrentTurn?: boolean;
  teams?: Team[];
  onNext?: () => void;
}

export const SelectingNodeScreen = ({
  onSelectNode,
  nodeDisabled,
  readonly = false,
  isCurrentTurn,
  teams,
  onNext,
}: SelectingNodeScreenProps) => {
  const handleClickNode = (node: string) => {
    if (readonly || !onSelectNode || !isCurrentTurn) return;
    if (nodeDisabledArray.includes(node as "11.1" | "11.2" | "12.1" | "12.2"))
      return;

    onSelectNode(node as "11.1" | "11.2" | "12.1" | "12.2");
  };

  const nodeDisabledArray = useMemo(() => {
    if (!nodeDisabled) return [];
    const floor = nodeDisabled.slice(0, 2);
    return enemies
      .filter((enemy) => enemy.id.includes(floor))
      .map((enemy) => enemy.id) as ("11.1" | "11.2" | "12.1" | "12.2")[];
  }, [nodeDisabled]);

  const teamAPick = useMemo(() => {
    if (!teams) return;
    return teams[0].node;
  }, [teams]);

  const teamBPick = useMemo(() => {
    if (!teams) return;
    return teams[1].node;
  }, [teams]);

  const Tooltip = ({ team, color }: { team?: Team; color: string }) => {
    return (
      team && (
        <div className="absolute top-[110%] left-0 w-full h-fit flex items-center justify-center">
          <div
            className={`w-full bg-${color}-500 text-white px-2 py-1 rounded-lg`}
          >
            <h1 className="text-base font-bold text-center">{team.name}</h1>
          </div>
        </div>
      )
    );
  };

  return (
    <div className="fixed w-screen h-screen inset-0 flex items-center justify-center bg-black/50">
      <div>
        <div className="w-full h-fit grid grid-cols-4 gap-4">
          {enemies.map((enemy: Enemy, index: number) => (
            <div
              key={index}
              className={`p-4 rounded-lg h-full relative ${
                !isCurrentTurn
                  ? "cursor-not-allowed"
                  : nodeDisabledArray.includes(
                      enemy.id as "11.1" | "11.2" | "12.1" | "12.2"
                    )
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={() => handleClickNode(enemy.id)}
            >
              <Image
                src={enemy.image}
                alt={enemy.name}
                width={500}
                height={500}
                className={`w-full h-full object-cover ${
                  !isCurrentTurn && !readonly && "grayscale"
                } ${
                  nodeDisabledArray.includes(
                    enemy.id as "11.1" | "11.2" | "12.1" | "12.2"
                  )
                    ? "grayscale"
                    : ""
                } hover:scale-105 transition-all duration-300`}
              />
              <p className="text-white text-2xl font-bold text-center">
                {enemy.name}
              </p>
              {teams && teamAPick === enemy.id && (
                <Tooltip team={teams[0]} color="blue" />
              )}
              {teams && teamBPick === enemy.id && (
                <Tooltip team={teams[1]} color="red" />
              )}
            </div>
          ))}
        </div>

        {onNext && (
          <div className="flex items-center justify-center mt-20">
            <button
              className="w-[400px] h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727] mt-4"
              onClick={onNext}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
