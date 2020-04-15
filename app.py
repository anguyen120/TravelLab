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
   
    # ------------------find the depart airport code by city name-------------------#

    url_airport = "https://tripadvisor1.p.rapidapi.com/airports/search"

    querystring_1 = {"locale": "en_US",
                     "query": "Houston"}

    headers = {
        'x-rapidapi-host': "tripadvisor1.p.rapidapi.com",
        'x-rapidapi-key': "3256ef7778msh7c51b90f77373f3p13fa2djsn4f875d461bba"
    }

    city_to_airport_d = requests.request("GET", url_airport, headers=headers, params=querystring_1)
    city_to_airport_json = city_to_airport_d.json()
    depart_airport = city_to_airport_json[0]['code']
    print(depart_airport)

    # ------------------find the arrive airport code by city name-------------------#
    querystring_2 = {"locale": "en_US",
                     "query": "Minneapolis"}

    headers = {
        'x-rapidapi-host': "tripadvisor1.p.rapidapi.com",
        'x-rapidapi-key': "3256ef7778msh7c51b90f77373f3p13fa2djsn4f875d461bba"
    }

    city_to_airport_a = requests.request("GET", url_airport, headers=headers, params=querystring_2)
    city_to_airport_json = city_to_airport_a.json()
    arrive_airport = city_to_airport_json[0]['code']
    print(arrive_airport)

    # ------------------search for flight options-------------------#
    url__createflight = "https://tripadvisor1.p.rapidapi.com/flights/create-session"
    querystring_3 = {"dd2": "2020-05-10", "currency": "USD", "o2": arrive_airport,
                     "d2": depart_airport, "ta": "1",
                     "tc": "11%2C5",
                     "c": "0", "d1": arrive_airport, "o1": depart_airport, "dd1": "2020-05-08"}

    headers = {
        'x-rapidapi-host': "tripadvisor1.p.rapidapi.com",
        'x-rapidapi-key': "3256ef7778msh7c51b90f77373f3p13fa2djsn4f875d461bba"
    }

    response_createflight = requests.request("GET", url__createflight, headers=headers, params=querystring_3)
    response_createflight_to_json = response_createflight.json()

    sid = response_createflight_to_json['search_params']['sid']
    print(sid)
    time.sleep(1)
    # ------------------poll flight-------------------#

    url = "https://tripadvisor1.p.rapidapi.com/flights/poll"

    querystring = {'currency': "USD", 'n': "15", 'ns': "NON_STOP%2CONE_STOP", 'so': "PRICE", 'o': "0",
                   'sid': sid}

    headers = {
        'x-rapidapi-host': "tripadvisor1.p.rapidapi.com",
        'x-rapidapi-key': "3256ef7778msh7c51b90f77373f3p13fa2djsn4f875d461bba"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    flight_poll = response.json()
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
                            price_depart=price_depart, nm=nm, depart_airport="IAH", arrive_airport="MSP",
                           currency=currency)


@app.route('/gallery')
def gallery():
    return render_template('gallery.html')


@app.route('/hotels')
def hotels():
    return render_template('hotels.html')


if __name__ == '__main__':
    app.run()
