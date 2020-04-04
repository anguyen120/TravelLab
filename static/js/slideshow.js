/*
	Eventually by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function () {

    "use strict";

    var $body = document.querySelector('body');

    // Slideshow Background.
    (function () {

        // Settings.
        var settings = {

            // Images (in the format of 'url': 'alignment').
            images: {},
            credits: [],
            // Delay.
            delay: 6000

        };

        photos.forEach(function (photo) {
            settings["images"][photo["urls"]["regular"]] = 'center';
            settings["credits"].push({"username": [photo["user"]["username"]], "name": [photo["user"]["name"]]});
        });

        // Vars.
        var pos = 0, lastPos = 0,
            $wrapper, $bgs = [], $bg,
            k, v;

        // Create BG wrapper, BGs.
        $wrapper = document.createElement('div');
        $wrapper.id = 'bg';
        $body.appendChild($wrapper);

        for (k in settings.images) {

            // Create BG.
            $bg = document.createElement('div');
            $bg.style.backgroundImage = 'url("' + k + '")';
            $bg.style.backgroundPosition = settings.images[k];
            $wrapper.appendChild($bg);

            // Add it to array.
            $bgs.push($bg);

        }

        // Main loop.
        $bgs[pos].classList.add('visible');
        $bgs[pos].classList.add('top');

        document.getElementById("photo_credit").innerHTML = `Photo by <a href="https://unsplash.com/@${settings["credits"][pos]["username"]}?utm_source=travellab&utm_medium=referral">${settings["credits"][pos]["name"]}</a> on <a href="https://unsplash.com/?utm_source=travellab&utm_medium=referral">Unsplash</a>`;

        // Bail if we only have a single BG or the client doesn't support transitions.
        var transitionsSupported = ('transition' in document.documentElement.style) || ('WebkitTransition' in document.documentElement.style);
        if ($bgs.length == 1
            || !transitionsSupported)
            return;

        window.setInterval(function () {

            lastPos = pos;
            pos++;

            // Wrap to beginning if necessary.
            if (pos >= $bgs.length)
                pos = 0;

            // Swap top images.
            $bgs[lastPos].classList.remove('top');
            $bgs[pos].classList.add('visible');
            $bgs[pos].classList.add('top');

            // Hide last image after a short delay.
            window.setTimeout(function () {
                $bgs[lastPos].classList.remove('visible');
                document.getElementById("photo_credit").innerHTML = `Photo by <a href="https://unsplash.com/@${settings["credits"][pos]["username"]}?utm_source=travellab&utm_medium=referral">${settings["credits"][pos]["name"]}</a> on <a href="https://unsplash.com/?utm_source=travellab&utm_medium=referral">Unsplash</a>`;
            }, settings.delay / 2);

        }, settings.delay);
    })();
})();