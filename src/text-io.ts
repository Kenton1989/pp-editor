const fileInputElement = (() => {
  let cache: HTMLInputElement;
  return () => {
    if (cache === undefined)
      cache = document.getElementById("hidden-file-input") as HTMLInputElement;
    return cache;
  };
})();

const anchorElement = (() => {
  let cache: HTMLAnchorElement;
  return () => {
    if (cache === undefined)
      cache = document.getElementById("hidden-a") as HTMLAnchorElement;
    return cache;
  };
})();

export async function inputTxtFile(
  fileType: HTMLInputElement["accept"],
  maxSize: number = 1000
): Promise<[string, string]> {
  let el = fileInputElement();
  el.accept = fileType;

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
        resolve([text, file.name]);
      };
      reader.readAsText(file);
    };
    el.click();
  });
}

export function outputTxtFile(
  text: string,
  filename: string = "text.txt",
  fileType: string = "text/plain"
) {
  let a = anchorElement();
  let file = new Blob([text], { type: fileType });
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
}
