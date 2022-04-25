import { useState } from "react";
import { useAppDispatch } from "../../app/hook";
import { LEVEL } from "../../models/edit-level";
import { BlockEdit } from "../../models/edit-level/slice";
import { BlockState } from "../../models/edit-level/state";
import {
  BlockIdProp,
  BoolProp,
  ColorProperty,
  NumberProp,
  PropRow,
  PropSecTitle,
  TextProp,
} from "./common";

export default function BlockProps(props: {
  blk: BlockState;
  sizePercent: number;
}) {
  let { blk, sizePercent } = props;

  let dispatch = useAppDispatch();
  let editBlk = (edit: Omit<BlockEdit, "id">) =>
    dispatch(LEVEL.updateBlk({ id: blk.id, ...edit }));

  let [ensureSquare, setEnsureSquare] = useState(true);

  let resize = (sz: { w?: number; h?: number }) => {
    let [w, h] = [blk.width, blk.height];
    if (ensureSquare) {
      if (sz.w) w = h = sz.w;
      if (sz.h) w = h = sz.h;
    } else {
      if (sz.w) w = sz.w;
      if (sz.h) h = sz.h;
    }
    dispatch(LEVEL.resizeBlk({ id: blk.id, w, h }));
  };

  return (
    <div
      className="block-property prop-editor-section"
      style={{
        height: `${sizePercent}%`,
      }}
    >
      <PropSecTitle>Block Properties</PropSecTitle>
      <div className="prop-editor-content">
        <PropRow label="ID">{blk.id}</PropRow>
        <TextProp
          label="Name"
          value={blk.name}
          onChange={(e) => editBlk({ name: e.target.value })}
        />
        <NumberProp
          label="Width"
          min={1}
          max={30}
          value={blk.width}
          onChange={(v) => resize({ w: v })}
        />
        <NumberProp
          label="Height"
          precision={0}
          min={1}
          max={30}
          value={blk.height}
          onChange={(v) => resize({ h: v })}
        />
        <BoolProp
          label="Ensure Square Size"
          value={ensureSquare}
          onChange={(v) => setEnsureSquare(v)}
        />
        <BoolProp
          label="Fill with Walls"
          value={blk.fillWithWalls}
          onChange={(val) => {
            editBlk({ fillWithWalls: val });
          }}
        />
        <BoolProp
          label="Is ε"
          value={blk.infEnter}
          onChange={(val) => {
            editBlk({ infEnter: val });
          }}
        />
        {blk.infEnter && (
          <>
            <NumberProp
              label="ε Level"
              value={blk.infEnterNum}
              onChange={(val) => {
                editBlk({ infEnterNum: val });
              }}
            />
            <BlockIdProp
              label="ε Enter From"
              value={blk.infEnterId}
              onChange={(val) => {
                editBlk({ infEnterId: val });
              }}
            />
          </>
        )}
        <ColorProperty
          value={blk.hsl}
          onChange={(val) => {
            editBlk({ hsl: val });
          }}
        />
        <NumberProp
          label="Zoom Factor"
          value={blk.zoomFactor}
          onChange={(val) => editBlk({ zoomFactor: val })}
          min={0.01}
          step={0.01}
          precision={2}
        />
        <BoolProp
          label="Float in Space"
          value={blk.floatInSpace}
          onChange={(val) => {
            editBlk({ floatInSpace: val });
          }}
        />
        <NumberProp
          label="Special Effect"
          precision={0}
          min={0}
          value={blk.specialEffect}
          onChange={(v) => editBlk({ specialEffect: v })}
        />
      </div>
    </div>
  );
}
