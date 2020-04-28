function haversine(lat1, lon1, lat2, lon2) {
    var R = 6371000; // Radius of the earth in km
    var dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a =
        0.5 - Math.cos(dLat) / 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        (1 - Math.cos(dLon)) / 2;

    return R * 2 * Math.asin(Math.sqrt(a));
}

window.onload = function () {
    var latitude = city["data"][0]["geoCode"]["latitude"];
    var longitude = city["data"][0]["geoCode"]["longitude"];

    var map = L.map('map', {
        center: [[latitude, longitude]],
        scrollWheelZoom: false,
        inertia: true,
        inertiaDeceleration: 2000
    });

    var circle_marker = new L.circle();

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'superpikar.n28afi10',
        accessToken: 'pk.eyJ1Ijoic3VwZXJwaWthciIsImEiOiI0MGE3NGQ2OWNkMzkyMzFlMzE4OWU5Yjk0ZmYzMGMwOCJ9.3bGFHjoSXB8yVA3KeQoOIw'
    }).addTo(map);

    var greyIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    var goldIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    var violetIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    var markerGroup = L.layerGroup().addTo(map);

    var latitude = city["data"][0]["geoCode"]["latitude"];
    var longitude = city["data"][0]["geoCode"]["longitude"];

    markerGroup.clearLayers();
    map.removeLayer(circle_marker);

    var radius = -1;

    photos["results"].forEach(function (photo) {
        if (photo["description"] != null) {
            document.getElementById("gallery").innerHTML += `<article class="style1">` +
                `<span class="image">` +
                `<img src="${photo["urls"]["regular"]}" alt="${photo["urls"]["full"]}" />` +
                `</span>` +
                `<div class="content">` +
                `<h2>${photo["description"]}</h2>` +
                `<p>Photo by <a href="https://unsplash.com/@${photo["user"]["username"]}?utm_source=travellab&utm_medium=referral" style="color:white;">${photo["user"]["name"]}</a> on <a href="https://unsplash.com/?utm_source=travellab&utm_medium=referral" style="color:white;">Unsplash</a></p>` +
                `</div>` +
                `</article>`;
        } else {
            document.getElementById("gallery").innerHTML += `<article class="style1">` +
                `<span class="image">` +
                `<img src="${photo["urls"]["regular"]}" alt="${photo["urls"]["full"]}" />` +
                `</span>` +
                `<div class="content">` +
                `<p>Photo by <a href="https://unsplash.com/@${photo["user"]["username"]}?utm_source=travellab&utm_medium=referral" style="color:white;">${photo["user"]["name"]}</a> on <a href="https://unsplash.com/?utm_source=travellab&utm_medium=referral" style="color:white;">Unsplash</a></p>` +
                `</div>` +
                `</article>`;
        }
    });

    attractions.data.forEach(function (attraction) {
        document.getElementById('attractions').innerHTML += `<h4 style="margin-bottom: 0px;padding-bottom: 0px;"><a href="${attraction["web_url"]}">${attraction["name"]}</a></h4>` +
            `<p style="margin-bottom: 0px;">${attraction["rating"]} / 5.0</p>` +
            `<p style="margin-bottom: 0px;padding-bottom: 1%;">${attraction["address"]}</p>`
        ;

        var distance = haversine(latitude, longitude, attraction["latitude"], attraction["longitude"]);

        if (distance > radius) {
            radius = distance;
        }

        var content = `<h3 style="margin-bottom: 0px;padding-bottom: 2%;"><a href="${attraction["web_url"]}">${attraction["name"]}</a></h3>` +
            `<p style="margin: 0px; display: inline-block;">${attraction["rating"]} stars</p>` +
            `<p style="margin: 0px; display: inline-block;">&nbsp;(${attraction["num_reviews"]} reviews)</p><br/>` +
            `<img src="${attraction["photo"]["images"]["large"]["url"]}" style="width: inherit; height: auto; padding: 3% 0 0 0;"><br/>` +
            `<p style="margin: 0px; display: inline-block;">&nbsp;${attraction["subcategory"][0]["name"]}</p><br/>` +
            `<p style="margin: 0px;">${attraction["phone"]}</p>` +
            `<p style="margin: 0px;">${attraction["address"]}</p>`
        ;

        L.marker([attraction["latitude"], attraction["longitude"]], {icon: goldIcon}).addTo(markerGroup).bindPopup(content);
    });

    restaurants["businesses"].forEach(function (restaurant) {
        document.getElementById('restaurants').innerHTML += `<h4 style="margin-bottom: 0px;">${restaurant["name"]}</h4>` +
            `<p style="margin-bottom: 0px;">${restaurant["rating"]} / 5.0</p>` +
            `<p style="margin-bottom: 0px;padding-bottom: 1%;">${restaurant["location"]["address1"]}</p>`
        ;

        var distance = haversine(latitude, longitude, restaurant["coordinates"]["latitude"], restaurant["coordinates"]["longitude"]);

        if (distance > radius) {
            radius = distance;
        }

        var content = `<h3 style="margin-bottom: 0px;padding-bottom: 2%;"><a href="${restaurant["url"]}">${restaurant["name"]}</a></h3>` +
            `<p style="margin: 0px; display: inline-block;">${restaurant["rating"]} stars</p>` +
            `<p style="margin: 0px; display: inline-block;">&nbsp;(${restaurant["review_count"]} reviews)</p><br/>` +
            `<img src="${restaurant["image_url"]}" style="width: inherit; height: auto; padding: 3% 0 0 0;"><br/>` +
            `<p style="margin: 0px; display: inline-block;">${restaurant["price"]}</p>` +
            `<p style="margin: 0px; display: inline-block;">&nbsp;&bull;&nbsp;${restaurant["categories"][0].title}</p><br/>` +
            `<p style="margin: 0px;">${restaurant["display_phone"]}</p>` +
            `<p style="margin: 0px;">${restaurant["location"]["address1"]}</p>`
        ;

        L.marker([restaurant["coordinates"]["latitude"], restaurant["coordinates"]["longitude"]], {icon: greyIcon}).addTo(markerGroup).bindPopup(content);
    });

    hotels.data.forEach(function (hotel) {
        document.getElementById('hotels').innerHTML += `<h4 style="margin-bottom: 0px;padding-bottom: 0%;">${hotel["name"]}</h4>` +
            `<p style="margin-bottom: 0px;">${hotel["rating"]} / 5.0</p>`
        ;

        if ((hotel["business_listings"]["desktop_contacts"]).length >= 1) {
            document.getElementById('hotels').innerHTML += `<p style="margin-bottom: 0px;padding-bottom: 1%;"><a href="${hotel["business_listings"]["desktop_contacts"][0]["value"]}">View Booking Information</a></p>`;

            content = `<h3 style="margin-bottom: 0px;padding-bottom: 2%;"><a href="${hotel["business_listings"]["desktop_contacts"][0]["value"]}">${hotel["name"]}</a></h3>` +
                `<p style="margin: 0px; display: inline-block;">${hotel["rating"]} stars</p>` +
                `<p style="margin: 0px; display: inline-block;">&nbsp;(${hotel["num_reviews"]} reviews)</p><br/>` +
                `<img src="${hotel["photo"]["images"]["large"]["url"]}" style="width: inherit; height: auto; padding: 3% 0 0 0;"><br/>` +
                `<p style="margin: 0px; display: inline-block;">${hotel["price_level"]}</p>` +
                `<p style="margin: 0px; display: inline-block;">&nbsp;&bull;&nbsp;${hotel["subcategory_type_label"]}</p><br/>`
            ;
        } else {
            document.getElementById('hotels').innerHTML += `<p style="margin-bottom: 0px;padding-bottom: 1%;">Booking Information Not Available</p>`;

            content = `<h3 style="margin-bottom: 0px;padding-bottom: 2%;">${hotel["name"]}</h3>` +
                `<p style="margin: 0px; display: inline-block;">${hotel["rating"]} stars</p>` +
                `<p style="margin: 0px; display: inline-block;">&nbsp;(${hotel["num_reviews"]} reviews)</p><br/>` +
                `<img src="${hotel["photo"]["images"]["large"]["url"]}" style="width: inherit; height: auto; padding: 3% 0 0 0;"><br/>` +
                `<p style="margin: 0px; display: inline-block;">${hotel["price_level"]}</p>` +
                `<p style="margin: 0px; display: inline-block;">&nbsp;&bull;&nbsp;${hotel["subcategory_type_label"]}</p><br/>`
            ;
        }

        var distance = haversine(latitude, longitude, hotel["latitude"], hotel["longitude"]);

        if (distance > radius) {
            radius = distance;
        }

        L.marker([hotel["latitude"], hotel["longitude"]], {icon: violetIcon}).addTo(markerGroup).bindPopup(content);
    });

    circle_marker = new L.circle([latitude, longitude], radius + 250).addTo(map);
    map.addLayer(circle_marker);

    map.setView([latitude, longitude], 12);
};