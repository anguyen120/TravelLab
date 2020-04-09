import requests
from flask import Flask, render_template, request

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


@app.route('/results', methods=['POST'])
def results():
    from_location = request.form['from_location']
    to_location = request.form['to_location']
    depart_date = request.form['depart_date']
    return_date = request.form['return_date']
    return render_template('results.html', from_location=from_location, to_location=to_location,
                           depart_date=depart_date, return_date=return_date)


@app.route('/attractions')
def attractions():
    return render_template('attractions.html')


@app.route('/flights')
def flights():
    return render_template('flights.html')


@app.route('/gallery')
def gallery():
    return render_template('gallery.html')


@app.route('/hotels')
def hotels():
    return render_template('hotels.html')


if __name__ == '__main__':
    app.run()
