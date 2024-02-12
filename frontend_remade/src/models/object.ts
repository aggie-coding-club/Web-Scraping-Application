export interface Obj {
    _id: string;
    name: string;
    description: string;
    userId: string;
    url: string;
    scrapeParameters: any[];
    scrapeIntervalMinute: number;
    text?: string;
    createdAt?: string;
    updatedAt?: string;
}
