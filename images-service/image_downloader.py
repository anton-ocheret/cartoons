import json
import os
import requests
from pathlib import Path
from urllib.parse import urlparse
import time
import argparse
from typing import Dict, List, Any, Union

def load_json(source: str) -> Dict:
    """Load JSON from a file path or URL."""
    try:
        # Check if source is a URL
        if source.startswith(('http://', 'https://')):
            response = requests.get(source)
            response.raise_for_status()
            return response.json()
        else:
            # Load from local file
            with open(source, 'r') as file:
                return json.load(file)
    except Exception as e:
        print(f"Error loading JSON: {e}")
        return {}

def extract_image_urls(data: Any, json_path: str = None) -> List[Dict[str, str]]:
    """
    Extract image URLs from JSON data.
    
    Args:
        data: The JSON data
        json_path: Dot-notation path to image URLs (e.g., "data.items.image_url")
                  If None, will try to find URLs automatically
    
    Returns:
        List of dicts with 'url' and optional 'metadata' keys
    """
    image_data = []
    
    # If a specific path is provided
    if json_path:
        parts = json_path.split('.')
        current = data
        for part in parts[:-1]:
            if isinstance(current, dict) and part in current:
                current = current[part]
            elif isinstance(current, list) and part.isdigit():
                current = current[int(part)]
            else:
                print(f"Path {json_path} not found in JSON")
                return []
        
        # Get the final part which should contain the URLs
        final_part = parts[-1]
        
        # Handle different data structures
        if isinstance(current, list):
            for item in current:
                if isinstance(item, dict) and final_part in item:
                    url = item[final_part]
                    if is_image_url(url):
                        image_data.append({'url': url, 'metadata': item})
        elif isinstance(current, dict) and final_part in current:
            url = current[final_part]
            if is_image_url(url):
                image_data.append({'url': url, 'metadata': current})
    
    # If no path provided or no images found, try to find URLs automatically
    if not image_data:
        image_data = find_image_urls_recursive(data)
    
    return image_data

def is_image_url(url: str) -> bool:
    """Check if a URL points to an image based on extension."""
    if not isinstance(url, str):
        return False
    
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
    parsed_url = urlparse(url)
    path = parsed_url.path.lower()
    
    return any(path.endswith(ext) for ext in image_extensions)

def find_image_urls_recursive(data: Any, parent_key: str = '') -> List[Dict[str, str]]:
    """Recursively search for image URLs in the JSON data."""
    image_data = []
    
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, str) and is_image_url(value):
                image_data.append({'url': value, 'metadata': data})
            else:
                image_data.extend(find_image_urls_recursive(value, key))
    
    elif isinstance(data, list):
        for item in data:
            image_data.extend(find_image_urls_recursive(item))
    
    return image_data

def download_images(image_data: List[Dict[str, str]], output_folder: str, naming_pattern: str) -> None:
    """
    Download images and save them with custom names.
    
    Args:
        image_data: List of dicts with 'url' and 'metadata' keys
        output_folder: Folder to save images
        naming_pattern: Pattern for naming files:
            - 'index': Use index number (1, 2, 3...)
            - 'original': Use original filename
            - 'custom:{field}': Use a field from metadata (e.g., 'custom:id')
    """
    # Create output folder if it doesn't exist
    output_path = Path(output_folder)
    output_path.mkdir(parents=True, exist_ok=True)
    
    print(f"Found {len(image_data)} images to download")
    
    for i, item in enumerate(image_data, 1):
        url = item['url']
        print('url', url)
        metadata = item.get('metadata', {})
        print('metadata', metadata)
        try:
            # Generate filename based on pattern
            if naming_pattern == 'index':
                filename = f"image_{i:04d}{get_extension(url)}"
            elif naming_pattern == 'original':
                filename = os.path.basename(urlparse(url).path)
            elif naming_pattern.startswith('custom:'):
                field = naming_pattern.split(':', 1)[1]
                if field in metadata:
                    filename = f"{metadata[field]}{get_extension(url)}"
                else:
                    filename = f"image_{i:04d}{get_extension(url)}"
                    print(f"Field '{field}' not found in metadata, using index naming")
            else:
                filename = f"image_{i:04d}{get_extension(url)}"
            
            # Download the image
            print(f"Downloading {i}/{len(image_data)}: {url}")
            response = requests.get(url, stream=True)
            response.raise_for_status()
            
            # Save the image
            file_path = output_path / filename
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            print(f"Saved as {filename}")
            
            # Add a small delay to avoid overwhelming the server
            time.sleep(0.1)
            
        except Exception as e:
            print(f"Error downloading {url}: {e}")

def get_extension(url: str) -> str:
    """Get file extension from URL."""
    path = urlparse(url).path
    ext = os.path.splitext(path)[1]
    return ext if ext else '.jpg'  # Default to .jpg if no extension found

def main():
    parser = argparse.ArgumentParser(description='Download images from JSON file')
    parser.add_argument('json_source', help='Path or URL to JSON file')
    parser.add_argument('--output', '-o', default='downloaded_images', help='Output folder')
    parser.add_argument('--path', '-p', help='JSON path to image URLs (e.g., "data.items.image_url")')
    parser.add_argument('--naming', '-n', default='index', 
                        help='Naming pattern: "index", "original", or "custom:field_name"')
    
    args = parser.parse_args()
    
    # Load JSON data
    data = load_json(args.json_source)
    if not data:
        return
    
    # Extract image URLs
    image_data = extract_image_urls(data, args.path)
    if not image_data:
        print("No image URLs found in the JSON data")
        return
    
    # Download images
    download_images(image_data, args.output, args.naming)
    
    print(f"Download complete. Images saved to {args.output}")

if __name__ == "__main__":
    # main()
    dbPath = '../db'
    files = os.listdir('../db')

    for file in files:
        # Load JSON data
        data = load_json(f'../db/{file}')
        if not data:
            continue
        # Extract image URLs
        image_data = extract_image_urls(data, 'downloaded_images')
        if not image_data:
            print("No image URLs found in the JSON data")
            continue
        # Download images
        download_images(image_data, 'downloaded_images', 'original')
        
        # print(f"Download complete. Images saved to {'downloaded_images'}")
