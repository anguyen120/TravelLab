(function () {
    console.log(attractions);
    const app = document.getElementById('attr_results');
    const container = document.createElement('div');
    container.setAttribute('class', 'container');

    attractions.data.forEach(function (attraction) {
        //const card = document.createElement('div');
        //card.setAttribute('class','card');
        var h1 = document.createElement('h2');
        h1.textContent = attraction["name"];
        var addr = document.createElement('p');
        addr.textContent = attraction["address"];
        var description = document.createElement('p');
        description.textContent = attraction["description"];
        var rating = document.createElement('p');
        rating.textContent = attraction["rating"] + " / 5.0";
        var a = document.createElement('a');
        var link = document.createTextNode("View on TripAdvisor");
        a.appendChild(link);
        a.title = "View on TripAdvisor";
        a.href = attraction["web_url"];
        app.appendChild(container);
        container.appendChild(h1);
        container.appendChild(addr);
        container.appendChild(description)
        container.appendChild(rating);
        container.appendChild(a);

        return;
    });
})();