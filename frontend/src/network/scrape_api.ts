import * as ObjsApi from "./objs_api";

export async function updateConfig(userId: string, url: string, parameter: string): Promise<any> {
    const response = await ObjsApi.fetchData("/api/scrape/updateConfig", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            url,
            parameters: [parameter],
        }),
    });

    return (await response.json())._id;
}

export async function scrapeWebsite(userId: string, url: string, parameter: string = "owner-sub-count"): Promise<any> {
    const configId = await updateConfig(userId, url, parameter);

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
