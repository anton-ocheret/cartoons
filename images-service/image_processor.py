import os
import argparse
from pathlib import Path
from PIL import Image, ImageOps
import time

def process_image(input_path, output_path, size, crop_method='center', quality=80):
    """
    Process a single image:
    - Optimize
    - Resize/crop to specified size
    - Convert to WebP
    
    Args:
        input_path: Path to input image
        output_path: Path to save processed image
        size: Tuple (width, height) for target size
        crop_method: 'center', 'fit', or 'stretch'
        quality: WebP quality (0-100)
    
    Returns:
        Tuple (success, original_size, new_size)
    """
    try:
        # Open the image
        img = Image.open(input_path)
        original_size = os.path.getsize(input_path)
        img = ImageOps.crop(img, (0, 0, 0, 400 - 258))
        # Process based on crop method
        # if crop_method == 'center':
        #     # Center crop to target size while maintaining aspect ratio
        #     img = ImageOps.fit(img, size, Image.LANCZOS)
        # elif crop_method == 'fit':
        #     # Resize to fit within target size, maintaining aspect ratio
        #     img.thumbnail(size, Image.LANCZOS)
        # elif crop_method == 'stretch':
        #     # Stretch/compress to exactly match target size
        #     img = img.resize(size, Image.LANCZOS)
        
        # Ensure the output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # Save as WebP with optimization
        img.save(
            output_path, 
            format="WEBP", 
            quality=quality, 
            method=6,  # Higher method = better compression but slower
            lossless=False
        )
        
        new_size = os.path.getsize(output_path)
        return True, original_size, new_size
    
    except Exception as e:
        print(f"Error processing {input_path}: {e}")
        return False, 0, 0

def batch_process_images(input_dir, output_dir, size, crop_method='center', quality=80, extensions=('.jpg', '.jpeg')):
    """
    Process all images in a directory
    
    Args:
        input_dir: Source directory containing images
        output_dir: Destination directory for processed images
        size: Tuple (width, height) for target size
        crop_method: 'center', 'fit', or 'stretch'
        quality: WebP quality (0-100)
        extensions: Tuple of file extensions to process
    """
    input_path = Path(input_dir)
    output_path = Path(output_dir)

    # Create output directory if it doesn't exist
    output_path.mkdir(parents=True, exist_ok=True)

    # Find all matching image files
    image_files = []
    for ext in extensions:
        image_files.extend(list(input_path.glob(f"*{ext}")))
        image_files.extend(list(input_path.glob(f"*{ext.upper()}")))

    if not image_files:
        print(f"No images found in {input_dir} with extensions {extensions}")
        return
    
    # print(f"Found {len(image_files)} images to process")
    
    # Process each image
    start_time = time.time()
    successful = 0
    total_original_size = 0
    total_new_size = 0
    
    for i, img_path in enumerate(image_files, 1):
        # Create output filename with WebP extension
        rel_path = img_path.relative_to(input_path) if input_path in img_path.parents else img_path.name
        mapped_rel_path = ''.join([char.replace("-", "x") for char in list(rel_path.stem)])
        output_file = output_path / f"{mapped_rel_path}.webp"
        
        print(f"Processing {i}/{len(image_files)}: {img_path.name} -> {output_file.name}")
        
        success, original_size, new_size = process_image(
            img_path, output_file, size, crop_method, quality
        )
        
        if success:
            successful += 1
            total_original_size += original_size
            total_new_size += new_size
            
            # Calculate and display size reduction
            reduction = (1 - new_size / original_size) * 100
            print(f"  Size: {original_size/1024:.1f}KB -> {new_size/1024:.1f}KB ({reduction:.1f}% reduction)")
    
    # Display summary
    elapsed_time = time.time() - start_time
    print(f"\nProcessing complete in {elapsed_time:.1f} seconds")
    print(f"Successfully processed {successful}/{len(image_files)} images")
    
    if successful > 0:
        total_reduction = (1 - total_new_size / total_original_size) * 100
        print(f"Total size: {total_original_size/1024/1024:.2f}MB -> {total_new_size/1024/1024:.2f}MB")
        print(f"Overall reduction: {total_reduction:.1f}%")

def parse_size(size_str):
    """Parse a size string like '800x600' into a tuple (800, 600)"""
    try:
        width, height = map(int, size_str.lower().split('x'))
        return (width, height)
    except:
        raise ValueError("Size must be in format WIDTHxHEIGHT (e.g., 800x600)")

def main():
    parser = argparse.ArgumentParser(description='Process images: optimize, resize, convert to WebP')
    parser.add_argument('input_dir', default='downloaded_images', help='Input directory containing images')
    parser.add_argument('output_dir', default='optimized_images', help='Output directory for processed images')
    parser.add_argument('--size', '-s', default='380x260', help='Target size in format WIDTHxHEIGHT (e.g., 380x200)')
    parser.add_argument('--crop', '-c', choices=['center', 'fit', 'stretch'], default='center',
                        help='Crop method: center (crop to exact size), fit (maintain aspect ratio, fit within size), stretch (distort to exact size)')
    parser.add_argument('--quality', '-q', type=int, default=80, help='WebP quality (1-100, default: 80)')
    parser.add_argument('--extensions', '-e', default='.jpg,.jpeg', help='Comma-separated list of file extensions to process')
    
    args = parser.parse_args()
    
    # Parse size
    size = parse_size(args.size)
    
    # Parse extensions
    extensions = tuple(args.extensions.split(','))
    
    # Process images
    batch_process_images(
        args.input_dir,
        args.output_dir,
        size,
        args.crop,
        args.quality,
        extensions
    )

if __name__ == "__main__":
    main()