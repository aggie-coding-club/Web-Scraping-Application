import * as ObjsApi from "./objs_api";

export async function updateConfig(userId: string, url: string, parameters: string[]): Promise<any> {
    const response = await ObjsApi.request("/scrape/updateConfig", {
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

    return response._id;
}

export async function scrapeWebsite(url: string, scrape_parameters: string): Promise<any> {    
    const newLineRemoved = scrape_parameters.replace(/\n/g, "");
    const endCommaRemoved = newLineRemoved.replace(/,$/, '');
    const parameter_list = endCommaRemoved.split(",");

    const user = await ObjsApi.getLoggedInUser();
    const configId = await updateConfig(user._id, url, parameter_list);

    return ObjsApi.request("/scrape/scrape", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            configId,
        }),
    });
}
