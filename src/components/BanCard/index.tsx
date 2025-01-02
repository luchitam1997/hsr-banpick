import characters from "@/resources/characters.json";
import Image from "next/image";
import { useMemo } from "react";

interface BanCardProps {
  name: string;
}

export default function BanCard({ name }: BanCardProps) {
  const character = useMemo(() => {
    if (!name) return null;
    return characters.find(
      (character) => character.name.toLowerCase() === name.toLowerCase()
    );
  }, [name]);

  return (
    <div className="relative">
      <Image
        src={character ? character.avatar : "/icons/normal-ticket.png"}
        alt={character ? character.name : "Ticket"}
        className={`w-full h-auto ${character ? "grayscale" : ""}`}
        width={100}
        height={100}
      />
      {/* <img src="/icons/ban.png" className="absolute bottom-0" /> */}
    </div>
  );
}
