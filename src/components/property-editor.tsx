import { useAppDispatch, useAppSelector } from "../app/hook";
import { LEVEL } from "../models/edit-level";
import { ActionCreators } from "redux-undo";
import "./property-editor.css";
import {
  Col,
  Divider,
  Empty,
  Input,
  InputNumber,
  Row,
  Space,
  Switch,
  Typography,
} from "antd";
import { useCurrentBlk } from "../app/selector";
import { PropsWithChildren, useState } from "react";
import { BlockEdit } from "../models/edit-level/slice";
import { BlockState } from "../models/edit-level/state";

export default function PropertyEditor(props: {}) {
  let blk = useCurrentBlk();
  return (
    <div className="property-editor">
      {blk ? <BlockProps blk={blk} /> : <Empty />}
    </div>
  );
}

function BlockProps(props: { blk: BlockState }) {
  let { blk } = props;

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

  return (
    <div className="block-property">
      <Divider>Block Properties</Divider>
      <PropRow label="ID">{blk.id}</PropRow>
      <PropRow label="Name">
        <Input
          value={blk.name}
          onChange={(e) => editBlk({ name: e.target.value })}
        />
      </PropRow>
      <PropRow label="Width">
        <InputNumber
          precision={0}
          min={1}
          max={30}
          value={blk.width}
          onChange={(v) => resize({ w: v })}
        />
      </PropRow>
      <PropRow label="Height">
        <InputNumber
          precision={0}
          min={1}
          max={30}
          value={blk.height}
          onChange={(v) => resize({ h: v })}
        />
      </PropRow>
      <PropRow label="Ensure Square Size">
        <Switch checked={ensureSquare} onChange={(v) => setEnsureSquare(v)} />
      </PropRow>
      <PropRow label="Fill with Walls">
        <Switch
          checked={blk.fillWithWalls}
          onChange={(val) => {
            editBlk({ fillWithWalls: val });
          }}
        />
      </PropRow>
      <PropRow label="Zoom Factor">
        <InputNumber
          value={blk.zoomFactor}
          onChange={(val) => editBlk({ zoomFactor: val })}
          step={0.1}
        />
      </PropRow>
      <PropRow label="Float in Space">
        <Switch
          checked={blk.floatInSpace}
          onChange={(val) => {
            editBlk({ floatInSpace: val });
          }}
        />
      </PropRow>
      <PropRow label="Special Effect">
        <InputNumber
          precision={0}
          min={0}
          value={blk.specialEffect}
          onChange={(v) => editBlk({ specialEffect: v })}
        />
      </PropRow>
    </div>
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
      <Col span={12}>{label}:</Col>
      <Col span={12}>{children}</Col>
    </Row>
  );
}
