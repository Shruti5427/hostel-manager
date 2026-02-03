import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()  # This reads your new .env file
# Configuration
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


def upload_image(file_object):
    """
    Takes a file object, uploads it to Cloudinary,
    and returns the secure URL string.
    """
    if not file_object:
        return None

    try:
        # Upload the file directly
        response = cloudinary.uploader.upload(file_object.file)
        return response.get("secure_url")
    except Exception as e:
        print(f"Error uploading image: {e}")
        return None
