# GitHub Repo Fetcher for Google Sheets

This script fetches a list of public GitHub repositories for any username and populates a Google Sheet with:

- **Column A**: Repo Name
- **Column B**: Description
- **Column C**: Notes (left blank)

## How to Use

1. Open your Google Sheet
2. Go to `Extensions > Apps Script`
3. Paste the contents of `Code.gs`
4. Save and reload the Sheet
5. Use the menu: `GitHub Tools > Import Repos`

## Example Output

| Repo Name | Description         | Notes |
|-----------|---------------------|-------|
| scraper   | A web scraping tool |       |
| theme-ui  | A UI toolkit        |       |
