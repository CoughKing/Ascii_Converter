import cv2
import numpy as np
from PIL import Image
import io

def calculate_luminance(image):
    """Calculate luminance using the standard formula: 0.2126R + 0.7152G + 0.0722B"""
    if len(image.shape) == 3:
        return 0.2126 * image[:,:,0] + 0.7152 * image[:,:,1] + 0.0722 * image[:,:,2]
    return image

def detect_edges(image):
    """Detect edges using Sobel filter and return edge magnitude and direction"""
    # Convert to grayscale if needed
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image
        
    # Apply Sobel filters
    sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
    sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
    
    # Calculate magnitude and direction
    magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
    direction = np.arctan2(sobel_y, sobel_x)
    
    return magnitude, direction

def get_edge_character(angle):
    """Map edge direction to appropriate ASCII character"""
    angle = np.degrees(angle)
    angle = (angle + 360) % 360  # Normalize to 0-360 range
    
    if 45 <= angle < 135:
        return '/'
    elif 135 <= angle < 225:
        return '\\'
    elif 225 <= angle < 315:
        return '\\'
    else:
        return '/'

def image_to_ascii(file_bytes, output_width=100):
    # Convert bytes to numpy array
    file_array = np.asarray(bytearray(file_bytes), dtype=np.uint8)
    
    # Decode image
    image = cv2.imdecode(file_array, cv2.IMREAD_COLOR)
    if image is None:
        return "Invalid image."
    
    # Calculate luminance
    luminance = calculate_luminance(image)
    
    # Detect edges
    edges, directions = detect_edges(image)
    
    # Resize both luminance and edges while maintaining aspect ratio
    height, width = luminance.shape
    aspect_ratio = height / width
    new_height = int(output_width * aspect_ratio)
    
    resized_luminance = cv2.resize(luminance, (output_width, new_height))
    resized_edges = cv2.resize(edges, (output_width, new_height))
    
    # Normalize
    normalized_luminance = resized_luminance / 255.0
    normalized_edges = resized_edges / 255.0
    
    # Create ASCII art
    ascii_chars = "@%#*+=-:. "
    ascii_art = []
    
    for y in range(new_height):
        line = ""
        for x in range(output_width):
            # Use edge direction to choose character
            if normalized_edges[y, x] > 0.3:  # Edge threshold
                line += get_edge_character(directions[y, x])
            else:
                # Use luminance for non-edge pixels
                line += ascii_chars[int(normalized_luminance[y, x] * (len(ascii_chars) - 1))]
        ascii_art.append(line)
    
    return "\n".join(ascii_art)