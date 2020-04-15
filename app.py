from typing import Dict, Any, Union

import requests
import time
import json
from flask import Flask, render_template, request
import numpy as np
from numpy.core._multiarray_umath import ndarray

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
    return render_template('gallery.html')


@app.route('/hotels')
def hotels():
    return render_template('hotels.html')


if __name__ == '__main__':
    app.run()
