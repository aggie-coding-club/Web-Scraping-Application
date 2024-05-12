import { ScrapeConfigDataDownload } from "../models/scrapeConfig";

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
  data: ScrapeConfigDataDownload,
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

function convertToCSV(data: ScrapeConfigDataDownload) {
  let metadata = "";
  metadata += `name,${data.name}\n`;
  metadata += `description,${data.description}\n`;
  metadata += `url,${data.url}\n`;
  metadata += `scrape interval (min),${data.scrapeIntervalMinute}`;

  let selectorNames = "selector name:,";
  let selectorValues = "selector values:,";
  let selectorContentHeader = ",";
  let selectorContentArr = [","];

  let maxSelectorDataLength = 0;

  data.selectors.forEach((selector) => {
    selectorNames += selector.name + ",,,"; // skip a column
    selectorValues += selector.selectorValue += ",,,"; // skip a column
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
  console.log(selectorContent);

  let toReturn = `${metadata}\n\n${selectorNames}\n${selectorValues}\n\n${selectorContentHeader}\n${selectorContent}`;
  console.log(toReturn);
  return toReturn;
}
