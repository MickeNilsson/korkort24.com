let aktier = 1000000;
let sparkonton = 2000000;
let utgifter = 17000;
let kvar = aktier + sparkonton;
let month = 1;


while (month <= 12 * 12) {

    if (sparkonton > utgifter) {
        // Dra först av en månads utgifter från sparkonton
        sparkonton = sparkonton - utgifter;
    } else {
        aktier = aktier - utgifter;
    }

    // Om det har gått ett år...
    if (month % 12 === 0) {
        // ... öka värdet på aktier med 6% och sparkonton med 3%.
        aktier = aktier * 1.06;

        // Subtrahera en schablonskatt på 1% på aktiekapitalet över 300000kr
        let schablonskatt = (aktier - 300000) * 0.01;

        aktier = aktier - schablonskatt;

        // Addera räntan på sparkontona minus skatten på 30%.
        sparkonton = sparkonton + (sparkonton * 0.03) * 0.7;
    }



    console.log('Kapital efter ' + month + ' månader (' + month / 12 + ' år):');
    console.log('Aktier: ' + aktier + ' kr');
    console.log('Sparkonton: ' + sparkonton + ' kr');

    month++;
}

