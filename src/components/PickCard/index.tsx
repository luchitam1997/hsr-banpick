import { CharacterSelect } from "@/hooks/types";
import characters from "@/resources/characters.json";
import Image from "next/image";
import costs from "@/resources/costs.json";
import { useMemo } from "react";

interface PickCardProps {
  confirmedCharacter: CharacterSelect;
  isCurrentTurn: boolean;
  selectedCharacter?: string;
  onSelectRelic: (characterSelect: CharacterSelect) => void;
  readOnly?: boolean;
}

export default function PickCard({
  confirmedCharacter,
  isCurrentTurn,
  selectedCharacter,
  onSelectRelic,
  readOnly = false,
}: PickCardProps) {
  const character = useMemo(() => {
    const char =
      isCurrentTurn && selectedCharacter
        ? selectedCharacter
        : confirmedCharacter.character;

    return characters.find(
      (character) => character.name.toLowerCase() === char.toLowerCase()
    );
  }, [confirmedCharacter, selectedCharacter, isCurrentTurn]);

  const handleSelectRelic = (value: number) => {
    if (readOnly) return;
    const charCost = costs.find(
      (cost) =>
        cost.name.toLowerCase() === confirmedCharacter.character.toLowerCase()
    )?.costs[value];

    onSelectRelic({
      ...confirmedCharacter,
      relic: value,
      point: charCost ?? 0,
    });
  };

  return (
    <div className="relative w-full h-[120px] bg-[#1c1c1c] border border-[#272727] rounded flex items-center">
      <Image
        src={character ? character.avatar : "/icons/ticket.png"}
        alt={character ? character.name : "Ticket"}
        className="h-full w-auto"
        width={256}
        height={256}
      />

      {confirmedCharacter.character && (
        <div className="w-full px-2 flex flex-col gap-2">
          <select
            className={`w-full h-full bg-transparent border border-gray-500 rounded-md p-2 outline-none text-white`}
            onChange={(e) => handleSelectRelic(Number(e.target.value))}
            value={confirmedCharacter.relic}
            disabled={readOnly}
          >
            <option value={0} className="bg-black hover:bg-gray-400">
              0
            </option>
            <option value={1} className="bg-black hover:bg-gray-400">
              1
            </option>
            <option value={2} className="bg-black hover:bg-gray-400">
              2
            </option>
            <option value={3} className="bg-black hover:bg-gray-400">
              3
            </option>
            <option value={4} className="bg-black hover:bg-gray-400">
              4
            </option>
            <option value={5} className="bg-black hover:bg-gray-400">
              5
            </option>
            <option value={6} className="bg-black hover:bg-gray-400">
              6
            </option>
          </select>
          <p className="text-white text-base">
            Điểm: {confirmedCharacter.point}
          </p>
        </div>
      )}

      {isCurrentTurn && (
        <div className="absolute inset-0 rounded-lg border-2 border-primary animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
