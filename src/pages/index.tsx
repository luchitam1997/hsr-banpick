import Image from "next/image";
import characters from "../resources/characters.json";
import { DESTINIES } from "@/constants/destinies";
import { TeamColumn } from "@/components/TeamColumn";
import { useState } from "react";
import { SelectCharacter } from "@/components/SelectCharacter";

export default function Home() {
  return (
    <main className="w-full h-full p-5">
      {/* Header */}
      <div className="w-full h-full flex items-center gap-1">
        <p className="text-secondary text-2xl font-bold">
          Honkai Star Rail: All stars competition /
        </p>
        <p className="text-primary text-2xl font-bold">Championship</p>
      </div>

      <div className="mt-4 flex flex-row gap-4">
        {/* Team A */}
        <TeamColumn team="blue" name="Blue Team" winCount={1} />

        <SelectCharacter />

        {/* Team B */}
        <TeamColumn team="red" name="Red Team" winCount={2} />
      </div>
    </main>
  );
}
