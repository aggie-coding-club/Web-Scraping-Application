import puppeteer from "puppeteer";

interface SelectorsMap {
  [key: string]: string[];
}

const selectorsMap: SelectorsMap = {
  amazon: [
    ".a-offscreen",
    "#acrCustomerReviewText",
    ".a-size-base .a-size-medium.a-color-base",
  ],
  imdb: [
    "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.fSJiHR > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.dwkouE > div.sc-9aa2061f-0.cyMUeu > h1 > span",
    "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.fSJiHR > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.dwkouE > div.sc-9aa2061f-0.cyMUeu > ul > li:nth-child(1)",
    "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.fSJiHR > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.dwkouE > div.sc-9aa2061f-0.cyMUeu > ul > li:nth-child(2) > a",
    "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.fSJiHR > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.dwkouE > div.sc-9aa2061f-0.cyMUeu > ul > li:nth-child(4)",
    "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.fSJiHR > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.dwkouE > div.sc-3a4309f8-0.bjXIAP.sc-9aa2061f-1.foKegm > div > div:nth-child(1) > a > span > div > div.sc-bde20123-0.dLwiNw > div.sc-bde20123-2.cdQqzc > span.sc-bde20123-1.cMEQkK",
  ],
  animefillerlist: [
    "div.Details.clearfix > div.Right > h1",
    "div.Details.clearfix > div.Right > div.Date",
    "#Condensed > div.filler > span.Episodes",
  ],
  youtube: ["#text", "#owner-sub-count", "#video-title"],
  spotify: [
    "#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw > div.main-view-container > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > main > div.GlueDropTarget > section > div.contentSpacing.NXiYChVp4Oydfxd7rT5r.XPjEhsPyuOvMZ9NsDrxT > div.RP2rRchy4i8TIp1CTmb7 > span.rEN7ncpaUeSGL9z0NGQR > h1",
    "#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw > div.main-view-container > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > main > div.GlueDropTarget > section > div.contentSpacing.NXiYChVp4Oydfxd7rT5r.XPjEhsPyuOvMZ9NsDrxT > div.RP2rRchy4i8TIp1CTmb7 > div > div > span > a",
    "#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw > div.main-view-container > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > main > div.GlueDropTarget > section > div.contentSpacing.NXiYChVp4Oydfxd7rT5r.XPjEhsPyuOvMZ9NsDrxT > div.RP2rRchy4i8TIp1CTmb7 > div > span:nth-child(2)",
    "#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw > div.main-view-container > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > main > div.GlueDropTarget > section > div.contentSpacing.NXiYChVp4Oydfxd7rT5r.XPjEhsPyuOvMZ9NsDrxT > div.RP2rRchy4i8TIp1CTmb7 > div > span:nth-child(3)",
    "#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw > div.main-view-container > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > main > div.GlueDropTarget > section > div.contentSpacing.NXiYChVp4Oydfxd7rT5r.XPjEhsPyuOvMZ9NsDrxT > div.RP2rRchy4i8TIp1CTmb7 > span.Type__TypeElement-sc-goli3j-0.ieTwfQ.jpVuvMOCbpaRr_6FLf3W > div",
  ],
  etsy: [
    "#listing-page-cart > div:nth-child(2) > div.wt-display-flex-xs.wt-align-items-center.wt-justify-content-space-between > div > p.wt-text-title-largest.wt-mr-xs-1.wt-text-slime",
    "#reviews > div.reviews__shop-info > div > div > h2",
    "#reviews > div.reviews__shop-info > div > div > span > span > span.wt-screen-reader-only",
  ],
  ebay: [
    "#mainContent > div.vim.d-vi-region.x-atf-center-river--top > div.vim.x-item-title > h1 > span",
    "#mainContent > div.vim.d-vi-region.x-atf-center-river--top > div.vim.x-item-condition > div.x-item-condition-value > div > div > span > span:nth-child(1) > span",
  ],
  // Add for other websites
};

export const scrapeWebsite = async (url: string, parameters: string[]) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  const websiteName = Object.keys(selectorsMap).find((key) =>
    url.includes(key)
  );
  const selectors = websiteName ? selectorsMap[websiteName] : parameters;

  if (selectors.length === 0) {
    await browser.close();
    return [];
  }

  // await page.waitForTimeout(2000); // Adjust as necessary

  await Promise.all(selectors.map(selector => page.waitForSelector(selector)));

  // for (let i = 0; i < selectors.length; i++) {
  //   await page.waitForSelector(selectors[i]);
  // }

  const scrapedData = await page.evaluate((selectors: string[]) => {
    const results: string[] = [];
    selectors.forEach((selector) => {
      const content = document.querySelector(selector)?.textContent || "";
      results.push(content.trim());
    });
    return results;
  }, selectors);

  await browser.close();
  return scrapedData;
};
