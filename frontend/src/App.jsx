import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="bg-pink-600 text-4xl text-white text-center p-7 m-3 rounded-2xl">
        <h1>Narkel Ptahano Hok</h1>
      </div>
    </>
  );
}

export default App;
