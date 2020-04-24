


(function () {
    hotels.data.forEach(function (hotel) {

        var rating_image;
        if(hotel["rating"]>=0 && hotel["rating"]<=1)
        {
            rating_image ="/static/images/1_star.png";
        }
        else if(hotel["rating"]>1 && hotel["rating"]<=2)
        {
            rating_image ="/static/images/2_stars.png";
        }
        else if(hotel["rating"]>2 && hotel["rating"]<=3)
        {
            rating_image ="/static/images/3_stars.png";
        }
        else if(hotel["rating"]>3 && hotel["rating"]<=4)
        {
            rating_image ="/static/images/4_stars.png";
        }
        else if(hotel["rating"]>4 && hotel["rating"]<=5)
        {
            rating_image ="/static/images/5_stars.png";
        }
        else
        {
            console.log("hotel rating image error");
        }


        var location_id = hotel["location_id"];
        console.log(location_id);
        var review_div = location_id + "_div";
        document.getElementById('hotels').innerHTML += `<h2 style="margin-bottom: 0px;padding-bottom: 2%;">${hotel["name"]}</h2>` +
            `<span class="image main" style="margin-bottom: 0;padding-bottom: 2%;width:inherit;overflow: hidden;"><img src="${hotel["photo"]["images"]["original"]["url"]}" alt="" style="margin:-21.875% 0;"></span>` +
            `<img src = "${rating_image}" height = "20">`+
            `<p style="margin-bottom: 0px;"><b>${hotel["rating"]} / 5.0</b></p>`+
            `<p style="margin-bottom: 0px;"> <b>${hotel["location_string"]}</b></p>`+
            `<p style="margin-bottom: 0px;"><b>Price Range ${hotel["price"]}</b></p>`+
            `<p style="margin-bottom: 0px;"><b>Ranked ${hotel["ranking"]}</b></p>`+
            `<button type="button" style="margin-bottom: 2%; margin-top: 2%;" id="${location_id}" onclick ="getReviews('${location_id}'); this.onclick=null;">View Reviews</button>`
            // `<div id="${review_div}" style="padding-bottom: 5%;"></div>`
        ;

        if((hotel["special_offers"]["desktop"]).length >= 1)
        {
             document.getElementById('hotels').innerHTML += `<p style="margin-bottom: 0px;">Speical Promo: ${hotel["special_offers"]["desktop"][0]["headline"]} <a href="${hotel["special_offers"]["desktop"][0]["url"]}">Click Here</a></p>`;
        }

        if ((hotel["business_listings"]["desktop_contacts"]).length >= 1 && (hotel["business_listings"]["desktop_contacts"][0]["type"]).localeCompare("url") == 0 && (hotel["business_listings"]["desktop_contacts"][0]["label"]).localeCompare("Hotel website") ==0) {
            document.getElementById('hotels').innerHTML += `<p style="margin-bottom: 0px;padding-bottom: 5%;"><a href="${hotel["business_listings"]["desktop_contacts"][0]["value"]}">View on TripAdvisor</a></p>`;
        } else {
            document.getElementById('hotels').innerHTML += `<p style="margin-bottom: 0px;padding-bottom: 5%;">Booking Information Not Available</p>`;
        }
        return;
    });
})();

document.getElementById('hotels').innerHTML+= `<button type="button" style="margin-bottom: 2%; margin-top: 2%; margin-right: 2%" id="pageNavigation" onclick ="loadPreviousPage(1); this.onclick=null;"> < </button>`;
document.getElementById('hotels').innerHTML+= `<button type="button" style=margin-bottom: 2%; margin-top: 2%; margin-right: 2% margin-left: 2% id="pageNavigation"> 1 </button>`;
document.getElementById('hotels').innerHTML+= `<button type="button" style="margin-bottom: 2%; margin-top: 2%; margin-left: 2%" id="pageNavigation" onclick ="loadNextPage(1); this.onclick=null;"> > </button>`;

function loadNextPage(pageNumber)
{
    console.log("next button");
}
function loadPreviousPage(pageNumber)
{
    console.log("back button");
}
function getReviews(location_id)
{
    console.log("getting"+location_id);
    $.ajax({
        url: '/hotels',
        type: 'POST',
        data: {location_id: location_id}
    })
        .done(function (response) {

        console.log(response);
        var div_id = location_id + "_div";
        var reviews = document.getElementById(div_id);

        reviews.innerHTML += `<h3 style="margin-bottom: 0px;padding-bottom: 2%;">Reviews</h3>`;
        response["data"].forEach(function(review)
        {
            var rating_image;
            if(review["rating"]>=0 && review["rating"]<=1)
            {
                rating_image ="/static/images/1_star.png";
            }
            else if(review["rating"]>1 && review["rating"]<=2)
            {
                rating_image ="/static/images/2_stars.png";
            }
            else if(review["rating"]>2 && review["rating"]<=3)
            {
                rating_image ="/static/images/3_stars.png";
            }
            else if(review["rating"]>3 && review["rating"]<=4)
            {
                rating_image ="/static/images/4_stars.png";
            }
            else if(review["rating"]>4 && review["rating"]<=5)
            {
                rating_image ="/static/images/5_stars.png";
            }
            else
            {
                console.log("hotel rating image error");
            }
            reviews.innerHTML += `<img src="${rating_image}" height="20">` +
                    `<p style="margin-bottom: 0px;"><b>${review["rating"]} / 5</b></p>` +
                    `<p style="margin-bottom: 0px;">${review["text"]}`+
                    `<p style="margin-bottom: 0px;padding-bottom: 2%;"><a href="${review["url"]}">See full review</a></p>`

        });

    })
}