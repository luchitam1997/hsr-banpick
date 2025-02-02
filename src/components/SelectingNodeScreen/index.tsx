import { Enemy } from "@/hooks/types";
import enemies from "@/resources/enemies.json";
import Image from "next/image";
import { useMemo } from "react";

interface SelectingNodeScreenProps {
  onSelectNode: (node: "11.1" | "11.2" | "12.1" | "12.2") => void;
  nodeDisabled?: "11.1" | "11.2" | "12.1" | "12.2";
  readonly?: boolean;
}

export const SelectingNodeScreen = ({
  onSelectNode,
  nodeDisabled,
  readonly = false,
}: SelectingNodeScreenProps) => {
  const handleClickNode = (node: string) => {
    if (readonly) return;
    if (
      nodeDisabled &&
      nodeDisabled.includes(node as "11.1" | "11.2" | "12.1" | "12.2")
    )
      return;
    onSelectNode(node as "11.1" | "11.2" | "12.1" | "12.2");
  };

  const nodeDisabledArray = useMemo(() => {
    if (!nodeDisabled) return [];
    const floor = nodeDisabled.slice(0, 2);
    return enemies
      .filter((enemy) => enemy.id.includes(floor))
      .map((enemy) => enemy.id) as ("11.1" | "11.2" | "12.1" | "12.2")[];
  }, [nodeDisabled]);

  return (
    <div className="fixed w-screen h-screen inset-0 flex items-center justify-center bg-black/50">
      <div className="w-full grid grid-cols-4 gap-4">
        {enemies.map((enemy: Enemy, index: number) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              readonly
                ? "cursor-not-allowed"
                : nodeDisabledArray.includes(
                    enemy.id as "11.1" | "11.2" | "12.1" | "12.2"
                  )
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => handleClickNode(enemy.id)}
          >
            <Image
              src={enemy.image}
              alt={enemy.name}
              width={500}
              height={500}
              className={`w-full h-full object-cover ${
                readonly && "grayscale"
              } ${
                nodeDisabledArray.includes(
                  enemy.id as "11.1" | "11.2" | "12.1" | "12.2"
                )
                  ? "grayscale"
                  : ""
              } hover:scale-105 transition-all duration-300`}
            />
            <p className="text-white text-2xl font-bold text-center">
              {enemy.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
