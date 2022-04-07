import "./App.css";
import React, { useState } from "react";

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
            setText(await inputTxtFile());
          }}
        >
          Load
        </button>
        <button id="save"
          onClick={() => {
            outputTxtFile(text);
          }}
        >Save</button>
      </p>
    </div>
  );
}

async function inputTxtFile(maxSize = 1000) {
  let el = document.createElement("input");
  el.type = "file";
  el.accept = "text/plain";

  return new Promise((resolve, reject) => {
    el.onchange = (e) => {
      e.preventDefault();
      let file = e.target.files[0];
      if (file.size > maxSize) {
        reject(new Error("file size too large"));
        return;
      }

      let reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        resolve(text);
      };
      reader.readAsText(file);
    };
    console.log("input");
    el.click();
  });
}
function outputTxtFile(text, filename="text.txt") {
  let a = document.createElement("a");
  let file = new Blob([text], { type: "text/plain" });
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
}
export default App;
