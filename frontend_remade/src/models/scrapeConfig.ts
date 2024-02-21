interface Selector {
  id: string;
  name: string;
  value: string; // selector value
  description?: string;
}

export interface scrapeParameterInterface extends Selector {
  edit?: boolean;
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
