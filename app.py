import requests
from flask import Flask, render_template

import settings

app = Flask(__name__)


@app.route('/')
def index():
    photos = {}
    photos["errors"] = ["No photos found."]

    # Try to get random city with photos
    while "errors" in photos:
        # Request random city
        resp = requests.get(
            "https://query.wikidata.org/sparql?query=SELECT%20DISTINCT%20%3Fbig_city%20%3Fcountry%20%3Flabel%20WHERE%20%7B%0A%20%20%3Fcity%20rdfs%3Alabel%20%3Flabel.%0A%20%20%3Fcity%20wdt%3AP31%20wd%3AQ515.%0A%20%20FILTER((LANG(%3Flabel))%20%3D%20%22en%22)%0A%7D%0AORDER%20BY%20UUID()%0ALIMIT%201&format=json")
        city = resp.json().get("results").get("bindings")[0].get("label").get("value")

        # Request five photos from city
        payload = {
            "query": city,
            "count": "1",
            "client_id": settings.unsplash_api_key
        }
        resp = requests.get("https://api.unsplash.com/photos/random/", params=payload)
        photos = resp.json()
        print(photos)

    return render_template("index.html", city=city, photos=photos)


@app.route('/results', methods=['GET', 'POST'])
def results():
    return render_template('results.html')


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
    app.run(debug=True)
