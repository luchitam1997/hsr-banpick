import { useState } from "react";
import { Input } from "../Input";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: "100%",
});

export function CreateForm() {
  const [roomData, setRoomData] = useState({
    name: "",
    banAmount: 0,
    pickAmount: 0,
    status: "waiting",
    pickBanOrder: [] as string[],
  });

  const reorder = (list: string[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newOrder = reorder(
      roomData.pickBanOrder,
      result.source.index,
      result.destination.index
    );
    setRoomData({ ...roomData, pickBanOrder: newOrder });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(roomData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "banAmount") {
      setRoomData({
        ...roomData,
        banAmount: Number(e.target.value),
        pickBanOrder: [
          ...Array(e.target.value).fill("ban"),
          ...Array(roomData.pickAmount).fill("pick"),
        ],
      });
      return;
    }

    if (e.target.name === "pickAmount") {
      setRoomData({
        ...roomData,
        pickAmount: Number(e.target.value),
        pickBanOrder: [
          ...Array(roomData.banAmount).fill("ban"),
          ...Array(e.target.value).fill("pick"),
        ],
      });
      return;
    }

    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <Input
          label="Room Name"
          onChange={handleChange}
          name="name"
          value={roomData.name}
          placeholder="Enter room name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label="Ban Amount"
            onChange={handleChange}
            name="banAmount"
            value={roomData.banAmount}
          />
        </div>
        <div>
          <Input
            label="Pick Amount"
            onChange={handleChange}
            name="pickAmount"
            value={roomData.pickAmount}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Build Pick/Ban Order
        </label>
        <div className="flex gap-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {roomData.pickBanOrder.map((item, index) => (
                    <Draggable
                      key={index}
                      draggableId={index.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {item === "ban" ? "Ban" : "Pick"}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-secondary text-white rounded-md py-2 hover:bg-secondary/80 transition-colors"
      >
        Create Room
      </button>
    </form>
  );
}
