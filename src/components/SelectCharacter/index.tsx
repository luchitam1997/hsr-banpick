import { DESTINIES } from "@/constants/destinies";
import {
  Character,
  CharacterSelect,
  Order,
  RoomStatus,
  SelectType,
  Team,
  Turn,
} from "@/hooks/types";
import characters from "@/resources/characters.json";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { EndGameModal } from "../EndGameModal";
import costs from "@/resources/costs.json";

interface SelectCharacterProps {
  readOnly: boolean;
  onSelect?: (character: Character) => void;
  onConfirmPick?: (params: CharacterSelect) => void;
  onConfirmBan?: () => void;
  onEndGame?: (team: Team) => void;
  onNextSelectCharacter?: () => void;
  onNextSelectRelic?: () => void;
  selectedCharacter: string;
  disabledCharacters: string[];
  status?: RoomStatus;
  orders?: Order[];
  turn?: Turn;
  isShowSelectedCharacter?: boolean;
  teams?: Team[];
}

export function SelectCharacter({
  readOnly,
  onSelect,
  onConfirmPick,
  onConfirmBan,
  onEndGame,
  onNextSelectCharacter,
  onNextSelectRelic,
  selectedCharacter,
  disabledCharacters,
  status,
  orders,
  turn,
  teams,
  isShowSelectedCharacter = false,
}: SelectCharacterProps) {
  const [showSelectedCharacter, setShowSelectedCharacter] = useState(false);
  const [showEndGame, setShowEndGame] = useState(false);
  // const [showDetails, setShowDetails] = useState(false)
  const [filter, setFilter] = useState<{
    destiny?: string;
    name?: string;
  }>({
    destiny: undefined,
    name: undefined,
  });

  const handleSelectChar = (character: Character) => {
    if (readOnly || !onSelect || disabledCharacters.includes(character.name))
      return;
    onSelect(character);

    // if (
    //   orders &&
    //   orders.length > 0 &&
    //   turn?.currentRound &&
    //   orders[turn?.currentRound].order === SelectType.PICK
    // ) {
    //   setShowDetails(true);
    // }
  };

  // const handleCloseDetails = () => {
  //   setShowDetails(false);
  // };

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

  const currentCharacter = useMemo(() => {
    return characters.find((character) => character.name === selectedCharacter);
  }, [selectedCharacter]);

  const isDisabled = (character: Character) => {
    return disabledCharacters.includes(character.name);
  };

  useEffect(() => {
    if (currentCharacter && isShowSelectedCharacter) {
      setShowSelectedCharacter(true);
    }

    const timeout = setTimeout(() => {
      setShowSelectedCharacter(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentCharacter, isShowSelectedCharacter]);

  const openEndGameModal = () => {
    setShowEndGame(true);
  };

  const handleEndGame = (team: Team) => {
    setShowEndGame(false);
    if (onEndGame) {
      onEndGame(team);
    }
  };

  const closeEndGameModal = () => {
    setShowEndGame(false);
  };

  const handleConfirmPick = () => {
    const characterCost = costs.find(
      (cost) => cost.name.toLowerCase() === selectedCharacter.toLowerCase()
    );
    if (!characterCost || !onConfirmPick) return;
    onConfirmPick({
      character: selectedCharacter,
      relic: 0,
      // weapon: weaponType,
      // weaponLevel,
      point: characterCost.costs[0] ?? 0,
    });
  };

  const isSelectComplete = useMemo(() => {
    if (!teams) return false;
    const teamAPickLength = teams[0].picks.length;
    const teamBPickLength = teams[1].picks.length;
    return (
      !!teams[0].picks[teamAPickLength - 1].character &&
      !!teams[1].picks[teamBPickLength - 1].character
    );
  }, [teams]);

  const currentPlayer = useMemo(() => {
    if (!turn || !teams) return;
    return teams.find((team) => team.id === turn.currentPlayer);
  }, [turn, teams]);

  const currentOrder = useMemo(() => {
    if (!turn || !orders) return;
    return orders[turn.currentRound].order;
  }, [turn, orders]);

  return (
    <div className="basis-1/2">
      {teams && (
        <div className="w-full flex items-center justify-between mt-4">
          <p className="text-white text-2xl font-bold text-center border border-blue-500 rounded-lg p-2 w-[100px]">
            {teams[0].totalPoints}
          </p>
          <p className="text-primary text-5xl font-bold text-center">
            {teams[0].node}
          </p>

          <p className="text-primary text-2xl font-bold text-center">
            {status === RoomStatus.SELECTING_CHARACTER &&
              (isSelectComplete
                ? "Đợi host xác nhận"
                : `Team ${currentPlayer?.name} ${currentOrder}`)}
            {status === RoomStatus.SELECTING_RELIC && `Thời gian chọn tinh hồn`}
            {status === RoomStatus.PLAYING && `Trận đấu đang diễn ra`}
          </p>

          <p className="text-primary text-5xl font-bold text-center">
            {teams[1].node}
          </p>
          <p className="text-white text-2xl font-bold text-center border border-red-500 rounded-lg p-2 w-[100px]">
            {teams[1].totalPoints}
          </p>
        </div>
      )}

      {/* Characters list */}
      <div className="w-full h-[400px] overflow-y-auto bg-[#1c1c1c] border border-[#272727] rounded p-4 mt-4 ">
        {filteredCharacters.length > 0 ? (
          <div className="w-full grid grid-cols-8 gap-2">
            {filteredCharacters.map((character, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-between"
              >
                <Image
                  width={100}
                  height={100}
                  key={index}
                  src={character.avatar}
                  alt={character.name}
                  className={`  ${
                    isDisabled(character)
                      ? "grayscale cursor-not-allowed"
                      : "cursor-pointer hover:opacity-50"
                  }`}
                  onClick={() => handleSelectChar(character)}
                />
                <span className="w-full text-primary text-xs font-bold text-center text-ellipsis overflow-hidden whitespace-nowrap">
                  {character.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="w-full text-primary text-center">No characters found</p>
        )}
      </div>

      <div className="w-full flex items-center justify-between mt-4">
        <div className="flex gap-2">
          {DESTINIES.map((destiny, index) => (
            <div
              key={index}
              className={` pb-2 ${
                filter.destiny === destiny.slug && "border-b-2 border-secondary"
              }`}
            >
              <Image
                src={destiny.icon}
                alt={destiny.name}
                width={256}
                height={256}
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
          <Image
            src="/icons/search.png"
            alt="search"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </div>
      </div>

      {orders && orders.length > 0 && (
        <div className="w-full mt-4 flex items-center justify-center gap-2">
          {orders.map((order, index) => (
            <span
              key={index}
              className={`p-3 text-primary rounded-full ${
                order.team === "blue" ? "bg-blue-500" : "bg-red-500"
              } ${
                turn?.currentRound === index &&
                status === RoomStatus.SELECTING_CHARACTER &&
                "animate-pulse !bg-gray-500"
              } ${order.team === "red" ? "translate-y-full" : ""}`}
            >
              {order.order === SelectType.PICK ? "Pick" : "Ban"}
            </span>
          ))}
        </div>
      )}

      {status === RoomStatus.SELECTING_CHARACTER &&
        onConfirmBan &&
        turn &&
        turn.currentSelect &&
        turn.currentSelect.order === SelectType.BAN && (
          <div className="w-full flex items-center justify-center mt-20">
            <button
              className={`w-1/2 h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727] ${
                readOnly ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={onConfirmBan}
              disabled={readOnly}
            >
              Ban
            </button>
          </div>
        )}

      {status === RoomStatus.SELECTING_CHARACTER &&
        onConfirmPick &&
        turn &&
        turn.currentSelect &&
        turn.currentSelect.order === SelectType.PICK && (
          <div className="w-full flex items-center justify-center mt-20">
            <button
              className={`w-1/2 h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727] ${
                readOnly ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleConfirmPick}
              disabled={readOnly}
            >
              Pick
            </button>
          </div>
        )}

      {status === RoomStatus.SELECTING_CHARACTER && onNextSelectCharacter && (
        <div className="w-full flex items-center justify-center mt-20">
          <button
            className="w-1/2 h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727]"
            onClick={onNextSelectCharacter}
          >
            Next
          </button>
        </div>
      )}

      {status === RoomStatus.SELECTING_RELIC && onNextSelectRelic && (
        <div className="w-full flex items-center justify-center mt-20">
          <button
            className="w-1/2 h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727]"
            onClick={onNextSelectRelic}
          >
            Play
          </button>
        </div>
      )}

      {status === RoomStatus.PLAYING && onEndGame && (
        <div className="w-full flex items-center justify-center mt-20">
          <button
            className="w-1/2 h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727]"
            onClick={openEndGameModal}
          >
            End Game
          </button>
        </div>
      )}

      {showSelectedCharacter && currentCharacter && (
        <div className="w-full h-full bg-black absolute top-0 left-0 z-50 bg-opacity-50 flex items-center justify-center animate-fadeOut">
          <Image
            src={currentCharacter.image}
            alt={currentCharacter.name}
            className="h-full w-auto"
            width={1000}
            height={1000}
          />
        </div>
      )}

      {showEndGame && teams && (
        <EndGameModal
          onClose={closeEndGameModal}
          onWin={handleEndGame}
          teams={teams}
        />
      )}

      {/* {showDetails && onConfirmPick && (
        <SelectCharacterDetails
          selectedCharacter={selectedCharacter}
          onClose={handleCloseDetails}
          onConfirm={onConfirmPick}
        />
      )} */}
    </div>
  );
}
