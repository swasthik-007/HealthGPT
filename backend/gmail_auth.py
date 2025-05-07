from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle
import os

SCOPES = ['https://www.googleapis.com/auth/gmail.send']

def main():
    flow = InstalledAppFlow.from_client_secrets_file(
        'credentials.json', SCOPES, redirect_uri='http://localhost:8001/'
    )
    creds = flow.run_local_server(port=8001)

    # Save the credentials as token.json
    with open('token.json', 'w') as token:
        token.write(creds.to_json())

    print("✅ token.json generated successfully!")

if __name__ == '__main__':
    main()
