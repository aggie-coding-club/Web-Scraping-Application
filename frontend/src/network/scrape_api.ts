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

export async function scrapeWebsite(url: string, parameters: string[] = ["owner-sub-count"]): Promise<any> {
    const user = await ObjsApi.getLoggedInUser();
    const userId = user._id;
    console.log("Hey");
    console.log(url);
    console.log("Hey");
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;

    if (domain === "www.youtube.com") {
        parameters = ["#text", "#owner-sub-count", "#videos-count", "#video-title"];
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
