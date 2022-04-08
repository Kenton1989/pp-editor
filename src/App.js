import "./App.css";
import React, { useState } from "react";
import { inputSaveFile, outputSaveFile } from "./save-file-io";

let saveData = {}

function App() {
  const [text, setText] = useState("");
  return (
    <div className="App">
      <textarea
        name="txt"
        id="txt"
        cols="30"
        rows="10"
        placeholder="enter text here"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <p>
        <button
          id="load"
          onClick={async () => {
            saveData = await inputSaveFile();
            setText(JSON.stringify(saveData, undefined, 4))
          }}
        >
          Load
        </button>
        <button id="save"
          onClick={async () => {
            // await outputSaveFile(saveData);
            await outputSaveFile({
              blockType: "Root",
              version: "4",
              attemptOrder: ["enter", "eat", "push", "possess"],
              shed: true,
              innerPush: true,
              drawStyle: "tui",
              customLevelMusic: 2,
              customLevelPalette: 9,
              children: [],
            });
          }}
        >Save</button>
      </p>
    </div>
  );
}
export default App;
