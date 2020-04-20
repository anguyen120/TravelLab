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

        document.getElementById('restaurants').innerHTML += `<h2 style="margin-bottom: 0px;padding-bottom: 2%;">${restaurant["name"]}</h2>` +
            `<span class="image main" style="margin-bottom: 2%;padding-bottom: 2%;width:inherit;overflow: hidden; "><img src="${restaurant["image_url"]}" alt="" style="margin:-21.875% 0;"></span>` +
            `<img src="${star_img_path}" height="20">` +
            `<p style="margin-bottom: 0px;"><b>${restaurant["rating"]} / 5 - ${restaurant["review_count"]} Reviews</b></p>` +
            `<p style="margin-bottom: 0px;"><b>${restaurant["location"]["display_address"]}</b></p>` +
            `<p style="margin-bottom: 0px;"><b>${category_string}</b></p>` +
            `<p style="margin-bottom: 0px;padding-bottom: 5%;"><a href="${restaurant["url"]}">View on Yelp</a></p>`
        ;
        return;
    });
})();