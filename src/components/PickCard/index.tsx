import characters from "@/resources/characters.json";
import Image from "next/image";
import { useMemo } from "react";

interface PickCardProps {
  name: string;
  isCurrentTurn: boolean;
  selectedCharacter?: string;
}

export default function PickCard({
  name,
  isCurrentTurn,
  selectedCharacter,
}: PickCardProps) {
  const character = useMemo(() => {
    const char = isCurrentTurn && selectedCharacter ? selectedCharacter : name;

    return characters.find(
      (character) => character.name.toLowerCase() === char.toLowerCase()
    );
  }, [name, selectedCharacter, isCurrentTurn]);

  return (
    <div className="relative w-full h-[120px] bg-[#1c1c1c] border border-[#272727] rounded flex items-center justify-between">
      <Image
        src={character ? character.avatar : "/icons/ticket.png"}
        alt={character ? character.name : "Ticket"}
        className="h-full w-auto"
        width={256}
        height={256}
      />
      {isCurrentTurn && (
        <div className="absolute inset-0 rounded-lg border-2 border-primary animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
