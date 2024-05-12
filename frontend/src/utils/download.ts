// import { DownloadOption } from "../models/Download";
export enum DownloadOptions {
  CSV = 1,
  JSON = 2,
}

/**
 * Downloads data to user's computer in option form
 *
 * @param data Any json object
 * @param option
 * @returns
 */
export function download(
  data: any,
  option: DownloadOptions,
  fileName?: string
) {
  let downloadType = { type: "application/json" };
  let extension = "json";
  let downloadData = JSON.stringify(data);

  if (!fileName) fileName = "data";

  if (option == DownloadOptions.CSV) {
    console.log("about to convert to csv");
    console.log(data);
    downloadData = convertToCSV(data);
    downloadType.type = "text/csv";
    extension = "csv";
  }

  if (!downloadData) {
    console.error("Error in downloading data");
    return;
  }

  const blob = new Blob([downloadData], downloadType);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.${extension}`;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function convertToCSV(data: any) {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((obj: any) => Object.values(obj).join(",")).join("\n");
  return `${headers}\n${rows}`;
}
