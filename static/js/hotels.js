


function loadHotelPage() {
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
            `<span class="image main" style="margin-bottom: 1%;width:inherit;overflow: hidden; "><img src="${hotel["photo"]["images"]["original"]["url"]}" alt="" style="margin:-21.875% 0;"></span>` +
            `<img src = "${rating_image}" height = "20">`+
            `<p style="margin-bottom: 0px;"><b>${hotel["rating"]} / 5.0</b></p>`+
            `<p style="margin-bottom: 0px;"> <b>${hotel["location_string"]}</b></p>`+
            `<p style="margin-bottom: 0px;"><b>Price Range ${hotel["price"]}</b></p>`+
            `<p style="margin-bottom: 0px;"><b>Ranked ${hotel["ranking"]}</b></p>`

        ;

        if((hotel["special_offers"]["desktop"]).length >= 1)
        {
             document.getElementById('hotels').innerHTML += `<p style="margin-bottom: 0px;">Speical Promo: ${hotel["special_offers"]["desktop"][0]["headline"]} <a href="${hotel["special_offers"]["desktop"][0]["url"]}">Click Here</a></p>`;
        }

        if ((hotel["business_listings"]["desktop_contacts"]).length >= 1 && (hotel["business_listings"]["desktop_contacts"][0]["type"]).localeCompare("url") == 0 && (hotel["business_listings"]["desktop_contacts"][0]["label"]).localeCompare("Hotel website") ==0) {
            document.getElementById('hotels').innerHTML += `<p style="margin-bottom: 0px;"><a href="${hotel["business_listings"]["desktop_contacts"][0]["value"]}">View on TripAdvisor</a></p>`;
        } else {
            document.getElementById('hotels').innerHTML += `<p style="margin-bottom: 0px;">Booking Information Not Available</p>`;
        }
        document.getElementById('hotels').innerHTML +=
            `<button type="button" style="margin-bottom: 2%; margin-top: 2%;" id="${location_id}" onclick ="getReviews('${location_id}'); this.onclick=null;">View Reviews</button>` +
            `<div id="${review_div}" style="padding-bottom: 5%;"></div>`;

        return;
    });
}
//actuall call is here

// document.getElementById('hotels').innerHTML+= `<button >Filter Options</button>`;
// document.getElementById('hotels').innerHTML+= `<button onclick = "showFilterBox()">Filter Options</button>`;


loadHotelPage();

var hotelPageNumber = hotelPageInfo["pageNumber"];

document.getElementById('hotels').innerHTML+= `<button type="button" style="margin-bottom: 2%; margin-top: 2%; margin-right: 2%" id="pageBack" onclick ="loadPreviousPage(1); this.onclick=null;"> < </button>`;
document.getElementById('hotels').innerHTML+= `<button type="button" style=margin-bottom: 2%; margin-top: 2%; margin-right: 2% margin-left: 2% id="pageCounter"> ${hotelPageInfo["pageNumber"]} </button>`;
document.getElementById('hotels').innerHTML+= `<button type="button" style="margin-bottom: 2%; margin-top: 2%; margin-left: 2%" id="pageNext" onclick =loadNextPage(1); this.onclick=null;"> > </button>`;


if(hotelPageInfo["pageNumber"] == 1)
{
    document.getElementById("pageBack").disabled = true;
}


// function showFilterBox()
// {
//     document.getElementById("dropDownBox").classList.toggle("show");
// }
function loadNextPage(pageNumber)
{
    console.log("next button");
    hotelPageNumber = hotelPageNumber + 1;
    location.replace("hotels?to_location=" + hotelPageInfo["to_location"].toString() +
                            "&depart_date=" + hotelPageInfo["depart_date"].toString() +
                            "&return_date=" + hotelPageInfo["return_date"] +
                            "&pageNumber="+hotelPageNumber.toString());
}
function loadPreviousPage(pageNumber)
{
    console.log("back button");
    hotelPageNumber = hotelPageNumber - 1;
    location.replace("hotels?to_location=" + hotelPageInfo["to_location"].toString() +
                            "&depart_date=" + hotelPageInfo["depart_date"].toString() +
                            "&return_date=" + hotelPageInfo["return_date"] +
                            "&pageNumber="+hotelPageNumber.toString());
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