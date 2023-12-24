export interface Obj {
    _id: string;
    userId: string;
    url: string;
    scrapeParameters: string;
    scrapeIntervalMinute: number;
    text?: string;
    createdAt?: string;
    updatedAt?: string;
}
