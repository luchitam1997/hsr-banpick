import { CharacterSelect } from "@/hooks/types";
import characters from "@/resources/characters.json";
import Image from "next/image";
import costs from "@/resources/costs.json";
import { useMemo } from "react";
import { ELEMENTS } from "@/constants/elements";
import { DESTINIES } from "@/constants/destinies";

interface PickCardProps {
  confirmedCharacter: CharacterSelect;
  isCurrentTurn: boolean;
  selectedCharacter?: string;
  onSelectRelic?: (characterSelect: CharacterSelect) => void;
  readOnly?: boolean;
  placement?: "left" | "right";
}

export default function PickCard({
  confirmedCharacter,
  isCurrentTurn,
  selectedCharacter,
  onSelectRelic,
  readOnly = false,
  placement = "left",
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
    if (readOnly || !onSelectRelic) return;
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

  const currentElement = useMemo(() => {
    const character = characters.find(
      (character) => character.name === confirmedCharacter.character
    );
    if (!character) return "";
    const currentElement = ELEMENTS.find(
      (element) => element.slug === character.element
    );
    if (!currentElement) return "";
    return currentElement.iconColor;
  }, [confirmedCharacter.character]);

  const currentDestiny = useMemo(() => {
    const character = characters.find(
      (character) => character.name === confirmedCharacter.character
    );
    if (!character) return "";

    const currentDestiny = DESTINIES.find(
      (destiny) => destiny.slug === character.destiny
    );
    if (!currentDestiny) return "";
    return currentDestiny.icon;
  }, [confirmedCharacter.character]);

  return (
    <div
      className={`relative w-full h-[120px] bg-[#1c1c1c] border border-[#272727] rounded flex items-center ${
        placement === "right" ? "flex-row-reverse" : ""
      }`}
    >
      {character ? (
        <Image
          src={character.avatar}
          alt={character.name}
          className="h-full w-auto"
          width={256}
          height={256}
        />
      ) : (
        <Image
          src={"/icons/hero.png"}
          alt={"Hero"}
          className="h-full w-auto"
          width={256}
          height={256}
        />
      )}

      {confirmedCharacter.character && (
        <div
          className={`w-full px-2 flex gap-2 ${
            placement === "right" && "flex-row-reverse"
          }`}
        >
          <div className="w-full flex flex-col gap-2 items-center">
            <p className="text-white text-base font-bold">
              {confirmedCharacter.character}
            </p>
            <div className="flex">
              <Image
                src={currentElement}
                alt={confirmedCharacter.character}
                className="w-10 h-auto"
                width={256}
                height={256}
              />
              <Image
                src={currentDestiny}
                alt={confirmedCharacter.character}
                className="w-10 h-auto"
                width={256}
                height={256}
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 items-center">
            <p className="text-white text-base font-bold">Tinh hồn</p>
            <select
              className={`w-[60px] h-full bg-transparent border border-gray-500 rounded-md p-2 outline-none text-white`}
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
          </div>
          <div className="w-full flex flex-col gap-2 items-center">
            <p className="text-white text-base font-bold">Điểm</p>
            <p className="text-white text-xl font-bold">
              {confirmedCharacter.point}
            </p>
          </div>
        </div>
      )}

      {isCurrentTurn && (
        <div className="absolute inset-0 rounded-lg border-2 border-primary animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
