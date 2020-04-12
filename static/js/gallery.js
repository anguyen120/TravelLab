window.onload = function () {
    photos.forEach(function (photo) {
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
};