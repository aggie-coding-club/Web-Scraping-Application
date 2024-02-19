interface Selector {
  key: number;
  name: string;
  tag: string;
}

export interface ScrapeConfigInput {
  name: string;
  description: string;
  url: string;
  scrapeParameters: Selector[];
  scrapeIntervalMinute: number;
  emailNotification: string;
}

export interface ScrapeConfig extends ScrapeConfigInput {
  _id: string;
  createdAt: string;
  updatedAt: string;
  lastChanged?: string;
}
