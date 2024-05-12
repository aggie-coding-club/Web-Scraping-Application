import {
  ScrapeConfigDataDownload,
  SelectorDataDownload,
} from "../models/scrapeConfig";

// import { DownloadOption } from "../models/Download";
export enum DownloadOptions {
  CSV = "CSV",
  JSON = "JSON",
}

/**
 * Downloads data to user's computer in option form
 */
export function download(
  downloadData: string,
  option: DownloadOptions,
  fileName?: string
) {
  let downloadType = { type: "" };
  let extension = "";

  if (!fileName) fileName = "data";

  switch (option) {
    case DownloadOptions.CSV:
      downloadType.type = "text/csv";
      extension = "csv";
      break;
    case DownloadOptions.JSON:
      downloadType = { type: "application/json" };
      extension = "json";
      break;
    default:
      console.error("Not valid download option");
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

export function convertSelectorDataDownloadToCSV(data: SelectorDataDownload) {
  let metadata = "";
  metadata += `name,${data.name}\n`;
  metadata += `selector value,${data.selectorValue}\n`;
  metadata += `date downloaded,${new Date()}`;

  let dataHeader = "timestamp,content";
  let rows = "";

  data.data.forEach((dat) => {
    rows += `${dat.timestamp},${dat.content}\n`;
  });

  return `${metadata}\n\n${dataHeader}\n${rows}`;
}

export function convertScrapeConfigDataDownloadToCSV(
  data: ScrapeConfigDataDownload
) {
  let metadata = "";
  metadata += `name,${data.name}\n`;
  metadata += `description,${data.description}\n`;
  metadata += `url,${data.url}\n`;
  metadata += `scrape interval (min),${data.scrapeIntervalMinute}\n`;
  metadata += `date downloaded,${new Date()}`;

  let selectorNames = "selector name:,";
  let selectorValues = "selector values:,";
  let selectorContentHeader = ",";
  let selectorContentArr = [","];

  let maxSelectorDataLength = 0;

  data.selectors.forEach((selector) => {
    selectorNames += selector.name + ",,,"; // skip 2 columns
    selectorValues += selector.selectorValue += ",,,"; // skip 2 columns
    selectorContentHeader += "timestamp,content,,";

    maxSelectorDataLength = Math.max(
      maxSelectorDataLength,
      selector.data.length
    );
  });

  selectorContentHeader = selectorContentHeader.slice(0, -1);

  for (let i = 0; i < maxSelectorDataLength; i++) {
    data.selectors.forEach((selector) => {
      if (i >= selector.data.length) return;
      selectorContentArr.push(
        `${selector.data[i].timestamp},${selector.data[i].content},,`
      );
    });
    selectorContentArr.push("\n,");
  }

  const selectorContent = selectorContentArr.join("");

  return `${metadata}\n\n${selectorNames}\n${selectorValues}\n\n${selectorContentHeader}\n${selectorContent}`;
}
