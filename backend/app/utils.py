import cloudinary
import cloudinary.uploader

# Configuration
cloudinary.config(
    cloud_name="do8zgj6w5",
    api_key="269446728361577",
    api_secret="xbCj788OBC0xgSvvldnN4cqa6xY",
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