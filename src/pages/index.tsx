import Image from "next/image";
import characters from "../resources/characters.json";

export default function Home() {
  return (
    <main className="w-full h-full flex items-center justify-center gap-1">
      {/* Header */}
      {/* <div></div> */}
      <div className="w-full h-full flex items-center justify-center gap-1">
        {characters.map((character, index) => (
          <img src={character.avatar} alt={character.name} key={index} />
        ))}
      </div>
    </main>
  );
}
