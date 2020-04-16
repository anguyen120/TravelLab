(function () {
    hotels.data.forEach(function (hotel) {
        document.getElementById('hotels').innerHTML += `<h2 style="margin-bottom: 0px;padding-bottom: 2%;">${hotel["name"]}</h2>` +
            `<span class="image main" style="margin-bottom: 0;padding-bottom: 2%;width:inherit;overflow: hidden;"><img src="${hotel["photo"]["images"]["original"]["url"]}" alt="" style="margin:-21.875% 0;"></span>` +
            `<p style="margin-bottom: 0px;"><b>${hotel["rating"]} / 5.0</b></p>`
        ;

        if ((hotel["business_listings"]["desktop_contacts"]).length >= 1) {
            document.getElementById('hotels').innerHTML += `<p style="margin-bottom: 0px;padding-bottom: 5%;"><a href="${hotel["business_listings"]["desktop_contacts"][0]["value"]}">View Booking Information</a></p>`;
        } else {
            document.getElementById('hotels').innerHTML += `<p style="margin-bottom: 0px;padding-bottom: 5%;">Booking Information Not Available</p>`;
        }

        return;
    });
})();