import { useState } from "react";
import { Input } from "../Input";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export function CreateForm() {
  const [roomData, setRoomData] = useState({
    name: "",
    banAmount: 2,
    pickAmount: 8,
    status: "waiting",
    pickBanOrder: [],
  });

  const [builtOrder, setBuiltOrder] = useState<string[]>([]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const item = orderItems[result.source.index];
    const newBuiltOrder = [...builtOrder, item.content[0]];
    setBuiltOrder(newBuiltOrder);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(roomData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            <div className="flex-1 p-4 border rounded-md">
              <Droppable droppableId="available">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {orderItems.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-2 bg-gray-100 rounded cursor-move"
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>

          <div className="flex-1 p-4 border rounded-md">
            <div className="font-medium mb-2">Current Order:</div>
            <div className="flex flex-wrap gap-1">
              {builtOrder.map((item, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary text-white rounded"
                >
                  {item === "B" ? "Ban" : "Pick"}
                </span>
              ))}
            </div>
          </div>
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
