import sys
from PIL import Image
import colorsys

def get_dominant_colors(image_path, num_colors=5):
    image = Image.open(image_path)
    image = image.resize((100, 100))  # Resize for faster processing
    result = image.convert('P', palette=Image.ADAPTIVE, colors=num_colors)
    result = result.convert('RGB')
    colors = result.getcolors(100*100)

    # Sort colors by count
    sorted_colors = sorted(colors, key=lambda x: x[0], reverse=True)

    # Convert RGB to HSL and sort by lightness
    hsl_colors = [colorsys.rgb_to_hls(r/255, g/255, b/255) for count, (r, g, b) in sorted_colors]
    sorted_hsl = sorted(hsl_colors, key=lambda x: x[1])  # Sort by lightness

    # Convert back to RGB
    sorted_rgb = [colorsys.hls_to_rgb(h, l, s) for h, l, s in sorted_hsl]

    # Convert to hex
    hex_colors = ['#%02x%02x%02x' % tuple(int(x*255) for x in rgb) for rgb in sorted_rgb]

    return hex_colors

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide the path to the image file.")
        sys.exit(1)

    image_path = sys.argv[1]
    colors = get_dominant_colors(image_path)

    print(f"primary: '{colors[0]}',")
    print(f"secondary: '{colors[1]}',")
    print(f"background: '{colors[-1]}',")
