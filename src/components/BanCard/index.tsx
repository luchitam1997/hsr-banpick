import characters from "@/resources/characters.json";
import Image from "next/image";
import { useMemo } from "react";

interface BanCardProps {
  name: string;
  isCurrentTurn: boolean;
  selectedCharacter?: string;
}

export default function BanCard({
  name,
  isCurrentTurn,
  selectedCharacter,
}: BanCardProps) {
  const character = useMemo(() => {
    const char = isCurrentTurn && selectedCharacter ? selectedCharacter : name;

    return characters.find(
      (character) => character.name.toLowerCase() === char.toLowerCase()
    );
  }, [name, selectedCharacter, isCurrentTurn]);

  return (
    <div className="relative">
      {character ? (
        <div>
          <Image
            src={character.avatar}
            alt={character.name}
            className={`w-[100px] h-[100px] ${character ? "grayscale" : ""} `}
            width={256}
            height={256}
          />
        </div>
      ) : (
        <div className="">
          <Image
            src={"/icons/ban-placeholder.png"}
            alt={"Ticket"}
            className={`w-[100px] h-[100px]`}
            width={256}
            height={256}
          />
        </div>
      )}

      {isCurrentTurn && (
        <div className="absolute inset-0 rounded-lg border-2 border-primary animate-pulse pointer-events-none" />
      )}

      {character && (
        <Image
          src="/icons/ban.png"
          alt="Ban"
          className="absolute w-10 h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          width={512}
          height={512}
        />
      )}
    </div>
  );
}
