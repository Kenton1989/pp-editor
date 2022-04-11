import { Button, Input } from "antd";
import { useState } from "react";
import { inputSaveFile, outputSaveFile } from "../game-save-file";
import "./map-editor.css";

export default function MapEditor(props) {
  const [txt, setTxt] = useState("");

  return (
    <div className="map-editor">
      <Input.TextArea onChange={(e) => setTxt(e.target.value)} value={txt} />
      <Button
        onClick={async () => {
          try {
            let save = await inputSaveFile();
            setTxt(JSON.stringify(save, undefined, 4));
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Load
      </Button>
      <Button
        onClick={async () => {
          try {
            let save = JSON.parse(txt);
            await outputSaveFile(save);
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Save
      </Button>
      <Button
        onClick={async () => {
          try {
            let save = JSON.parse(txt);
            setTxt(JSON.stringify(save, undefined, 4))
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Format
      </Button>
    </div>
  );
}
