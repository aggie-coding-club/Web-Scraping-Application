interface Selector {
  key: number;
  name: string;
  tag: string;
}

export interface ScrapeConfig {
  _id: string;
  name: string;
  description: string;
  url: string;
  scrapeParameters: Selector[];
  scrapeIntervalMinute: number;
  emailNotification: string;
}
