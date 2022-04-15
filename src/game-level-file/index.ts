import v4 from "./v4";
import { LevelRoot } from "./v4/types";

const MAX_LEVEL_FILE_SIZE = 1 << 20;

export async function inputLevelFile(): Promise<LevelRoot> {
  let content = await inputTxtFile(MAX_LEVEL_FILE_SIZE);
  let level = parseLevel(content);
  return level;
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

async function inputTxtFile(maxSize: number = 1000): Promise<string> {
  let el = document.createElement("input");
  el.type = "file";
  el.accept = "text/plain";

  return new Promise((resolve, reject) => {
    el.onchange = (e) => {
      e.preventDefault();

      let inputEle = e.target as HTMLInputElement;

      if (!inputEle.files || inputEle.files.length === 0) return;
      let file = (inputEle.files as FileList)[0];

      if (file.size > maxSize) {
        reject(new Error("file size too large"));
        return;
      }

      let reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        resolve(text);
      };
      reader.readAsText(file);
    };
    el.click();
  });
}

export async function outputLevelFile(
  levelObj: LevelRoot,
  filename: string = "level.txt"
) {
  let encoded = v4.encodeLevel(levelObj);
  outputTxtFile(encoded, filename);
}

function outputTxtFile(text: string, filename: string = "text.txt") {
  let a = document.createElement("a");
  let file = new Blob([text], { type: "text/plain" });
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
}
