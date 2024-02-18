type Selector = {
    id: string;
    name: string;
    value: string;
    description: string;
};

type SelectorArray = Selector[];

interface ScrapedSelector extends Selector {
    content?: string;
    error?: string;
}

type ScrapedSelectorArray = ScrapedSelector[];

type ScrapedData = {
    url: string;
    timestamp: number;
    selectors: ScrapedSelectorArray;
};
