import {
  Col,
  Input,
  InputNumber,
  InputNumberProps,
  InputProps,
  Row,
  Select,
  SelectProps,
  Switch,
  SwitchProps,
  Tag,
} from "antd";
import Color from "color";
import { PropsWithChildren, useMemo } from "react";
import { HslColorPicker } from "react-colorful";
import { useBlockList } from "../../app/selector";
import { FloorType } from "../../game-level-file/v4/types";
import { HslColor, toHslArr } from "../../models/edit-level/color";

export function PropSecTitle(props: PropsWithChildren<{}>) {
  return <div className="prop-editor-title">{props.children}</div>;
}

export function PropRow(
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

export function BoolProp(
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

export function NumberProp(
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

export function TextProp(
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

export function SelectProp<ValueT extends number | string>(
  props: {
    label: string;
  } & SelectProps<ValueT>
) {
  let { label, ...other } = props;
  return (
    <PropRow label={label}>
      <Select size="small" {...other} />
    </PropRow>
  );
}

export function BlockIdProp(
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

export function ColorProperty(props: {
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
  let color = Color.hsl(h, s, l);

  return (
    <>
      <Row className="property-row" align="middle" justify="center" gutter={8}>
        <Col span={12}>
          <Tag
            color={color.string()}
            style={{
              color: color.isDark() ? "white" : "black",
            }}
          >
            {label}
          </Tag>
          {" :"}
        </Col>
        <Col span={12}>
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
        </Col>
      </Row>

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

export function HslFieldInput(props: {
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

export const CELL_TYPE_DISPLAY_NAME = {
  Ref: "Reference",
  Wall: "Wall",
  SimplePlayer: "Basic Player",
  Box: "Basic Box",
  Floor: "Floor",
};

export const FLOOR_TYPE_OPTIONS = [
  {
    label: "Box Target",
    value: "Button" as FloorType,
  },
  {
    label: "Player Target",
    value: "PlayerButton" as FloorType,
  },
];
