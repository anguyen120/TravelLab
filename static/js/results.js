window.onload = function () {
    attractions.data.forEach(function (attraction) {
        document.getElementById('attractions').innerHTML += `<h4 style="margin-bottom: 0px;padding-bottom: 2%;"><a href="${attraction["web_url"]}">${attraction["name"]}</a></h4>` +
            `<p style="margin-bottom: 0px;">${attraction["rating"]} / 5.0</p>` +
            `<p style="margin-bottom: 0px;padding-bottom: 5%;">${attraction["address"]}</p>`
        ;

        return;
    });

    restaurants["businesses"].forEach(function (restaurant) {
        document.getElementById('restaurants').innerHTML += `<h4 style="margin-bottom: 0px;padding-bottom: 2%;">${restaurant["name"]}</h4>` +
            `<p style="margin-bottom: 0px;">${restaurant["rating"]} / 5.0</p>` +
            `<p style="margin-bottom: 0px;padding-bottom: 5%;">${restaurant["location"]["display_address"]}</p>`
        ;
        return;
    });

    photos["results"].forEach(function (photo) {
        document.getElementById("gallery").innerHTML += `<article class="style1">` +
            `<span class="image">` +
            `<img src="${photo["urls"]["regular"]}" alt="${photo["urls"]["full"]}" />` +
            `</span>` +
            `<div class="content">` +
            `<p>Photo by <a href="https://unsplash.com/@${photo["user"]["username"]}?utm_source=travellab&utm_medium=referral">${photo["user"]["name"]}</a> on <a href="https://unsplash.com/?utm_source=travellab&utm_medium=referral">Unsplash</a></p>` +
            `</div>` +
            `</article>`
        ;
    });

    hotels.data.forEach(function (hotel) {
        document.getElementById('hotels').innerHTML += `<h4 style="margin-bottom: 0px;padding-bottom: 1%;">${hotel["name"]}</h4>` +
            `<p style="margin-bottom: 0px;">${hotel["rating"]} / 5.0</p>`
        ;

        if ((hotel["business_listings"]["desktop_contacts"]).length >= 1) {
            document.getElementById('hotels').innerHTML += `<p style="margin-bottom: 0px;padding-bottom: 5%;"><a href="${hotel["business_listings"]["desktop_contacts"][0]["value"]}">View Booking Information</a></p>`;
        } else {
            document.getElementById('hotels').innerHTML += `<p style="margin-bottom: 0px;padding-bottom: 5%;">Booking Information Not Available</p>`;
        }

        return;
    });
};