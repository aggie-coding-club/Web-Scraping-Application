interface SelectorBase {
  name: string;
  selectorValue: string;
}

export interface SelectorInput extends SelectorBase {
  selectorId?: string;
}

export interface Data {
  timestamp: Date;
  content: string;
}

export interface SelectorData extends SelectorBase {
  data: Data[];
}

export interface SelectorTable extends SelectorBase {
  edit?: boolean;
  key: string;
}

export interface SelectorDataDownload extends SelectorBase {
  data: Data[] | [];
  dateDownloaded?: Date;
}

export interface ScrapeConfigBase {
  name: string;
  description: string;
  url: string;
  scrapeIntervalMinute: number;
}

export interface ScrapeConfigInput extends ScrapeConfigBase {
  emailNotification: string;
  selectorsMetadata: SelectorInput[];
}

export interface ScrapeConfig extends ScrapeConfigInput {
  _id: string;
  createdAt: string;
  updatedAt: string;
  lastSuccessfulScrape: Date;
  lastChanged?: string;
  status: string;
}

export interface ScrapeConfigDataDownload extends ScrapeConfigBase {
  dateDownloaded: Date;
  selectors: SelectorDataDownload[];
}

export enum statusStates {
  success = "success",
  pending = "pending",
  failed = "failed",
}
