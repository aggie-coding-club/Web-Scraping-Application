import * as ObjsApi from "./objs_api";

export async function updateConfig(userId: string, url: string, parameters: string[]): Promise<any> {
    const response = await ObjsApi.fetchData("/api/scrape/updateConfig", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            url,
            parameters: parameters,
        }),
    });

    return (await response.json())._id;
}

export async function scrapeWebsite(userId: string, url: string, parameters: string[] = ["owner-sub-count"]): Promise<any> {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    console.log(domain);

    if (domain === "www.youtube.com") {
        parameters = ["#text", "#owner-sub-count", "#videos-count", "#video-title"];
    } else if (domain === "www.imdb.com") {
        [
            "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.fSJiHR > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.dwkouE > div.sc-9aa2061f-0.cyMUeu > h1 > span",
            "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.fSJiHR > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.dwkouE > div.sc-9aa2061f-0.cyMUeu > ul > li:nth-child(1)",
            "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.fSJiHR > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.dwkouE > div.sc-9aa2061f-0.cyMUeu > ul > li:nth-child(2) > a",
            "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.fSJiHR > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.dwkouE > div.sc-9aa2061f-0.cyMUeu > ul > li:nth-child(4)",
            "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.fSJiHR > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.dwkouE > div.sc-3a4309f8-0.bjXIAP.sc-9aa2061f-1.foKegm > div > div:nth-child(1) > a > span > div > div.sc-bde20123-0.dLwiNw > div.sc-bde20123-2.cdQqzc > span.sc-bde20123-1.cMEQkK",
        ];
    } else if (domain === "www.animefillerlist.com") {
        parameters = [
            "div.Details.clearfix > div.Right > h1",
            "div.Details.clearfix > div.Right > div.Date",
            "#Condensed > div.filler > span.Episodes",
        ];
    } else if (domain === "www.spotify.com") {
        parameters = [
            "#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw > div.main-view-container > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > main > div.GlueDropTarget > section > div.contentSpacing.NXiYChVp4Oydfxd7rT5r.XPjEhsPyuOvMZ9NsDrxT > div.RP2rRchy4i8TIp1CTmb7 > span.rEN7ncpaUeSGL9z0NGQR > h1",
            "#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw > div.main-view-container > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > main > div.GlueDropTarget > section > div.contentSpacing.NXiYChVp4Oydfxd7rT5r.XPjEhsPyuOvMZ9NsDrxT > div.RP2rRchy4i8TIp1CTmb7 > div > div > span > a",
            "#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw > div.main-view-container > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > main > div.GlueDropTarget > section > div.contentSpacing.NXiYChVp4Oydfxd7rT5r.XPjEhsPyuOvMZ9NsDrxT > div.RP2rRchy4i8TIp1CTmb7 > div > span:nth-child(2)",
            "#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw > div.main-view-container > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > main > div.GlueDropTarget > section > div.contentSpacing.NXiYChVp4Oydfxd7rT5r.XPjEhsPyuOvMZ9NsDrxT > div.RP2rRchy4i8TIp1CTmb7 > div > span:nth-child(3)",
            "#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw > div.main-view-container > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > main > div.GlueDropTarget > section > div.contentSpacing.NXiYChVp4Oydfxd7rT5r.XPjEhsPyuOvMZ9NsDrxT > div.RP2rRchy4i8TIp1CTmb7 > span.Type__TypeElement-sc-goli3j-0.ieTwfQ.jpVuvMOCbpaRr_6FLf3W > div",
        ];
    } else if (domain === "www.etsy.com") {
        parameters = [
            "#listing-page-cart > div:nth-child(2) > div.wt-display-flex-xs.wt-align-items-center.wt-justify-content-space-between > div > p.wt-text-title-largest.wt-mr-xs-1.wt-text-slime",
            "#reviews > div.reviews__shop-info > div > div > h2",
            "#reviews > div.reviews__shop-info > div > div > span > span > span.wt-screen-reader-only",
        ];
    } else if (domain === "www.ebay.com") {
        parameters = [
            "#mainContent > div.vim.d-vi-region.x-atf-center-river--top > div.vim.x-item-title > h1 > span",
            "#mainContent > div.vim.d-vi-region.x-atf-center-river--top > div.vim.x-item-condition > div.x-item-condition-value > div > div > span > span:nth-child(1) > span",
        ];
    }
    const configId = await updateConfig(userId, url, parameters);

    const response = await ObjsApi.fetchData("/api/scrape/scrape", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            configId,
        }),
    });

    return response.json();
}
