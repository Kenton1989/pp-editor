import { SettingOutlined } from "@ant-design/icons";
import { Button, Input, Popover, Radio, Space } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hook";
import { useHeader } from "../../app/selector";
import {
  APPENDIX_PRIORITY_ATTEMPT_ORDER,
  DEFAULT_ATTEMPT_ORDER,
  MUSICS,
} from "../../game-level-file/v4/const";
import {
  AttemptOrder,
  DrawStyle,
  isAttemptOrder,
} from "../../game-level-file/v4/types";
import { LEVEL } from "../../models/edit-level";
import { HeaderEdit } from "../../models/edit-level/slice";
import { BoolProp, NumberProp, PropRow, SelectProp, TextProp } from "./common";
import "./header-editor.css";

export function HeaderEditorEntry(props: {}) {
  return (
    <Popover content={<HeaderEditor />} placement="bottomLeft" trigger="click">
      <Button id="header-editor-entry">
        Level Settings <SettingOutlined />
      </Button>
    </Popover>
  );
}

export function HeaderEditor(props: {}) {
  const header = useHeader();
  const dispatch = useAppDispatch();
  const editHeader = (edit: HeaderEdit) => dispatch(LEVEL.updateHeader(edit));

  return (
    <div id="header-editor">
      <TextProp
        label="Level Name"
        value={header.title}
        onChange={(txt) => editHeader({ title: txt.target.value })}
      />
      <BoolProp
        label="Extrude"
        value={header.shed}
        onChange={(val) => editHeader({ shed: val })}
      />
      <BoolProp
        label="Inner Push"
        value={header.innerPush}
        onChange={(val) => editHeader({ innerPush: val })}
      />
      <AttemptOrderProp
        value={header.attemptOrder}
        onChange={(val) => editHeader({ attemptOrder: val })}
      />
      <SelectProp
        label="Draw Style"
        options={DRAW_STYLE_OPTIONS}
        value={header.drawStyle}
        onChange={(val) => editHeader({ drawStyle: val })}
      />
      <SelectProp
        label="Background Music"
        options={MUSIC_OPTIONS}
        value={header.customLevelMusic}
        onChange={(val) => editHeader({ customLevelMusic: val })}
      />
      <NumberProp
        label="Level Palette"
        value={header.customLevelPalette}
        onChange={(val) => editHeader({ customLevelPalette: val })}
      />
    </div>
  );
}

function AttemptOrderProp(props: {
  label?: string;
  value: AttemptOrder;
  onChange: (val: AttemptOrder) => unknown;
}) {
  let { label = "Attempt Order", value, onChange } = props;

  const valueInTxt = value.join(",");

  const [inputTxt, setInputTxt] = useState(valueInTxt);
  const inputValid = inputTxt === valueInTxt;

  useEffect(() => {
    setInputTxt(value.join(","));
  }, [value]);

  const updateTxt = (newTxt: string) => {
    setInputTxt(newTxt);

    if (newTxt === valueInTxt) {
      return;
    }

    const order = parseAttemptOrder(newTxt);
    const valid = order !== undefined;
    if (valid) {
      onChange(order);
    }
  };

  return (
    <PropRow label={label}>
      <Radio.Group value={inputTxt} onChange={(e) => updateTxt(e.target.value)}>
        <Space direction="vertical">
          {ATTEMPT_ORDER_OPTIONS.map((v) => (
            <Radio value={v.value} key={v.value}>
              {v.label}
            </Radio>
          ))}
          <Input
            status={inputValid ? undefined : "error"}
            value={inputTxt}
            onBlur={() => {
              if (inputTxt !== valueInTxt) {
                setInputTxt(valueInTxt);
              }
            }}
            onChange={(e) => updateTxt(e.target.value)}
            size="small"
          />
        </Space>
      </Radio.Group>
    </PropRow>
  );
}

function parseAttemptOrder(s: string): AttemptOrder | undefined {
  let list = s.split(",", 4).map((s) => s.trim());
  if (isAttemptOrder(list)) {
    return list as AttemptOrder;
  }
  return undefined;
}

const ATTEMPT_ORDER_OPTIONS = [
  {
    label: "Default",
    value: DEFAULT_ATTEMPT_ORDER.join(","),
  },
  {
    label: "Appendix: Priority",
    value: APPENDIX_PRIORITY_ATTEMPT_ORDER.join(","),
  },
];

const MUSIC_OPTIONS = [
  {
    label: "No Music",
    value: -1,
  },
  ...MUSICS.map((m) => ({
    label: m.name,
    value: m.id,
  })),
];

const DRAW_STYLE_OPTIONS: { label: string; value: DrawStyle }[] = [
  { label: "Default", value: "" },
  { label: "Text UI", value: "tui" },
  { label: "Grid", value: "grid" },
  { label: "Old Style", value: "oldstyle" },
];
