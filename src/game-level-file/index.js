import v4 from "./v4"

const MAX_LEVEL_FILE_SIZE = 1 << 20;

export async function inputLevelFile() {
  let content = await inputTxtFile(MAX_LEVEL_FILE_SIZE);
  let level = parseLevel(content);
  return level;
}

function parseLevel(txtData = "") {
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

async function inputTxtFile(maxSize = 1000) {
  let el = document.createElement("input");
  el.type = "file";
  el.accept = "text/plain";

  return new Promise((resolve, reject) => {
    el.onchange = (e) => {
      e.preventDefault();
      let file = e.target.files[0];
      if (file.size > maxSize) {
        reject(new Error("file size too large"));
        return;
      }

      let reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        resolve(text);
      };
      reader.readAsText(file);
    };
    console.log("input");
    el.click();
  });
}

export async function outputLevelFile(levelObj, filename = "level.txt") {
  let encoded = v4.encodeLevel(levelObj);
  outputTxtFile(encoded, filename);
}

function outputTxtFile(text, filename = "text.txt") {
  console.log("saving to:", filename)
  let a = document.createElement("a");
  let file = new Blob([text], { type: "text/plain" });
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
}


