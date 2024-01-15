import React, { useState, useEffect } from "react";
import "./App.css";
import { FistBooyah } from "./pages/fistBooyah";
import { Inicialize } from "./pages/inicialize";

export function App() {
  const [countBooyah, setCountBooyah] = useState(() => {
    const storedCount = localStorage.getItem("countBooyah");
    return storedCount ? JSON.parse(storedCount) : 0;
  });
  const [numberOfRooms, setNumberOfRooms] = useState(() => {
    const storedRooms = localStorage.getItem("numberOfRooms");
    return storedRooms ? JSON.parse(storedRooms) : 0;
  });

  useEffect(() => {
    localStorage.setItem("countBooyah", JSON.stringify(countBooyah));
  }, [countBooyah]);

  useEffect(() => {
    localStorage.setItem("numberOfRooms", JSON.stringify(numberOfRooms));
  }, [numberOfRooms]);

  const renderContent = () => {
    if (countBooyah === 0) {
      return (
        <Inicialize
          setNumberOfRooms={setNumberOfRooms}
          setCountBooyah={setCountBooyah}
        />
      );
    }

    const rooms = [];

    for (let i = 1; i <= numberOfRooms; i++) {
      let roomContent;

      if (i === 1) {
        roomContent = <FistBooyah key={i} />;
      } else if (i > 1) {
        // Adicione outros componentes de sala aqui, se necessário
        // roomContent = <OutroComponente key={i} />;
      }

      rooms.push(<div key={i}>{roomContent}</div>);
    }

    return rooms;
  };

  return <>{renderContent()}</>;
}
