// from ISelectorMetadata
interface SelectorMetadata {
  name: string;
  selectorValue: string;
  selectorId: any;
}

interface ScrapedSelector extends SelectorMetadata {
  content?: string;
  error?: string;
}

type ScrapedSelectorArray = ScrapedSelector[];

type ScrapedData = {
  url: string;
  timestamp: number;
  selectors: ScrapedSelectorArray;
};
