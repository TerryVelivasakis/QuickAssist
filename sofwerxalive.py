import os
import socket
import time
import requests

def is_alive(host, port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(5)  # Timeout after 5 seconds
    try:
        sock.sendto(b'\0', (host, port))  # Send an empty packet
        sock.recvfrom(1024)  # Try to receive a response
        return True  # If successful
    except socket.timeout:
        return False  # If timed out
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        sock.close()

def send_slack_notification(webhook_url, message):
    payload = {"text": message}
    response = requests.post(webhook_url, json=payload)
    if response.status_code != 200:
        raise ValueError(f"Request to Slack returned an error {response.status_code}, the response is:\n{response.text}")

def send_discord_notification(webhook_url, message):
    payload = {"content": message}
    response = requests.post(webhook_url, json=payload)
    if response.status_code != 204:
        raise ValueError(f"Request to Discord returned an error {response.status_code}, the response is:\n{response.text}")              


ip_address = "172.109.238.146"
ip_socket = 51820
slack_webhook_url = "https://hooks.slack.com/services/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"  
discord_webhook_url = "https://discord.com/api/webhooks/1289277194950017034/rEefr28sUTfTTKgZEfjWHOKAxz2-TrULvWxX0DMvxI8WsXdFylpbJ5-5skhzlUZFu7Ra" 

# Send notifications
message = "I'll be checking every minute to see if SOFWERX's connection is back up, I'll let you know when it is."

#send_slack_notification(slack_webhook_url, message)
#send_discord_notification(discord_webhook_url, message)

print("Message sent to both Slack and Discord.")

while True:
    if is_alive(ip_address, ip_socket):
        message = f"SOFWERX is now back online."
        #send_slack_notification(slack_webhook_url, message)
        #send_discord_notification(discord_webhook_url, message)
        break
    else:
        print(f"{ip_address} is still down.")
    time.sleep(60)  # Check every 60 seconds
