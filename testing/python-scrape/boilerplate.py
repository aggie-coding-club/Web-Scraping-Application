from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

driver.get(
    "https://www.linkedin.com/jobs/search/?currentJobId=3771578111&geoId=103644278&keywords=Software%20Engineering%20Intern&location=United%20States"
)

wait = WebDriverWait(driver, 10)

titles = wait.until(
    EC.presence_of_all_elements_located(
        (
            By.CSS_SELECTOR,
            "disabled ember-view job-card-container__link job-card-list__title",
        )
    )
)

for title in titles:
    print(f"Title: {title.text}")

driver.quit()
