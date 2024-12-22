import { DESTINIES } from "@/constants/destinies";
import characters from "@/resources/characters.json";
import { useMemo, useState } from "react";

interface Character {
  id: number;
  name: string;
  element: string;
  destiny: string;
  rarity: number;
  image: string;
  avatar: string;
}

export function SelectCharacter() {
  const [selectedChar, setSelectedChar] = useState<Character>();
  const [filter, setFilter] = useState<{
    destiny?: string;
    name?: string;
  }>({
    destiny: undefined,
    name: undefined,
  });

  const handleSelectChar = (character: Character) => {
    setSelectedChar(character);

    setTimeout(() => {
      setSelectedChar(undefined);
    }, 2000);
  };

  const handleFilterDestiny = (destiny: string) => {
    if (filter.destiny === destiny) {
      setFilter({ ...filter, destiny: undefined });
    } else {
      setFilter({ ...filter, destiny });
    }
  };

  const handleFilterName = (name: string) => {
    setFilter({ ...filter, name });
  };

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => {
      if (filter.destiny && character.destiny !== filter.destiny) {
        return false;
      }

      if (
        filter.name &&
        !character.name.toLowerCase().includes(filter.name.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [filter.destiny, filter.name]);

  return (
    <div className="basis-1/2">
      {/* Characters list */}
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-2">
          {DESTINIES.map((destiny, index) => (
            <div
              className={` pb-2 ${
                filter.destiny === destiny.slug && "border-b-2 border-secondary"
              }`}
            >
              <img
                src={destiny.icon}
                alt={destiny.name}
                key={index}
                className={`w-12 h-12 cursor-pointer hover:opacity-50 `}
                onClick={() => handleFilterDestiny(destiny.slug)}
              />
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="w-[240px] h-[40px] bg-[#1c1c1c] border border-[#272727] rounded flex items-center justify-center p-2">
          <input
            type="text"
            className="w-full h-full bg-transparent text-primary outline-none"
            onChange={(e) => handleFilterName(e.target.value)}
          />
          <img src="/icons/search.png" className="w-6 h-6" />
        </div>
      </div>
      <div className="w-full bg-[#1c1c1c] border border-[#272727] rounded p-4 mt-4 ">
        {filteredCharacters.length > 0 ? (
          <div className="w-full grid grid-cols-8 gap-2">
            {filteredCharacters.map((character, index) => (
              <img
                src={character.avatar}
                alt={character.name}
                className="cursor-pointer hover:opacity-50"
                onClick={() => handleSelectChar(character)}
              />
            ))}
          </div>
        ) : (
          <p className="w-full text-primary text-center">No characters found</p>
        )}
      </div>

      <div className="w-full flex items-center justify-center mt-10">
        <button className="w-1/2 h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727]">
          Select
        </button>
      </div>

      {selectedChar && (
        <div className="w-full h-full bg-black absolute top-0 left-0 z-50 bg-opacity-50 flex items-center justify-center">
          <img
            src={selectedChar.image}
            alt={selectedChar.name}
            className="h-full w-auto"
          />
        </div>
      )}
    </div>
  );
}
