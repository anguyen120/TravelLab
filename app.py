import requests
from flask import Flask, render_template

import settings

app = Flask(__name__)


@app.route('/')
def index():
    photos = {}
    photos["errors"] = ["No photos found."]

    # Slideshow with photos
    while "errors" in photos:
        # Request five photos from city
        payload = {
            "query": "Houston",
            "count": "5",
            "client_id": settings.unsplash_api_key
        }
        resp = requests.get("https://api.unsplash.com/photos/random/", params=payload)
        photos = resp.json()

    return render_template("index.html", city="Houston", photos=photos)


@app.route('/results', methods=['GET', 'POST'])
def results_page():
    return render_template('results.html')


@app.route('/attractions')
def attractions_page():
    return render_template('attractions.html')


@app.route('/flights')
def flights_page():
    return render_template('flights.html')


@app.route('/gallery')
def gallery_page():
    return render_template('gallery.html')


@app.route('/hotels')
def hotels_page():
    return render_template('hotels.html')


if __name__ == '__main__':
    app.run()
