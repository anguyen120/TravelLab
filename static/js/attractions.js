(function () {
    attractions.data.forEach(function (attraction) {
        document.getElementById('attractions').innerHTML += `<h2 style="margin-bottom: 0px;padding-bottom: 2%;">${attraction["name"]}</h2>` +
            `<span class="image main" style="margin-bottom: 0;padding-bottom: 2%;width:inherit;overflow: hidden;"><img src="${attraction["photo"]["images"]["original"]["url"]}" alt="" style="margin:-21.875% 0;"></span>` +
            `<p style="margin-bottom: 0px;"><b>${attraction["rating"]} / 5.0</b></p>` +
            `<p style="margin-bottom: 0px;"><b>${attraction["address"]}</b></p>` +
            `<p style="margin-bottom: 0px;padding-bottom: 1%;">${attraction["description"]}</p>` +
            `<p style="margin-bottom: 0px;padding-bottom: 5%;"><a href="${attraction["web_url"]}">View on TripAdvisor</a></p>`
        ;
        return;
    });
})();