import express from "express";
import https from "https";
import cors from "cors";
import * as scrapingController from "../controllers/scraping";

const router = express.Router();

router.use(cors());

router.get("/getScrapingConfigs", scrapingController.getScrapingConfigs);

router.post("/fetchHtml", (req, res) => {
  const { url } = req.body;

  https
    .get(url, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const baseUrl = new URL(url).origin;
        const basePath = baseUrl;

        let modifiedHtml = data
          .replace(/(src|href|action)="\/(?!\/)/g, `$1="${baseUrl}/`)
          .replace(
            /url\(['"]?(\/[^\/][^'"\)]*)['"]?\)/g,
            (match, path) => `url(${basePath}${path})`
          );

        modifiedHtml = modifiedHtml.replace(
          /<img([^>]*)src="([^"]*)"/g,
          (match, attributes, src) => `<img${attributes}src="${basePath}${src}"`
        );

        modifiedHtml = modifiedHtml.replace(
          /srcset="([^"]*)"/g,
          (match, srcset) => `srcset="${basePath}${srcset}"`
        );

        modifiedHtml = modifiedHtml.replace(
          /data-src="([^"]*)"/g,
          (match, src) => `src="${basePath}${src}"`
        );

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
              const path = [];
              dfs(el, path);
              return path.join(' > ');
          }
          
          function dfs(el, path) {
              if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
              let selector = el.nodeName.toLowerCase();
              if (el.id) {
                  selector += '#' + el.id;
                  path.unshift(selector);
                  return;
              }
              let index = 1;
              let sibling = el.previousElementSibling;
              while (sibling) {
                  if (sibling.nodeName === el.nodeName) {
                      index++;
                  }
                  sibling = sibling.previousElementSibling;
              }
              if (index !== 1) {
                  selector += ':nth-of-type(' + index + ')';
              }
              path.unshift(selector);
              dfs(el.parentNode, path);
          }
        </script>
      `;

        modifiedHtml += script;
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
