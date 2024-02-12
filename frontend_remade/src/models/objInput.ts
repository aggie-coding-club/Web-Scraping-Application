export interface ObjInput {
    name: string;
    description: string;
    url: string;
    scrapeParameters: string | any[];
    scrapeIntervalMinute: number;
    text?: string;
}
