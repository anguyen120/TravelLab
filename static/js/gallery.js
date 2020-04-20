window.onload = function () {
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
};