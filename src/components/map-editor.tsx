import { Button, Input } from "antd";
import Color from "color";
import { useState } from "react";
import { useCurrentBlk } from "../app/selector";
import { inputLevelFile, outputLevelFile } from "../game-level-file";
import { toHslArr } from "../models/edit-level/color";
import { BlockCellPreview, BlockPreview } from "./block-preview";
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
      <p>
        <BlockCellPreview
          cell={{
            cellType: "Ref",
            x: 0,
            y: 0,
            id: 1,
            exitBlock: true,
            infExit: false,
            infExitNum: 0,
            infEnter: false,
            infEnterNum: 0,
            infEnterId: 0,
            player: false,
            possessable: false,
            playerOrder: 0,
            flipH: true,
            floatInSpace: false,
            specialEffect: 0,
          }}
          parentColor={Color.hsl(toHslArr("root block"))}
        />
      </p>
    </div>
  );
}
