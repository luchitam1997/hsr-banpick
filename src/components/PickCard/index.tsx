import characters from "@/resources/characters.json";
import Image from "next/image";
import { useMemo } from "react";

interface PickCardProps {
  name: string;
}

export default function PickCard({ name }: PickCardProps) {
  const character = useMemo(() => {
    if (!name) return null;
    return characters.find(
      (character) => character.name.toLowerCase() === name.toLowerCase()
    );
  }, [name]);

  return (
    <div className="w-full h-[120px] bg-[#1c1c1c] border border-[#272727] rounded flex items-center justify-between">
      <Image
        src={character ? character.avatar : "/icons/ticket.png"}
        alt={character ? character.name : "Ticket"}
        className="h-full w-auto"
        width={100}
        height={100}
      />
    </div>
  );
}
