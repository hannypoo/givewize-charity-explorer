"""
Quick LinkedIn OAuth2 token generator.
Opens a browser for you to authorize, then captures the access token.
"""

import http.server
import urllib.parse
import webbrowser
import requests
import sys
import os
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID", "")
CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET", "")

if not CLIENT_ID or not CLIENT_SECRET:
    print("\n  ERROR: Set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in your .env file.")
    sys.exit(1)
REDIRECT_URI = "http://localhost:3000/callback"
SCOPES = "openid profile email w_member_social w_organization_social r_organization_social"

# Step 1: Open browser for authorization
auth_url = (
    f"https://www.linkedin.com/oauth/v2/authorization"
    f"?response_type=code"
    f"&client_id={CLIENT_ID}"
    f"&redirect_uri={urllib.parse.quote(REDIRECT_URI, safe='')}"
    f"&scope={urllib.parse.quote(SCOPES)}"
)

print("\n  LinkedIn OAuth2 Token Generator")
print("  " + "-" * 35)
print("\n  Opening browser for authorization...")
print("  (If it doesn't open, paste this URL into your browser:)")
print(f"  {auth_url}\n")

webbrowser.open(auth_url)

# Step 2: Listen for the callback
auth_code = None

class CallbackHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        global auth_code
        query = urllib.parse.urlparse(self.path).query
        params = urllib.parse.parse_qs(query)

        if "code" in params:
            auth_code = params["code"][0]
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            self.wfile.write(b"<h1>Success! You can close this tab.</h1><p>Go back to your terminal.</p>")
        else:
            error = params.get("error_description", ["Unknown error"])[0]
            self.send_response(400)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            self.wfile.write(f"<h1>Error: {error}</h1>".encode())

    def log_message(self, format, *args):
        pass  # suppress logs

server = http.server.HTTPServer(("localhost", 3000), CallbackHandler)
print("  Waiting for authorization callback...")
server.handle_request()
server.server_close()

if not auth_code:
    print("\n  ERROR: No authorization code received.")
    sys.exit(1)

print("  Authorization code received!")

# Step 3: Exchange code for access token
print("  Exchanging for access token...", end=" ", flush=True)

token_resp = requests.post(
    "https://www.linkedin.com/oauth/v2/accessToken",
    data={
        "grant_type": "authorization_code",
        "code": auth_code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
    },
    timeout=15,
)

if token_resp.status_code != 200:
    print(f"FAILED")
    print(f"  Error: {token_resp.text}")
    sys.exit(1)

token_data = token_resp.json()
access_token = token_data.get("access_token")
expires_in = token_data.get("expires_in", 0)
days = expires_in // 86400

print("Done!")
print(f"\n  Your LinkedIn Access Token:")
print(f"  {access_token}")
print(f"\n  Expires in: {days} days")
print(f"\n  Add this to your .env file:")
print(f'  LINKEDIN_ACCESS_TOKEN="{access_token}"')

# Step 4: Get your LinkedIn person ID (for org lookup)
print("\n  Fetching your profile info...", end=" ", flush=True)
profile_resp = requests.get(
    "https://api.linkedin.com/v2/userinfo",
    headers={"Authorization": f"Bearer {access_token}"},
    timeout=10,
)

if profile_resp.status_code == 200:
    profile = profile_resp.json()
    sub = profile.get("sub", "unknown")
    name = profile.get("name", "unknown")
    print(f"Done! ({name})")
    print(f"  LinkedIn Person ID: {sub}")
else:
    print("Could not fetch profile")

print("\n  Done! Copy the token above into your .env file.\n")
