import cv2
import numpy as np
from PIL import Image
import io

ASCII_CHARS = "@%#*+=-:. "

def image_to_ascii(file_bytes, output_width=100):
    file_array = np.asarray(bytearray(file_bytes), dtype=np.uint8)
    image = cv2.imdecode(file_array, cv2.IMREAD_GRAYSCALE)

    if image is None:
        return "Invalid image."

    height, width = image.shape
    aspect_ratio = height / width
    new_height = int(output_width * aspect_ratio)

    resized_image = cv2.resize(image, (output_width, new_height))
    normalized = resized_image / 255.0

    ascii_art = [
        "".join(ASCII_CHARS[int(pixel * (len(ASCII_CHARS) - 1))] for pixel in row)
        for row in normalized
    ]
    return "\n".join(ascii_art)
