function fetchGitHubRepos() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt("Enter GitHub username", "e.g., octocat", ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() !== ui.Button.OK) return;

  var username = response.getResponseText().trim();
  if (!username) {
    ui.alert("Username cannot be empty.");
    return;
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();

  // Create header if empty
  if (data.length < 1 || data[0][0] !== "Repo Name") {
    sheet.clearContents();
    sheet.appendRow(["Repo Name", "Description", "Notes"]);
    data = [["Repo Name", "Description", "Notes"]];
  }

  // Build a map of existing repo names and their row index
  var repoMap = {};
  for (var i = 1; i < data.length; i++) {
    var repoName = data[i][0];
    if (repoName) {
      repoMap[repoName] = i + 1; // 1-based row index
    }
  }

  var page = 1;
  var allRepos = [];

  while (true) {
    var url = `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`;
    var options = {
      headers: { "Accept": "application/vnd.github.v3+json" },
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(url, options);
    if (response.getResponseCode() !== 200) {
      ui.alert("Failed to fetch repos. Status: " + response.getResponseCode());
      return;
    }

    var repos = JSON.parse(response.getContentText());
    if (repos.length === 0) break;
    allRepos = allRepos.concat(repos);
    page++;
  }

  var updatedCount = 0;
  for (var j = 0; j < allRepos.length; j++) {
    var repo = allRepos[j];
    var name = repo.name;
    var description = repo.description || "";

    if (repoMap[name]) {
      // Repo already exists → update name & description only, keep notes
      sheet.getRange(repoMap[name], 1).setValue(name);
      sheet.getRange(repoMap[name], 2).setValue(description);
    } else {
      // New repo → append
      sheet.appendRow([name, description, ""]);
    }

    updatedCount++;
  }

  ui.alert(`Fetched ${updatedCount} repositories for "${username}". Notes in Column C were preserved.`);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("GitHub Tools")
    .addItem("Import Repos", "fetchGitHubRepos")
    .addToUi();
}
