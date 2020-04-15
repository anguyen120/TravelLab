from typing import Dict, Any, Union

import requests
from amadeus import Client, Location
from flask import Flask, render_template, request, jsonify, url_for, redirect
import time
import json
import numpy as np
from numpy.core._multiarray_umath import ndarray

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
        resp = amadeus.reference_data.locations.get(keyword=search_term, subType=Location.AIRPORT)
        airport_names = resp.data

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
    from_location = request.form['from_location']
    to_location = request.form['to_location']
    depart_date = request.form['depart_date']
    return_date = request.form['return_date']

    return render_template('results.html', from_location=from_location, to_location=to_location,
                           depart_date=depart_date, return_date=return_date)


@app.route('/attractions')
def attractions():
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

    return render_template('attractions.html', attractions=attractions)


@app.route('/flights')
def flights():
    to_location = str(request.args.get('to_location'))
    from_location = str(request.args.get('from_location'))
    depart_date = str(request.args.get('depart_date'))
    return_date = str(request.args.get('return_date'))

    # ------------------find the depart airport code by city name-------------------#

    url_airport = "https://tripadvisor1.p.rapidapi.com/airports/search"

    querystring_1 = {"locale": "en_US",
                     "query": from_location}

    headers_4 = {
        'x-rapidapi-host': "tripadvisor1.p.rapidapi.com",
        'x-rapidapi-key': settings.rapid_api_key
    }

    city_to_airport_d = requests.request("GET", url_airport, headers=headers_4, params=querystring_1)
    city_to_airport_json = city_to_airport_d.json()
    depart_airport = str(city_to_airport_json[0]['code'])

    # ------------------find the arrive airport code by city name-------------------#
    querystring_2 = {"locale": "en_US",
                     "query": to_location}

    headers_3 = {
        'x-rapidapi-host': "tripadvisor1.p.rapidapi.com",
        'x-rapidapi-key': settings.rapid_api_key
    }

    city_to_airport_a = requests.request("GET", url_airport, headers=headers_3, params=querystring_2)
    city_to_airport_json = city_to_airport_a.json()
    arrive_airport = str(city_to_airport_json[0]['code'])

    # ------------------search for flight options-------------------#
    url__createflight = "https://tripadvisor1.p.rapidapi.com/flights/create-session"
    querystring_3 = {"dd2": return_date, "currency": "USD", "o2": arrive_airport,
                     "d2": depart_airport, "ta": "1",
                     "tc": "11%2C5",
                     "c": "0", "d1": arrive_airport, "o1": depart_airport, "dd1": depart_date}

    headers_b = {
        'x-rapidapi-host': "tripadvisor1.p.rapidapi.com",
        'x-rapidapi-key': settings.rapid_api_key
    }

    response_createflight = requests.request("GET", url__createflight, headers=headers_b, params=querystring_3)
    response_createflight_to_json = response_createflight.json()
    sid = str(response_createflight_to_json['search_params']['sid'])
    print(sid)
    time.sleep(1)
    # ------------------poll flight-------------------#

    url_poll = "https://tripadvisor1.p.rapidapi.com/flights/poll"

    querystring_a = {'currency': "USD", 'n': "8", 'ns': "NON_STOP%2CONE_STOP", 'so': "PRICE",
                   'o': "1", 'sid': sid}

    headers_a = {
        'x-rapidapi-host': "tripadvisor1.p.rapidapi.com",
        'x-rapidapi-key': settings.rapid_api_key
    }

    response_flight = requests.request("GET", url_poll, headers=headers_a, params=querystring_a)
    flight_poll = response_flight.json()
    print(flight_poll)
    airline_depart = np.array([])
    airline_return = np.array([])
    flights_depart = np.array([])
    flights_return = np.array([])
    date_depart_d: ndarray = np.array([])
    date_depart_a = np.array([])
    date_return_d = np.array([])
    date_return_a = np.array([])
    price_depart = np.array([])
    nm = np.array([])
    # url_depart = np.array([])
    # url_return = np.array([])

    for x in range(6):
        airline_depart = np.append(airline_depart, flight_poll['itineraries'][x]['f'][0]['l'][0]['m'])
        airline_return = np.append(airline_return, flight_poll['itineraries'][x]['f'][1]['l'][0]['m'])
        flights_depart = np.append(flights_depart, flight_poll['itineraries'][x]['f'][0]['l'][0]['f'])
        flights_return = np.append(flights_return, flight_poll['itineraries'][x]['f'][1]['l'][0]['f'])
        price_depart = np.append(price_depart, flight_poll['itineraries'][x]['l'][0]['pr']['dp'])
        date_depart_d = np.append(date_depart_d, flight_poll['itineraries'][x]['f'][0]['l'][0]['dd'])
        date_depart_a = np.append(date_depart_a, flight_poll['itineraries'][x]['f'][0]['l'][0]['ad'])
        date_return_d = np.append(date_return_d, flight_poll['itineraries'][x]['f'][1]['l'][0]['dd'])
        date_return_a = np.append(date_return_a, flight_poll['itineraries'][x]['f'][1]['l'][0]['ad'])

    # -------------------------exchange rate-------------------------#

    url_exchangerate = 'https://prime.exchangerate-api.com/v5/41c5fdf595da392d793aeb2d/latest/USD'

    response_er = requests.get(url_exchangerate)
    data = response_er.json()
    currency = data['conversion_rates']
    return render_template('flights.html',
                           airline_depart=airline_depart, airline_return=airline_return,
                           date_depart_d=date_depart_d, date_depart_a=date_depart_a, date_return_d=date_return_d,
                           date_return_a=date_return_a, flights_depart=flights_depart, flights_return=flights_return,
                           price_depart=price_depart, nm=nm, depart_airport=depart_airport,
                           arrive_airport=arrive_airport,
                           currency=currency)


@app.route('/gallery')
def gallery():
    to_location = request.args.get('to_location')
    payload = {
        "query": to_location,
        "count": "9",
        "orientation": "squarish",
        "client_id": settings.unsplash_api_key
    }
    resp = requests.get("https://api.unsplash.com/photos/random", params=payload)
    gallery = resp.json()

    return render_template('gallery.html', gallery=gallery)


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
    cityName = str(request.args.get('to_location')).replace(" ", "")
    payload = {
        "location_id": "1",
        "query": cityName
    }
    resp = requests.get(url, params=payload, headers=headers)
    location_id = resp.json()
    print(location_id)
    location_id = str(location_id)
    print(location_id)
    location_id = location_id[location_id.index("\'location_id\':") + 16:]
    print(location_id)
    location_id = location_id[0:(location_id.index("\'"))]
    print(location_id)
    print(location_id)

    url = "https://tripadvisor1.p.rapidapi.com/hotels/list"
    payload = {
        "subcategory": "hotel",
        "zff": "4%2C6",
        "location_id": location_id,
        "limit": "5",
        "sort": "recommended"
    }
    resp = requests.get(url, params=payload, headers=headers)
    hotels = {}
    hotels = resp.json()
    print(hotels)
    hotels = list(hotels['data'])
    print(hotels)
    hotelName = []
    hotelRating = []
    hotelLocation = []
    hotelsrc = []
    hotelRanking = []
    for h in hotels:
        hotelName.append(h['name'])
        hotelRating.append(h['rating'])
        hotelLocation.append(h['location_string'])
        if (h['ranking']):
            hotelRanking.append(h['ranking'])
        else:
            hotelRanking.append('')

        temp = str(h['photo'])
        print(temp)
        if (temp.index("\'large\'")):
            temp = temp[temp.index("\'large\'") + 8:]
            print(temp)
            temp = temp[temp.index("\'url\'") + 8:]
            print(temp)
            temp = temp[0:(temp.index("\'"))]
            print(temp)
            hotelsrc.append(temp)
        else:
            hotelsrc.append('')
        print(h['location_id'], h['name'], h['rating'], temp)

    hotelreview = []
    hoteltotalreviews = []
    for h in hotels:
        # temp = "93437"
        # get more details
        url = "https://tripadvisor1.p.rapidapi.com/reviews/list"
        payload = {
            "limit": "1",
            "location_id": h['location_id']  # temp #
        }
        resp = requests.get(url, params=payload, headers=headers)
        reviews = {}
        reviews = resp.json()
        print(reviews)
        reviews = list(reviews['data'])
        print(reviews)

        for r in reviews:
            hotelreview.append(r['text'] + ' ' + r['travel_date'])
            print(r['rating'], r['travel_date'], r['text'])

        reviews = resp.json()
        hoteltotalreviews.append(reviews['paging']['total_results'])

    return render_template('hotels.html', location=cityName,
                           hotelname1=hotelName[0], hotelname2=hotelName[1], hotelname3=hotelName[2],
                           hotelname4=hotelName[3], hotelname5=hotelName[4],
                           hotelrating1=hotelRating[0], hotelrating2=hotelRating[1], hotelrating3=hotelRating[2],
                           hotelrating4=hotelRating[3], hotelrating5=hotelRating[4],
                           hotellocation1=hotelLocation[0], hotellocation2=hotelLocation[1],
                           hotellocation3=hotelLocation[2], hotellocation4=hotelLocation[3],
                           hotellocation5=hotelLocation[4],
                           hotelranking1=hotelRanking[0], hotelranking2=hotelRanking[1], hotelranking3=hotelRanking[2],
                           hotelranking4=hotelRanking[3], hotelranking5=hotelRanking[4],
                           hotelsrc1=hotelsrc[0], hotelsrc2=hotelsrc[1], hotelsrc3=hotelsrc[2], hotelsrc4=hotelsrc[3],
                           hotelsrc5=hotelsrc[4],
                           hoteltotalreviews1=hoteltotalreviews[0], hoteltotalreviews2=hoteltotalreviews[1],
                           hoteltotalreviews3=hoteltotalreviews[2], hoteltotalreviews4=hoteltotalreviews[3],
                           hoteltotalreviews5=hoteltotalreviews[4],
                           hotelreview1=hotelreview[0], hotelreview2=hotelreview[1], hotelreview3=hotelreview[2],
                           hotelreview4=hotelreview[3], hotelreview5=hotelreview[4])


if __name__ == '__main__':
    app.run()
