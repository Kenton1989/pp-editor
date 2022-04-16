import { useAppDispatch, useAppSelector } from "../app/hook";
import { LEVEL } from "../models/edit-level";
import "./property-editor.css";

export default function PropertyEditor(props: {}) {
  let cnt = useAppSelector((state) => state.level.counter);
  let blocks = useAppSelector((state) => state.level.blocks);
  let dispatch = useAppDispatch();

  return (
    <div className="property-editor">
      <p>Counter: {cnt}</p>
      <button
        onClick={() => {
          dispatch(LEVEL.createBlk());
        }}
      >
        Add 1
      </button>
      {blocks.map((val) => (
        <p key={val.id}>{val.name}</p>
      ))}
    </div>
  );
}
