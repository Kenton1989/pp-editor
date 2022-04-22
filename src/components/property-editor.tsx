import { useAppDispatch } from "../app/hook";
import { LEVEL } from "../models/edit-level";
import "./property-editor.css";
import {
  Col,
  Empty,
  Input,
  InputNumber,
  InputNumberProps,
  InputProps,
  Radio,
  Row,
  Select,
  SelectProps,
  Switch,
  SwitchProps,
} from "antd";
import { useBlockList, useCurrentCell } from "../app/selector";
import { PropsWithChildren, useState } from "react";
import { BlockEdit, CellEdit } from "../models/edit-level/slice";
import { BlockState } from "../models/edit-level/state";
import { HslColor, toHslArr } from "../models/edit-level/color";
import { HslColorPicker } from "react-colorful";
import { Cell } from "../models/edit-level/cell";
import { FloorType } from "../game-level-file/v4/types";
import { useMemo } from "react";

export default function PropertyEditor(props: {}) {
  let [blk, cell] = useCurrentCell();

  let sectionCnt = 0;
  if (blk !== undefined) ++sectionCnt;
  if (cell !== undefined) ++sectionCnt;

  return (
    <div id="property-editor">
      {sectionCnt === 0 && <Empty description="No Properties Data" />}
      <BlockProps
        blk={blk}
        sizePercent={sectionCnt === 0 ? 100 : 100 / sectionCnt}
      />
      <CellProps
        parentBlk={blk}
        cell={cell}
        sizePercent={sectionCnt === 0 ? 0 : 100 / sectionCnt}
      />
    </div>
  );
}

function BlockProps(props: { blk?: BlockState; sizePercent: number }) {
  let { blk, sizePercent } = props;

  let dispatch = useAppDispatch();
  let editBlk = (edit: Omit<BlockEdit, "id">) =>
    dispatch(LEVEL.updateBlk({ id: blk!.id, ...edit }));

  let [ensureSquare, setEnsureSquare] = useState(true);

  let resize = (sz: { w?: number; h?: number }) => {
    let [w, h] = [blk!.width, blk!.height];
    if (ensureSquare) {
      if (sz.w) w = h = sz.w;
      if (sz.h) w = h = sz.h;
    } else {
      if (sz.w) w = sz.w;
      if (sz.h) h = sz.h;
    }
    dispatch(LEVEL.resizeBlk({ id: blk!.id, w, h }));
  };

  if (!blk) {
    return <></>;
  }

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

function CellProps(props: {
  parentBlk?: BlockState;
  cell?: Cell;
  sizePercent: number;
}) {
  let { parentBlk: parent, cell, sizePercent } = props;

  let dispatch = useAppDispatch();
  let editCell = (edit: Omit<CellEdit, "blkId" | "x" | "y">) =>
    dispatch(
      LEVEL.updateCell({ blkId: parent!.id, x: cell!.x, y: cell!.y, ...edit })
    );

  if (!parent || !cell) {
    return <></>;
  }

  let [
    hslProp,
    idProp,
    exitProp,
    infProp,
    infNumProp,
    epsProp,
    epsNumProp,
    epsFromProp,
    flipHProp,
    floatInSpaceProp,
    specialEffectProp,
    isPlayerProp,
    possessableProp,
    playerOrderProp,
    floorTypeProps,
  ]: (JSX.Element | undefined)[] = [];

  if (cell.cellType === "Box" || cell.cellType === "SimplePlayer") {
    hslProp = (
      <ColorProperty value={cell.hsl} onChange={(v) => editCell({ hsl: v })} />
    );
  }
  // RefCell | WallCell | FloorCell | SimplePlayerCell | BoxCell;
  if (cell.cellType === "Floor") {
    floorTypeProps = (
      <PropRow label="Floor Type">
        <Radio.Group
          value={cell.floorType}
          onChange={(v) => editCell({ floorType: v.target.value })}
          options={FLOOR_TYPE_OPTIONS}
        />
      </PropRow>
    );
  }

  if (cell.cellType === "SimplePlayer" || cell.cellType === "Ref") {
    isPlayerProp = (
      <BoolProp
        label="Is Player"
        value={cell.player}
        onChange={(v) => editCell({ player: v })}
      />
    );
    playerOrderProp = cell.player ? (
      <NumberProp
        label="Player Order"
        value={cell.playerOrder}
        onChange={(v) => editCell({ playerOrder: v })}
      />
    ) : undefined;
    possessableProp = (
      <BoolProp
        label="Possessable"
        value={cell.possessable}
        onChange={(v) => editCell({ possessable: v })}
      />
    );
  }

  if (cell.cellType === "Ref") {
    idProp = (
      <BlockIdProp
        label="Referring"
        value={cell.id}
        onChange={(v) => {
          editCell({ id: v });
        }}
      />
    );
    exitProp = (
      <BoolProp
        label="Is Clone"
        value={!cell.exitBlock}
        onChange={(v) => editCell({ exitBlock: !v })}
      />
    );
    infProp = (
      <BoolProp
        label="Is ∞"
        value={cell.infExit}
        onChange={(v) => editCell({ infExit: v })}
      />
    );
    infNumProp = cell.infExit ? (
      <NumberProp
        label="∞ Level"
        value={cell.infExitNum}
        onChange={(v) => editCell({ infExitNum: v })}
      />
    ) : undefined;
    epsProp = (
      <BoolProp
        label="Is ε"
        value={cell.infEnter}
        onChange={(v) => editCell({ infEnter: v })}
      />
    );
    epsNumProp = cell.infEnter ? (
      <NumberProp
        label="ε Level"
        value={cell.infEnterNum}
        onChange={(v) => editCell({ infEnterNum: v })}
      />
    ) : undefined;
    epsFromProp = cell.infEnter ? (
      <BlockIdProp
        label="ε Enter From"
        value={cell.infEnterId}
        onChange={(v) => editCell({ infEnterId: v })}
      />
    ) : undefined;
    flipHProp = (
      <BoolProp
        label="Horizontal Flip"
        value={cell.flipH}
        onChange={(v) => editCell({ flipH: v })}
      />
    );
    floatInSpaceProp = (
      <BoolProp
        label="Float in Space"
        value={cell.floatInSpace}
        onChange={(v) => editCell({ floatInSpace: v })}
      />
    );
    specialEffectProp = (
      <NumberProp
        label="Special Effect"
        value={cell.specialEffect}
        onChange={(v) => editCell({ specialEffect: v })}
      />
    );
  }

  return (
    <div
      className="cell-property prop-editor-section"
      style={{
        height: `${sizePercent}%`,
      }}
    >
      <PropSecTitle>Cell Properties</PropSecTitle>
      <div className="prop-editor-content">
        <PropRow label="Type">{CELL_TYPE_DISPLAY_NAME[cell.cellType]}</PropRow>
        <PropRow label="Position">{`( ${cell.x} , ${cell.y} )`}</PropRow>
        {idProp}
        {exitProp}
        {infProp}
        {infNumProp}
        {epsProp}
        {epsNumProp}
        {epsFromProp}
        {flipHProp}
        {floatInSpaceProp}
        {specialEffectProp}
        {isPlayerProp}
        {playerOrderProp}
        {possessableProp}
        {hslProp}
        {floorTypeProps}
      </div>
    </div>
  );
}

const CELL_TYPE_DISPLAY_NAME = {
  Ref: "Reference",
  Wall: "Wall",
  SimplePlayer: "Basic Player",
  Box: "Basic Box",
  Floor: "Floor",
};

function PropSecTitle(props: PropsWithChildren<{}>) {
  return <div className="prop-editor-title">{props.children}</div>;
}

function PropRow(
  props: PropsWithChildren<{
    label: string;
  }>
) {
  let { label, children } = props;

  return (
    <Row className="property-row" align="middle" justify="center" gutter={8}>
      <Col span={12}>{`${label} :`}</Col>
      <Col span={12}>{children}</Col>
    </Row>
  );
}

function BoolProp(
  props: {
    label: string;
    value: boolean;
  } & SwitchProps
) {
  let { label, value, ...other } = props;
  return (
    <PropRow label={label}>
      <Switch checked={value} size="small" {...other} />
    </PropRow>
  );
}

function NumberProp(
  props: {
    label: string;
  } & InputNumberProps<number>
) {
  let { label, ...other } = props;
  return (
    <PropRow label={label}>
      <InputNumber size="small" precision={0} min={0} {...other} />
    </PropRow>
  );
}

function TextProp(
  props: {
    label: string;
  } & InputProps
) {
  let { label, ...other } = props;
  return (
    <PropRow label={label}>
      <Input size="small" {...other} />
    </PropRow>
  );
}

function BlockIdProp(
  props: {
    label: string;
  } & SelectProps<number>
) {
  let { label, ...other } = props;
  let blkOptions = useBlockIdOptions();

  return (
    <PropRow label={label}>
      <Select options={blkOptions} size="small" {...other} />
    </PropRow>
  );
}

function ColorProperty(props: {
  label?: string;
  value: HslColor;
  onChange?: (v: HslColor) => unknown;
}) {
  let { label = "Color", value, onChange = () => {} } = props;

  let colorOptions: (HslColor & string) | "customize" =
    typeof value === "string" ? value : "customize";

  let showPicker = colorOptions === "customize";

  let hslArr = toHslArr(value);
  let [h, s, l] = hslArr;

  return (
    <>
      <PropRow label={label}>
        <Select
          value={colorOptions}
          options={COLOR_OPTIONS}
          onChange={(newVal) => {
            if (newVal === "customize") {
              let clr = hslArr;
              onChange(clr);
            } else {
              onChange(newVal);
            }
          }}
          size="small"
          style={{ width: "100%" }}
        />
      </PropRow>
      {showPicker && (
        <>
          <div className="apply-flex-centers property-row">
            <Row gutter={[8, 8]} className="hsl-val-input">
              <HslFieldInput
                label="H"
                value={h}
                max={360}
                onChange={(val) => onChange([val, s, l])}
              />
              <HslFieldInput
                label="S"
                value={s}
                max={100}
                onChange={(val) => onChange([h, val, l])}
              />
              <HslFieldInput
                label="L"
                value={l}
                max={100}
                onChange={(val) => onChange([h, s, val])}
              />
            </Row>
            <HslColorPicker
              color={{ h, s, l }}
              onChange={(newVal) => {
                let { h, s, l } = newVal;
                onChange([h, s, l]);
              }}
            />
          </div>
        </>
      )}
    </>
  );
}

function HslFieldInput(props: {
  label: string;
  value?: number;
  max?: number;
  onChange?: (newVal: number) => unknown;
}) {
  let { label, value, max, onChange } = props;
  return (
    <>
      <Col span={6}>{label}</Col>
      <Col span={18}>
        <InputNumber
          size="small"
          className="hsl-field-input"
          value={value}
          onChange={onChange}
          controls={false}
          max={max}
          min={0}
          precision={0}
        />
      </Col>
    </>
  );
}

const COLOR_OPTIONS: {
  label: string;
  value: (HslColor & string) | "customize";
}[] = [
  {
    label: "Root",
    value: "root block",
  },
  {
    label: "Default 1",
    value: "block color 1",
  },
  {
    label: "Default 2",
    value: "block color 2",
  },
  {
    label: "Default 3",
    value: "block color 3",
  },
  {
    label: "Player",
    value: "player",
  },
  {
    label: "Box",
    value: "box",
  },
  {
    label: "Other",
    value: "customize",
  },
];

const FLOOR_TYPE_OPTIONS = [
  {
    label: "Box Target",
    value: "Button" as FloorType,
  },
  {
    label: "Player Target",
    value: "PlayerButton" as FloorType,
  },
];

function useBlockIdOptions() {
  let blkList = useBlockList();
  return useMemo(
    () =>
      blkList.map((blk) => ({
        label: `[ID ${blk.id}] ${blk.name}`,
        value: blk.id,
      })),
    [blkList]
  );
}
