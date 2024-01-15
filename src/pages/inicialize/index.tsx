import { useState } from "react";

interface InicializeProps {
  setNumberOfRooms: React.Dispatch<React.SetStateAction<number>>;
  setCountBooyah: React.Dispatch<React.SetStateAction<number>>;
}

export function Inicialize({
  setNumberOfRooms,
  setCountBooyah,
}: InicializeProps) {
  const [numberOfRooms, setNumberOfRoomsInput] = useState(0);

  function handleNumberOfRooms() {
    setNumberOfRooms(numberOfRooms);
    setCountBooyah(1);
  }

  return (
    <div className="flex justify-center mt-[120px] ">
      <div className="flex-col">
        <div className="mb-4">
          <h1 className="text-2xl text-white">
            Digite a quantidade de salas <br></br> que você irá fazer
          </h1>
        </div>
        <div className="flex flex-col">
          <input
            type="number"
            onChange={(e) =>
              setNumberOfRoomsInput(parseInt(e.target.value, 10))
            }
            className="bg-gray-200 focus:outline-none focus:ring focus:border-blue-300 py-2 px-4 rounded-md w-full"
            placeholder="Digite a quantidade de salas..."
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
            onClick={handleNumberOfRooms}
          >
            Iniciar
          </button>
        </div>
      </div>
    </div>
  );
}
