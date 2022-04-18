import { Button, Input } from "antd";
import { useState } from "react";
import { useCurrentBlk } from "../app/selector";
import { inputLevelFile, outputLevelFile } from "../game-level-file";
import { BlockPreview } from "./block-preview";
import "./map-editor.css";

export default function MapEditor(props: {}) {
  const [txt, setTxt] = useState("");
  const blk = useCurrentBlk();
  return (
    <div className="map-editor">
      <Input.TextArea onChange={(e) => setTxt(e.target.value)} value={txt} />
      <Button
        onClick={async () => {
          try {
            let [save] = await inputLevelFile();
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
            await outputLevelFile(save);
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
            setTxt(JSON.stringify(save, undefined, 4));
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Format
      </Button>
      <p>{blk && <BlockPreview block={blk} width={600} height={600} />}</p>
    </div>
  );
}
