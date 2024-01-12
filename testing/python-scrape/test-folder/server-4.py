# Your goal is to look through the provided file for the appropriate CSS selector to write Python code that scrapes job postings' titles and locations. For example, one of the posting titles is "Software Intern (Spring-Summer/Summer-Fall" and the location is "Liverpool, NY". You must use the correct CSS selector that works with the provided file.

from bs4 import BeautifulSoup
import requests

# URL of the page to scrape (replace with the actual URL)
url = "https://www.amazon.com/s?k=laptop&crid=5BN5LYEITN2Q&sprefix=laptop%2Caps%2C120&ref=nb_sb_noss_2"

# Make a request to the website
response = requests.get(url)
html = response.content

# Parse the HTML content
soup = BeautifulSoup(html, "html.parser")

print(soup)
# Extract job titles and locations
job_titles = soup.select(".a-size-medium a-color-base a-text-normal")
job_locations = soup.select(".a-size-medium a-color-base a-text-normal")

# Loop through the results and print them
for title, location in zip(job_titles, job_locations):
    print(f"Job Title: {title.text.strip()}")
    print(f"Location: {location.text.strip()}\n")
