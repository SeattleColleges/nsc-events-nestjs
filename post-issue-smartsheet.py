import requests
import smartsheet
import logging
import os

SMART_ACCESS_TOKEN = os.environ['SMART_ACCESS_TOKEN']
GITHUB_ACCESS_TOKEN = os.environ['GH_ACCESS_TOKEN']
ISSUE_NUM = int(os.environ['ISSUE_NUM'])  # Ensure ISSUE_NUM is an integer

# Initialize client. Uses the API token in the environment variable 'SMARTSHEET_ACCESS_TOKEN'
smart = smartsheet.Smartsheet(SMART_ACCESS_TOKEN)
smart.errors_as_exceptions(True)

# Log all calls
logging.basicConfig(filename='rwsheet.log', level=logging.INFO)

# Loop to find a valid issue
while True:
    # GET request to GitHub API
    response = requests.get(
        f'https://api.github.com/repos/SeattleColleges/belindas-closet-nestjs/issues/{ISSUE_NUM}',
        headers={
            'Authorization': f'Bearer {GITHUB_ACCESS_TOKEN}',
            'Content-Type': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        }
    )
    
    # Check for valid response
    if response.status_code != 200:
        print(f"Error fetching issue #{ISSUE_NUM}: {response.json()}")
        break

    issues = response.json()

    # Skip if the event is a pull request
    if 'pull_request' in issues:
        print(f"Skipping PR #{ISSUE_NUM}. Checking next...")
        ISSUE_NUM += 1  # Increment to check the next item
        continue

    # Process the issue
    assignee = 'Missing assignee'
    try:
        if issues['assignee'] is not None:
            assignee = issues['assignee']['login']
    except TypeError:
        pass

    title = issues['title']
    repo_url = issues['repository_url']
    index = issues['number']

    # POST request to Smartsheet API
    smartsheet_response = requests.post(
        'https://api.smartsheet.com/2.0/sheets/3026189207687044/rows',
        headers={'Authorization': f'Bearer {SMART_ACCESS_TOKEN}', 'Content-Type': 'application/json'},
        json={
            'sheetId': 6453502242934660,
            'accessLevel': 'OWNER',
            'createdBy': {'name': 'automation'},
            'cells': [
                {'columnId': 3135587486748548, 'displayValue': 'title', 'value': title},
                {'columnId': 7639187114119044, 'displayValue': 'repo url', 'value': repo_url[45:]},
                {'columnId': 6513287207276420, 'displayValue': 'assignee', 'value': assignee},
                {'columnId': 4261487393591172, 'displayValue': 'index', 'value': index}
            ]
        }
    )

    if smartsheet_response.status_code == 200:
        print(f"Issue #{ISSUE_NUM} successfully sent to Smartsheet.")
        break  # Exit the loop once a valid issue is processed
    else:
        print(f"Failed to send issue #{ISSUE_NUM} to Smartsheet: {smartsheet_response.json()}")
        break
