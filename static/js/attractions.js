(function () {
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

        var lowest_offer = attraction["offer_group"]["offer_list"][0]["price"];
        var lowest_offer_url = "";
        attraction["offer_group"]["offer_list"].forEach(function(offer) {
            if (offer["price"] < lowest_offer) {
                lowest_offer = offer["price"];
                lowest_offer_url = offer["url"];
            }
        });

        var attraction_html_id = attraction["location_id"];
        var review_div = attraction_html_id + "_div";
        document.getElementById('attractions').innerHTML += `<h2 style="margin-bottom: 0px;padding-bottom: 2%;">${attraction["name"]}</h2>` +
            `<span class="image main" style="margin-bottom: 2%;padding-bottom: 2%;width:inherit;overflow: hidden;"><img src="${attraction["photo"]["images"]["original"]["url"]}" alt="" style="margin:-21.875% 0;"></span>`+
            `<img src="${star_img_path}" height="20">` +
            `<p style="margin-bottom: 0px;"><b>${attraction["rating"]} / 5</b></p>` +
            `<p style="margin-bottom: 0px;"><b>${attraction["address"]}</b></p>` +
            `<p style="margin-bottom: 0px;"><a href="${lowest_offer_url}">Offers from ${lowest_offer}</a></p>` +
            `<p style="margin-bottom: 0px;padding-bottom: 1%;">${attraction["description"]}</p>` +
            `<p style="margin-bottom: 0px;padding-bottom: 0%;"><a href="${attraction["web_url"]}">View on TripAdvisor</a></p>` +
            `<button type="button" style="margin-bottom: 2%; margin-top: 2%;" id="${attraction_html_id}" onclick="getReviews('${attraction_html_id}'); this.onclick=null;">View Reviews</button>` +
            `<div id="${review_div}" style="padding-bottom: 5%;"></div>`
        ;
        return;
    });
})();

function getReviews(attraction_html_id){
    $.ajax({
        url: '/attractions',
        type: 'POST',
        data: {location: attraction_html_id}
    })
        .done(function (result) {
            var div_id =attraction_html_id + "_div";
            var reviews = document.getElementById(div_id);

            reviews.innerHTML += `<h3 style="margin-bottom: 0px;padding-bottom: 2%;">Reviews</h3>`;
            console.log(result)
            result.data.forEach(function(review) {
                var star_img_path = "/static/images/";
                if (review["rating"] >= 0 && review["rating"] <= 1) {
                    star_img_path += "1_star.png";
                }
                else if (review["rating"] > 1 && review["rating"] <= 2) {
                    star_img_path += "2_stars.png";
                }
                else if (review["rating"] > 2 && review["rating"] <= 3) {
                    star_img_path += "3_stars.png";
                }
                else if (review["rating"] > 3 && review["rating"] <= 4) {
                    star_img_path += "4_stars.png";
                }
                else if (review["rating"] > 4 && review["rating"] <= 5) {
                    star_img_path += "5_stars.png";
                }

                reviews.innerHTML += `<img src="${star_img_path}" height="20">` +
                    `<p style="margin-bottom: 0px;"><b>${review["rating"]} / 5</b></p>` +
                    `<p style="margin-bottom: 0px;padding-bottom: 2%;">${review["text"]}</p>`
                ;

            });
        })
};