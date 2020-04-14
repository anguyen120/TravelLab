/* References:
 * https://www.w3schools.com/jsref/event_oninput.asp
 * https://stackoverflow.com/questions/43645790/passing-javascript-variable-to-python-flask
 */

document.getElementById('from_location').addEventListener('input', from_autocomplete);
document.getElementById('to_location').addEventListener('input', to_autocomplete);

function from_autocomplete() {
    var from_location = document.getElementById('from_location').value;
    if (from_location.length > 2) {
        $.ajax({
            url: '/',
            type: 'POST',
            data: {location: from_location}
        })
            .done(function (result) {
                var from_suggestions = new Array();
                var options = '';
                result.forEach(function (airport) {
                    options += '<option value="' + airport["detailedName"] + '" />';
                });
                document.getElementById('from_airports').innerHTML = options;
            })
    }
};

function to_autocomplete() {
    var to_location = document.getElementById('to_location').value;
    if (to_location.length > 2) {
        $.ajax({
            url: '/',
            type: 'POST',
            data: {location: to_location}
        })
            .done(function (result) {
                var options = '';
                result.forEach(function (airport) {
                    options += '<option value="' + airport["detailedName"] + '" />';
                });
                document.getElementById('to_airports').innerHTML = options;
            })
    }
};