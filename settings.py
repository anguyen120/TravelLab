import os
from dotenv import load_dotenv

# load environment variables from .env
os.chdir(os.path.dirname(__file__))
dotenv_file = os.path.join(os.getcwd(), ".env")

if os.path.isfile(dotenv_file):
    load_dotenv(dotenv_file)

google_cloud_api_key = os.getenv('GOOGLE_CLOUD_API_KEY')
rapid_api_key = os.getenv('RAPID_API_KEY')
unsplash_api_key = os.getenv('UNSPLASH_API_KEY')
