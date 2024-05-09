export interface SelectorInput {
  name: string;
  selectorValue: string; // selector value
  selectorId?: string;
}

export interface Data {
  timestamp: Date;
  content: string;
}

export interface SelectorData extends SelectorInput {
  data: Data[];
}

export interface SelectorTable extends SelectorInput {
  edit?: boolean;
  key: string;
}

export interface ScrapeConfigInput {
  name: string;
  description: string;
  url: string;
  scrapeIntervalMinute: number;
  emailNotification: string;
  selectorsMetadata: SelectorInput[];
}

export interface ScrapeConfig extends ScrapeConfigInput {
  _id: string;
  createdAt: string;
  updatedAt: string;
  lastChanged?: string;
  status: string;
}
