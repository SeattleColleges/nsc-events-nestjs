import requests
import smartsheet
import logging
import os

SMART_ACCESS_TOKEN = os.environ['SMART_ACCESS_TOKEN']
GITHUB_ACCESS_TOKEN = os.environ['GH_ACCESS_TOKEN']
ISSUE_NUM = os.environ['ISSUE_NUM'] 

# Initialize client. Uses the API token in the environment variable 'SMARTSHEET_ACCESS_TOKEN'
smart = smartsheet.Smartsheet(SMART_ACCESS_TOKEN)
# Make sure we don't miss any error
smart.errors_as_exceptions(True)

# Log all calls
logging.basicConfig(filename='rwsheet.log', level=logging.INFO)

# GET request to GitHub API
response = requests.get(
    f'https://api.github.com/repos/SeattleColleges/nsc-events-nestjs/issues/{ISSUE_NUM}',
                        headers={'Authorization': GITHUB_ACCESS_TOKEN, 
                                 'Content-Type': 'application/vnd.github+json',
                                 'X-GitHub-Api-Version': '2022-11-28'})
issues = response.json()

assignee = 'assignee'
try: 
    if issues['assignee'] is not None:
        assignee = issues['assignee']['login']
    else:
        assignee = 'Missing assignee'
except TypeError:
    assignee = 'Missing assignee'
title = issues['title']
repo_url = issues['repository_url']
index = issues['number']

# POST request to Smartsheet API
smartsheet_response = requests.post(
    'https://api.smartsheet.com/2.0/sheets/6453502242934660/rows',
    headers={'Authorization': f'Bearer {SMART_ACCESS_TOKEN}', 'Content-Type': 'application/json'},
    json={
        'sheetId': 6453502242934660,
        'accessLevel': 'OWNER',
        'createdBy': {
            'name': 'automation'
        },
        'cells': [
            {
            'columnId': 3135587486748548,
            'displayValue': 'title',
            'value': title
            },
            {
            'columnId': 7639187114119044,
            'displayValue': 'repo url',
            'value': repo_url[45:]
            },
            {
            'columnId': 6513287207276420,
            'displayValue': 'assignee',
            'value': assignee
            },
            {
            'columnId': 4261487393591172,
            'displayValue': 'index',
            'value': index
            }
        ]
        })
