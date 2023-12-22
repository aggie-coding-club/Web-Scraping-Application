import * as ObjsApi from "./objs_api";

export async function createScrapingConfig(userId: string, url: string, obj: { [key: string]: string }): Promise<any> {
    const response = await ObjsApi.request("/scrape/createScrapingConfig", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            url,
            obj: obj,
        }),
    });

    return response._id;
}

export async function scrapeWebsite(url: string, scrape_parameters: string): Promise<any> {    
    const newLineRemoved = scrape_parameters.replace(/\n/g, "");
    const endCommaRemoved = newLineRemoved.replace(/,$/, '');
    const parameter_list = endCommaRemoved.split(",");

    const obj: { [key: string]: string } = {};
    parameter_list.forEach((parameter) => {
        const key_value_pair = parameter.split(':').map(s => s.trim().slice(1, -1));
        if (key_value_pair.length !== 2) {
            throw new Error("Invalid parameter format");
        }

        const [key, value] = key_value_pair;
        obj[key] = value;
    });

    const user = await ObjsApi.getLoggedInUser();
    const configId = await createScrapingConfig(user._id, url, obj);

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
