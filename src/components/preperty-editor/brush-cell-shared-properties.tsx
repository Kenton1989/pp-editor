import { Radio } from "antd";
import { FloorType } from "../../game-level-file/v4/types";
import { HslColor } from "../../models/edit-level/color";
import { CellEdit } from "../../models/edit-level/slice";
import { BrushEdit } from "../../models/edit-ui/slice";
import {
  BlockIdProp,
  BoolProp,
  ColorProperty,
  FLOOR_TYPE_OPTIONS,
  NumberProp,
  PropRow,
} from "./common";

export default function BrushCellSharedProps(props: {
  data: {
    hsl?: HslColor;
    id?: number;
    exitBlock?: boolean;
    infExit?: boolean;
    infExitNum?: number;
    infEnter?: boolean;
    infEnterNum?: number;
    infEnterId?: number;
    player?: boolean;
    possessable?: boolean;
    playerOrder?: number;
    flipH?: boolean;
    floatInSpace?: boolean;
    specialEffect?: number;
    floorType?: FloorType;
  };
  updater: (arg: BrushEdit) => unknown | ((arg: CellEdit) => unknown);
}) {
  let { data, updater } = props;

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

  if (data.hsl) {
    hslProp = (
      <ColorProperty value={data.hsl} onChange={(v) => updater({ hsl: v })} />
    );
  }

  if (data.floorType) {
    floorTypeProps = (
      <PropRow label="Floor Type">
        <Radio.Group
          value={data.floorType}
          onChange={(v) => updater({ floorType: v.target.value })}
          options={FLOOR_TYPE_OPTIONS}
        />
      </PropRow>
    );
  }

  if (data.player !== undefined) {
    isPlayerProp = (
      <BoolProp
        label="Is Player"
        value={data.player}
        onChange={(v) => updater({ player: v, possessable: v })}
      />
    );
    playerOrderProp = data.player ? (
      <NumberProp
        label="Player Order"
        value={data.playerOrder!}
        onChange={(v) => updater({ playerOrder: v })}
      />
    ) : undefined;
    possessableProp = (
      <BoolProp
        label="Possessable"
        value={data.possessable!}
        onChange={(v) => updater({ possessable: v })}
      />
    );
  }

  if (data.id !== undefined) {
    idProp = (
      <BlockIdProp
        label="Referring"
        value={data.id}
        onChange={(v) => {
          updater({ id: v });
        }}
      />
    );
    exitProp = (
      <BoolProp
        label="Is Clone"
        value={!data.exitBlock}
        onChange={(v) => updater({ exitBlock: !v })}
      />
    );
    infProp = (
      <BoolProp
        label="Is ∞"
        value={Boolean(data.infExit)}
        onChange={(v) => updater({ infExit: v })}
      />
    );
    infNumProp = data.infExit ? (
      <NumberProp
        label="∞ Level"
        value={data.infExitNum}
        onChange={(v) => updater({ infExitNum: v })}
      />
    ) : undefined;
    epsProp = (
      <BoolProp
        label="Is ε"
        value={Boolean(data.infEnter)}
        onChange={(v) => updater({ infEnter: v })}
      />
    );
    epsNumProp = data.infEnter ? (
      <NumberProp
        label="ε Level"
        value={data.infEnterNum}
        onChange={(v) => updater({ infEnterNum: v })}
      />
    ) : undefined;
    epsFromProp = data.infEnter ? (
      <BlockIdProp
        label="ε Enter From"
        value={data.infEnterId}
        onChange={(v) => updater({ infEnterId: v })}
      />
    ) : undefined;
    flipHProp = (
      <BoolProp
        label="Horizontal Flip"
        value={Boolean(data.flipH)}
        onChange={(v) => updater({ flipH: v })}
      />
    );
    floatInSpaceProp = (
      <BoolProp
        label="Float in Space"
        value={Boolean(data.floatInSpace)}
        onChange={(v) => updater({ floatInSpace: v })}
      />
    );
    specialEffectProp = (
      <NumberProp
        label="Special Effect"
        value={data.specialEffect}
        onChange={(v) => updater({ specialEffect: v })}
      />
    );
  }

  return (
    <>
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
    </>
  );
}
