import pprint

import requests
from amadeus import Client, Location
from flask import Flask, render_template, request, jsonify, url_for, redirect

import settings
from forms import Form

app = Flask(__name__)
app.config['SECRET_KEY'] = settings.flask_secret_key


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        search_term = request.form['location']
        # airport autocomplete using Amadeus
        amadeus = Client(
            client_id=settings.amadeus_api_key,
            client_secret=settings.amadeus_api_secret
        )
        resp = amadeus.reference_data.locations.get(keyword=search_term, subType=Location.CITY)
        airport_names = resp.data
        pprint.pprint(airport_names)
        # return JSON data to autocomplete.js
        return jsonify(airport_names)
    else:
        photos = {"errors": ["No photos found."]}

        # Slideshow with photos
        while "errors" in photos:
            # Request five photos from city
            payload = {
                "query": "Houston",
                "count": "5",
                "orientation": "landscape",
                "client_id": settings.unsplash_api_key
            }
            resp = requests.get("https://api.unsplash.com/photos/random/", params=payload)
            photos = resp.json()

        form = Form()
        if form.validate_on_submit():
            return redirect(url_for('success'))
        return render_template("index.html", city="Houston", form=form, photos=photos)


@app.route('/results', methods=['POST'])
def results():
    # Grab form data
    to_location = request.form['to_location'].title()
    depart_date = request.form['depart_date']
    return_date = request.form['return_date']

    '''
    Attractions
    '''
    # get location id - code snippet from Rapid API
    url = "https://tripadvisor1.p.rapidapi.com/locations/search"

    querystring = {
        "location_id": "1",
        "limit": "30",
        "sort": "relevance",
        "offset": "0",
        "lang": "en_US",
        "currency": "USD",
        "units": "km",
        "query": to_location
    }

    headers = {
        'x-rapidapi-host': "tripadvisor1.p.rapidapi.com",
        'x-rapidapi-key': settings.rapid_api_key
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    location_result = response.json()
    first_response = location_result.get('data')[0]
    result_object = first_response.get('result_object')
    location_id = result_object.get('location_id')

    # query attractions by location id - code snippet from Rapid API
    url = "https://tripadvisor1.p.rapidapi.com/attractions/list"

    querystring = {
        "lang": "en_US",
        "currency": "USD",
        "sort": "recommended",
        "lunit": "km",
        "limit": "5",
        "bookable_first": "false",
        "location_id": location_id
    }

    headers = {
        'x-rapidapi-host': "tripadvisor1.p.rapidapi.com",
        'x-rapidapi-key': settings.rapid_api_key
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    attractions = response.json()

    '''
    Restaurants
    '''
    url = "https://api.yelp.com/v3/businesses/search"
    headers = {
        'Authorization': 'Bearer %s' % settings.yelp_api_key
    }
    params = {
        "term": "restaurants",
        "location": to_location,
        "limit": 5,
        "sort_by": "rating"
    }
    resp = requests.request('GET', url, headers=headers, params=params)
    restaurants = resp.json()

    '''
    Gallery
    '''
    payload = {
        "query": to_location,
        "per_page": "3",
        "orientation": "squarish",
        "client_id": settings.unsplash_api_key
    }
    resp = requests.get("https://api.unsplash.com/search/photos", params=payload)
    gallery = resp.json()

    # url used for request
    url = "https://tripadvisor1.p.rapidapi.com/locations/search"

    # header used for the rapid api
    headers = {
        "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
        'x-rapidapi-key': settings.rapid_api_key
    }

    # finding location based on given location name
    city = str(request.args.get('to_location')).replace(" ", "")
    payload = {
        "location_id": "1",
        "query": city
    }
    resp = requests.get(url, params=payload, headers=headers)
    location_id = resp.json()
    location_id = str(location_id)
    location_id = location_id[location_id.index("\'location_id\':") + 16:]
    location_id = location_id[0:(location_id.index("\'"))]

    # finding the hotels based on the location
    url = "https://tripadvisor1.p.rapidapi.com/hotels/list"
    payload = {
        "subcategory": "hotel",
        "zff": "4%2C6",
        "location_id": location_id,
        "limit": "5",
        "sort": "recommended"
    }
    resp = requests.get(url, params=payload, headers=headers)
    hotels = resp.json()

    return render_template('results.html', to_location=to_location,
                           depart_date=depart_date, return_date=return_date, attractions=attractions, gallery=gallery,
                           hotels=hotels, restaurants=restaurants)


@app.route('/attractions', methods=['GET', 'POST'])
def attractions():
    if request.method == 'POST':
        attraction_id = request.form['location']
        url = "https://tripadvisor1.p.rapidapi.com/reviews/list"

        querystring = {
            "limit": "5",
            "currency": "USD",
            "lang": "en_US",
            "location_id": attraction_id
        }

        headers = {
            'x-rapidapi-host': "tripadvisor1.p.rapidapi.com",
            'x-rapidapi-key': settings.rapid_api_key
        }

        response = requests.request("GET", url, headers=headers, params=querystring)
        reviews = response.json()
        return jsonify(reviews)
    else:
        to_location = request.args.get('to_location')
        # get location id - code snippet from Rapid API
        url = "https://tripadvisor1.p.rapidapi.com/locations/search"

        querystring = {
            "location_id": "1",
            "limit": "30",
            "sort": "relevance",
            "offset": "0",
            "lang": "en_US",
            "currency": "USD",
            "units": "km",
            "query": to_location
        }

        headers = {
            'x-rapidapi-host': "tripadvisor1.p.rapidapi.com",
            'x-rapidapi-key': settings.rapid_api_key
        }

        response = requests.request("GET", url, headers=headers, params=querystring)
        location_result = response.json()
        first_response = location_result.get('data')[0]
        result_object = first_response.get('result_object')
        location_id = result_object.get('location_id')

        # query attractions by location id - code snippet from Rapid API
        url = "https://tripadvisor1.p.rapidapi.com/attractions/list"

        querystring = {
            "lang": "en_US",
            "currency": "USD",
            "sort": "recommended",
            "lunit": "km",
            "limit": "20",
            "bookable_first": "false",
            "location_id": location_id
        }

        headers = {
            'x-rapidapi-host': "tripadvisor1.p.rapidapi.com",
            'x-rapidapi-key': settings.rapid_api_key
        }

        response = requests.request("GET", url, headers=headers, params=querystring)
        attractions = response.json()
        city = to_location.capitalize()
        return render_template('attractions.html', city=city, attractions=attractions)


@app.route('/restaurants', methods=['GET', 'POST'])
def restaurants():
    if request.method == 'POST':
        restaurant_id = request.form['location']
        url = "https://api.yelp.com/v3/businesses/" + restaurant_id +"/reviews"

        headers = {
            'Authorization': 'Bearer %s' % settings.yelp_api_key
        }
        params = {}
        resp = requests.request('GET', url, headers=headers, params=params)
        reviews = resp.json()
        return jsonify(reviews)
    else:
        to_location = request.args.get('to_location')
        url = "https://api.yelp.com/v3/businesses/search"

        headers = {
            'Authorization': 'Bearer %s' % settings.yelp_api_key
        }

        params = {
            "term": "restaurants",
            "location": to_location,
            "limit": 15,
            "sort_by": "rating"
        }

        resp = requests.request('GET', url, headers=headers, params=params)
        restaurants = resp.json()
        city = to_location.capitalize()

        return render_template('restaurants.html', restaurants=restaurants, city=city)


@app.route('/gallery')
def gallery():
    to_location = request.args.get('to_location')
    payload = {
        "query": to_location,
        "per_page": "15",
        "orientation": "squarish",
        "client_id": settings.unsplash_api_key
    }
    resp = requests.get("https://api.unsplash.com/search/photos", params=payload)
    gallery = resp.json()

    return render_template('gallery.html', city=to_location, gallery=gallery)


@app.route('/hotels')
def hotels():
    # url used for request
    url = "https://tripadvisor1.p.rapidapi.com/locations/search"

    # header used for the rapid api
    headers = {
        "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
        'x-rapidapi-key': settings.rapid_api_key
    }

    # finding location based on given location name
    city = str(request.args.get('to_location')).replace(" ", "")
    payload = {
        "location_id": "1",
        "query": city
    }
    resp = requests.get(url, params=payload, headers=headers)
    location_id = resp.json()
    location_id = str(location_id)
    location_id = location_id[location_id.index("\'location_id\':") + 16:]
    location_id = location_id[0:(location_id.index("\'"))]

    # finding the hotels based on the location
    url = "https://tripadvisor1.p.rapidapi.com/hotels/list"
    payload = {
        "subcategory": "hotel",
        "zff": "4%2C6",
        "location_id": location_id,
        "limit": "5",
        "sort": "recommended"
    }
    resp = requests.get(url, params=payload, headers=headers)
    hotels = resp.json()

    hotellist = list(hotels['data'])
    hotelreview = []

    for h in hotellist:
        # get more details
        url = "https://tripadvisor1.p.rapidapi.com/reviews/list"
        payload = {
            "limit": "1",
            "location_id": h['location_id']  # temp #
        }
        resp = requests.get(url, params=payload, headers=headers)
        reviews = resp.json()
        print(reviews)
        reviews = list(reviews['data'])
        print(reviews)

        for r in reviews:
            hotelreview.append(r['text'] + ' ' + r['travel_date'])
            print(r['rating'], r['travel_date'], r['text'])

    return render_template('hotels.html', city=city, hotels=hotels)


if __name__ == '__main__':
    app.run()
