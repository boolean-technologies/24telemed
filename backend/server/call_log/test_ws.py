import websocket
import json
import time

# Replace with your Django development server WebSocket URL
ws_url = "ws://127.0.0.1:8000/video_call/"

# Replace with actual doctor and health care assistant channel names
doctor_channel_name = "Samuel"
health_care_assistant_channel_name = "Tobi"

# Data to send for initiating a call
initiate_call_data = {
    'initiate_call': {
        'doctor_channel_name': doctor_channel_name,
        'note': 'Urgent consultation needed',
        'priority': 'High',
        'health_care_assistant_channel_name': health_care_assistant_channel_name,
    }
}

def on_message(ws, message):
    print(f"Received message: {message}")

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws, close_status_code, close_msg):
    print(f"Connection closed: {close_status_code} - {close_msg}")

def on_open(ws):
    print("Connection opened")
    # Send the initiate_call_data after a short delay (adjust as needed)
    time.sleep(2)
    ws.send(json.dumps(initiate_call_data))

if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(ws_url, on_message=on_message, on_error=on_error, on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()
