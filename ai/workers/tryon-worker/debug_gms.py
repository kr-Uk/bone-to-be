import requests
import json
import os

# Manual .env loading
try:
    with open('/home/taekmin/ai-lab/S14P11D210/ai/workers/tryon-worker/.env') as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                key, val = line.strip().split('=', 1)
                os.environ[key] = val
except Exception as e:
    print(f'Warning loading .env: {e}')

API_KEY = os.getenv('GOOGLE_API_KEY')
ORIG_URL = 'https://gms.ssafy.io/gmsapi/generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent'
TEST_URL = 'https://gms.ssafy.io/gmsapi/generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

def test_gms(url, label):
    print(f'\nTesting {label}: {url}')
    headers = {
        'x-goog-api-key': API_KEY,
        'Content-Type': 'application/json'
    }
    payload = {
        'contents': [{
            'parts': [{'text': 'Hello'}]
        }]
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        print(f'Status: {response.status_code}')
        print(f'Response: {response.text}')
    except Exception as e:
        print(f'Exception: {e}')

if __name__ == '__main__':
    if not API_KEY:
        print('❌ GOOGLE_API_KEY not found')
    else:
        test_gms(TEST_URL, 'Standard')
        test_gms(ORIG_URL, 'Configured')
