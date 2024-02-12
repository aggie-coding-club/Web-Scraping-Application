import env from "./validateEnv";
import sgMail from "@sendgrid/mail";

export async function sendEmail(recipientEmail: string, scrapeConfigName: string, scrapedData: object) {
    sgMail.setApiKey(env.SENDGRID_API_KEY);
    const msg = {
        to: recipientEmail,
        from: "extractio.web.scraping@outlook.com",
        subject: `Update On Your Web Scraping Configuration ${scrapeConfigName}`,
        text: JSON.stringify(scrapedData, null, 2),
        html: `<pre>${JSON.stringify(scrapedData, null, 2)}</pre>`,
    };

    try {
        await sgMail.send(msg);
    } catch(error: any) {
        console.error(error);
    }
}
