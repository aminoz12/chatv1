import requests

# Test accessing the voice files using your ngrok URL
test_urls = [
    'https://46d4fef642a5.ngrok-free.app/voice-files/a1.mp3',
    'https://46d4fef642a5.ngrok-free.app/voice-files/a2.mp3',
    'https://46d4fef642a5.ngrok-free.app/voice-files/a3.mp3'
]

print('Testing voice file accessibility using your ngrok URL...\n')

for url in test_urls:
    print(f'Testing {url}...')
    try:
        response = requests.head(url, timeout=10)
        print(f'  Status: {response.status_code}')
        print(f'  Content-Type: {response.headers.get("content-type", "Unknown")}')
        print(f'  Content-Length: {response.headers.get("content-length", "Unknown")}')
        
        if response.status_code == 200:
            print(f'  ✓ {url} is accessible')
        else:
            print(f'  ✗ {url} returned status {response.status_code}')
    except requests.exceptions.RequestException as e:
        print(f'  ✗ Error accessing {url}: {e}')
    
    print('')  # Empty line between tests

print('All tests completed.')