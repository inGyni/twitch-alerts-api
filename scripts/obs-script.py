import requests
import hashlib
import obspython as OBS

ACCESS_KEY = 'YOUR_ACCESS_KEY'
access_key_hash = hashlib.sha256(ACCESS_KEY.encode('utf-8')).hexdigest()

api_url = "https://localhost:3000/start-stream"
headers = {"Access-Key": access_key_hash}

def on_event(event):
    if event == OBS.OBS_FRONTEND_EVENT_STREAMING_STARTED:
        response = requests.post(api_url, headers=headers)
        print(response.text)

def script_load(settings):
    OBS.obs_frontend_add_event_callback(on_event)

def script_description():
    return "Tell the Streaming API to start monitoring stream alerts."