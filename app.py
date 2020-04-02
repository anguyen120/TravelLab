import os
from flask import Flask, render_template

app = Flask(__name__)

# Load API Keys
unsplash_api_key = os.getenv('UNSPLASH_API_KEY')

@app.route('/')
def index():
    print(unsplash_api_key)
    # We will just display our mailgun secret key, nothing more.
    return render_template("index.html", value=unsplash_api_key)

if __name__ == '__main__':
    app.run(debug=True)
