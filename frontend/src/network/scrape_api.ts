import * as ObjsApi from "./objs_api";

type ScrapingConfigObject = { [key: string]: string };

export async function createScrapingConfig(userId: string, url: string, obj: ScrapingConfigObject): Promise<string> {
    const response = await ObjsApi.request("/scrape/createScrapingConfig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, url, obj })
    });

    if (!response._id) {
        throw new Error('Failed to create scraping configuration');
    }

    return response._id;
}

function processScrapingParameters(parameters: string): ScrapingConfigObject {
    return parameters
        .replace(/\n/g, "") // trim newline characters
        .replace(/,$/, '') // trim trailing comma
        .split(",") // get each key value pair
        .reduce((obj, param) => {
            const [key, value] = param.split(':').map(s => s.trim().slice(1, -1));
            if (!key || !value) {
                throw new Error("Invalid parameter format");
            }
            obj[key] = value;
            return obj;
        }, {} as ScrapingConfigObject);
}

export async function scrapeWebsite(url: string, scrape_parameters: string): Promise<any> {
    try {
        const parametersObj = processScrapingParameters(scrape_parameters);
        const user = await ObjsApi.getLoggedInUser();
        if (!user._id) {
            throw new Error('User not authenticated');
        }
        const configId = await createScrapingConfig(user._id, url, parametersObj);

        return ObjsApi.request("/scrape/scrape", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ configId })
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}
