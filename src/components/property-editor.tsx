import { useAppDispatch } from "../app/hook";
import { LEVEL } from "../models/edit-level";
import "./property-editor.css";
import {
  Col,
  Divider,
  Empty,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
} from "antd";
import { useCurrentBlk } from "../app/selector";
import { PropsWithChildren, useState } from "react";
import { BlockEdit } from "../models/edit-level/slice";
import { BlockState } from "../models/edit-level/state";
import { HslColor, toHslArr } from "../models/edit-level/color";
import { SliderPicker } from "react-color";

export default function PropertyEditor(props: {}) {
  let blk = useCurrentBlk();
  return (
    <div className="property-editor">
      <div className="block-property">
        <Divider>Block Properties</Divider>
        {blk ? <BlockProps blk={blk} /> : <Empty />}
      </div>
    </div>
  );
}

function BlockProps(props: { blk: BlockState }) {
  let { blk } = props;

  let dispatch = useAppDispatch();
  let editBlk = (edit: Omit<BlockEdit, "id">) =>
    dispatch(LEVEL.updateBlk({ id: blk.id, ...edit }));

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
    dispatch(LEVEL.resizeBlk({ id: blk.id, w, h }));
  };

  return (
    <>
      <PropRow label="ID">{blk.id}</PropRow>
      <PropRow label="Name">
        <Input
          value={blk.name}
          onChange={(e) => editBlk({ name: e.target.value })}
          size="small"
        />
      </PropRow>
      <PropRow label="Width">
        <InputNumber
          precision={0}
          min={1}
          max={30}
          value={blk.width}
          onChange={(v) => resize({ w: v })}
          size="small"
        />
      </PropRow>
      <PropRow label="Height">
        <InputNumber
          precision={0}
          min={1}
          max={30}
          value={blk.height}
          onChange={(v) => resize({ h: v })}
          size="small"
        />
      </PropRow>
      <PropRow label="Ensure Square Size">
        <Switch
          checked={ensureSquare}
          onChange={(v) => setEnsureSquare(v)}
          size="small"
        />
      </PropRow>
      <PropRow label="Fill with Walls">
        <Switch
          checked={blk.fillWithWalls}
          onChange={(val) => {
            editBlk({ fillWithWalls: val });
          }}
          size="small"
        />
      </PropRow>
      <ColorProperty
        value={blk.hsl}
        onChange={(val) => {
          editBlk({ hsl: val });
        }}
      />
      <PropRow label="Zoom Factor">
        <InputNumber
          value={blk.zoomFactor}
          onChange={(val) => editBlk({ zoomFactor: val })}
          min={0.01}
          step={0.1}
          size="small"
        />
      </PropRow>
      <PropRow label="Float in Space">
        <Switch
          checked={blk.floatInSpace}
          onChange={(val) => {
            editBlk({ floatInSpace: val });
          }}
          size="small"
        />
      </PropRow>
      <PropRow label="Special Effect">
        <InputNumber
          precision={0}
          min={0}
          value={blk.specialEffect}
          onChange={(v) => editBlk({ specialEffect: v })}
          size="small"
        />
      </PropRow>
    </>
  );
}

function PropRow(
  props: PropsWithChildren<{
    label: string;
  }>
) {
  let { label, children } = props;

  return (
    <Row className="property-row" align="middle" justify="center" gutter={8}>
      <Col span={12}>
        {label}
        {" :"}
      </Col>
      <Col span={12}>{children}</Col>
    </Row>
  );
}

function ColorProperty(props: {
  value: HslColor;
  onChange?: (v: HslColor) => unknown;
}) {
  let { value, onChange = () => {} } = props;

  let colorOptions: (HslColor & string) | "customize" =
    typeof value === "string" ? value : "customize";

  let showPicker = colorOptions === "customize";

  let hslArr = toHslArr(value);
  let [h, s, l] = hslArr;

  return (
    <>
      <PropRow label="Color">
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
        <Row className="property-row" align="middle" justify="center">
          <Col span={24}>
            <SliderPicker
              color={{ h, s, l }}
              onChangeComplete={(newVal) => {
                let { h, s, l } = newVal.hsl;
                onChange([h, s * 100, l * 100]);
              }}
            />
          </Col>
        </Row>
      )}
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
