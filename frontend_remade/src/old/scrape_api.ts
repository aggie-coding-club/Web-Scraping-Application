import * as ObjsApi from "./objs_api";

type ScrapingConfigObject = { [key: string]: string };

export async function createScrapingConfig(
  url: string,
  obj: ScrapingConfigObject
): Promise<string> {
  const response = await ObjsApi.request("/scrape/createScrapingConfig", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, parameters: obj }),
  });

  if (!response._id) {
    throw new Error("Failed to create scraping configuration");
  }

  return response._id;
}

function processScrapingParameters(parameters: string): ScrapingConfigObject {
  parameters = parameters.trim();
  parameters = parameters.endsWith(",") ? parameters.slice(-1) : parameters;

  return parameters.split(",").reduce((obj, param) => {
    const [rawKey, rawValue] = param.split(":").map((s) => s.trim());

    const key =
      rawKey.startsWith('"') && rawKey.endsWith('"')
        ? rawKey.slice(1, -1)
        : rawKey;
    const value =
      rawValue.startsWith('"') && rawValue.endsWith('"')
        ? rawValue.slice(1, -1)
        : rawValue;

    if (!key || !value) {
      throw new Error("Invalid parameter format");
    }

    obj[key] = value;
    return obj;
  }, {} as ScrapingConfigObject);
}

export async function scrapeWebsite(
  url: string,
  scrape_parameters: string
): Promise<any> {
  try {
    const parametersObj = processScrapingParameters(scrape_parameters);
    const configId = await createScrapingConfig(url, parametersObj);

    return ObjsApi.request("/scrape/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ configId }),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
