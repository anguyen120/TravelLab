(function () {
    console.log(attractions);
    attractions.data.forEach(function (attraction) {
        var star_img_path = "/static/images/";
        if (attraction["rating"] >= 0 && attraction["rating"] <= 1) {
            star_img_path += "1_star.png";
        }
        else if (attraction["rating"] > 1 && attraction["rating"] <= 2) {
            star_img_path += "2_stars.png";
        }
        else if (attraction["rating"] > 2 && attraction["rating"] <= 3) {
            star_img_path += "3_stars.png";
        }
        else if (attraction["rating"] > 3 && attraction["rating"] <= 4) {
            star_img_path += "4_stars.png";
        }
        else if (attraction["rating"] > 4 && attraction["rating"] <= 5) {
            star_img_path += "5_stars.png";
        }


        document.getElementById('attractions').innerHTML += `<h2 style="margin-bottom: 0px;padding-bottom: 2%;">${attraction["name"]}</h2>` +
            `<span class="image main" style="margin-bottom: 2%;padding-bottom: 2%;width:inherit;overflow: hidden;"><img src="${attraction["photo"]["images"]["original"]["url"]}" alt="" style="margin:-21.875% 0;"></span>`+
            `<img src="${star_img_path}" height="20">` +
            `<p style="margin-bottom: 0px;"><b>${attraction["rating"]} / 5.0</b></p>` +
            `<p style="margin-bottom: 0px;"><b>${attraction["address"]}</b></p>` +
            `<p style="margin-bottom: 0px;padding-bottom: 1%;">${attraction["description"]}</p>` +
            `<p style="margin-bottom: 0px;padding-bottom: 5%;"><a href="${attraction["web_url"]}">View on TripAdvisor</a></p>`
        ;
        return;
    });
})();