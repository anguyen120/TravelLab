(function () {
    restaurants["businesses"].forEach(function (restaurant) {
        var categories = [];
        restaurant["categories"].forEach(function (category){
            categories.push(category["title"]);
        });
        var category_string = restaurant["price"] + " - ";
        var i;
        for (i=0; i < categories.length; i++) {
            category_string += categories[i];
            if (i != categories.length - 1) {
                category_string += " - ";
            }
        }
        var star_img_path = "/static/images/";
        if (restaurant["rating"] >= 0 && restaurant["rating"] <= 1) {
            star_img_path += "1_star.png";
        }
        else if (restaurant["rating"] > 1 && restaurant["rating"] <= 2) {
            star_img_path += "2_stars.png";
        }
        else if (restaurant["rating"] > 2 && restaurant["rating"] <= 3) {
            star_img_path += "3_stars.png";
        }
        else if (restaurant["rating"] > 3 && restaurant["rating"] <= 4) {
            star_img_path += "4_stars.png";
        }
        else if (restaurant["rating"] > 4 && restaurant["rating"] <= 5) {
            star_img_path += "5_stars.png";
        }

        var restaurant_html_id = restaurant["id"];
        var review_div = restaurant_html_id + "_div";
        document.getElementById('restaurants').innerHTML += `<h2 style="margin-bottom: 0px;padding-bottom: 2%;">${restaurant["name"]}</h2>` +
            `<span class="image main" style="margin-bottom: 2%;padding-bottom: 2%;width:inherit;overflow: hidden; "><img src="${restaurant["image_url"]}" alt="" style="margin:-21.875% 0;"></span>` +
            `<img src="${star_img_path}" height="20">` +
            `<p style="margin-bottom: 0px;"><b>${restaurant["rating"]} / 5 - ${restaurant["review_count"]} Reviews</b></p>` +
            `<p style="margin-bottom: 0px;"><b>${restaurant["location"]["display_address"]}</b></p>` +
            `<p style="margin-bottom: 0px;"><b>${category_string}</b></p>` +
            `<p style="margin-bottom: 0px;padding-bottom: 0%;"><a href="${restaurant["url"]}">View on Yelp</a></p>` +
            `<button type="button" style="margin-bottom: 2%; margin-top: 2%;" id="${restaurant_html_id}" onclick="getReviews('${restaurant_html_id}'); this.onclick=null;">View Reviews</button>` +
            `<div id="${review_div}" style="padding-bottom: 5%;"></div>`
        ;
        return;
    });
})();

function getReviews(restaurant_html_id){
    $.ajax({
        url: '/restaurants',
        type: 'POST',
        data: {location: restaurant_html_id}
    })
        .done(function (result) {
            var div_id = restaurant_html_id + "_div";
            var reviews = document.getElementById(div_id);

            reviews.innerHTML += `<h3 style="margin-bottom: 0px;padding-bottom: 2%;">Reviews</h3>`;
            result["reviews"].forEach(function(review) {
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
                    `<p style="margin-bottom: 0px;padding-bottom: 2%;"><a href="${review["url"]}">${review["text"]}</a></p>`
            });
        })
};