import express from "express";
import https from "https";
import * as scrapingController from "../controllers/scraping";

const router = express.Router();

router.get("/getScrapingConfigs", scrapingController.getScrapingConfigs);

router.post("/fetchHtml", (req, res) => {
  const { url } = req.body;

  https
    .get(url, (response) => {
      let data = "";

      // chunk
      response.on("data", (chunk) => {
        data += chunk;
      });

      // whole response
      response.on("end", () => {
        const script = `
        <script>
            document.body.addEventListener('mouseover', function(event) {
                event.target.style.outline = '2px solid blue';
                event.stopPropagation();
            }, true);
    
            document.body.addEventListener('mouseout', function(event) {
                event.target.style.outline = '';
                event.stopPropagation();
            }, true);
    
            document.body.addEventListener('click', function(event) {
                const selector = getCssSelector(event.target);
                window.parent.postMessage({ selector }, '*');
                event.preventDefault();
                event.stopPropagation();
            }, true);
    
            function getCssSelector(el) {
                var path = [];
                while (el.nodeType === Node.ELEMENT_NODE) {
                    var selector = el.nodeName.toLowerCase();
                    if (el.id) {
                        selector += '#' + el.id;
                        path.unshift(selector);
                        break;
                    }
                    
                    el = el.parentNode;
                }
                return path.join(' > ');
            }
        </script>
    `;

        const modifiedHtml = data + script;
        res.send(modifiedHtml);
      });
    })
    .on("error", (err) => {
      res.status(500).send(`Error fetching HTML content: ${err.message}`);
    });
});

router.post("/createScrapingConfig", scrapingController.createScrapingConfig);

router.patch(
  "/updateScrapingConfig/:configId",
  scrapingController.updateScrapingConfig
);

router.delete(
  "/deleteScrapingConfig/:configId",
  scrapingController.deleteScrapingConfig
);

export default router;
