import { inputTxtFile, outputTxtFile } from "../text-io";
import v4 from "./v4";
import { LevelRoot } from "./v4/types";

const MAX_LEVEL_FILE_SIZE = 1 << 20;

export async function inputLevelFile(): Promise<[LevelRoot, string]> {
  let [content, filename] = await inputTxtFile(
    "text/plain",
    MAX_LEVEL_FILE_SIZE
  );
  let level = parseLevel(content);
  let levelName = filename.slice(0, filename.lastIndexOf("."));
  return [level, levelName];
}

function parseLevel(txtData: string): LevelRoot {
  let versionLine = txtData.slice(0, txtData.indexOf("\n"));
  let [versionKey, version] = versionLine.trim().split(" ");

  if (versionKey !== "version") {
    throw new Error("failed to find version info");
  }

  if (version === "4") {
    return v4.parseLevel(txtData);
  } else {
    throw new Error(`unknown version of level data: "${version}"`);
  }
}

export async function outputLevelFile(
  levelObj: LevelRoot,
  filename: string = "level.txt"
) {
  let encoded = v4.encodeLevel(levelObj);
  outputTxtFile(encoded, filename);
}
