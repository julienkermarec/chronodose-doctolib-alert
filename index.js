const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors');
const fetch = require('node-fetch');

FIREBASE_CLOUD_MESSAGING_SERVER_KEY = "XXXX";
USER_FCM_TOKEN = "XXXX";
DOCTOLIB_VILLE_JSON_URL = "https://www.doctolib.fr/vaccination-covid-19/rennes.json?ref_visit_motive_ids%5B%5D=6970&ref_visit_motive_ids%5B%5D=7005";

app.use(
    bodyParser.json(),
    cors({
        credentials: true,
        origin: true
    })
);
app.options('*', cors());


app.listen(process.env.PORT || 3000, function () {
    console.log('server running on port 3000', '');
});

app.get('/', async (req, res) => {

    res.status(200).send({ response: 'Welcome to chronodose custom API' });
})



const sleep = m => new Promise(r => setTimeout(r, m))

async function sendNotif(to, title, text) {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'post',
        body: JSON.stringify({ "to": to, "notification": { "sound": "default", "title": title, "body": text, "content_available": true, "priority": "high" }, "data": { "sound": "default", "body": "test body", "title": "test title", "content_available": true, "priority": "high" } }),
        headers: { 'Content-Type': 'application/json', 'Authorization': 'key=' + FIREBASE_CLOUD_MESSAGING_SERVER_KEY }
    });
    await response.json();
}

async function createAlert(title, texte) {
    await sendNotif(USER_FCM_TOKEN, title, texte);
}

async function main() {
    console.log('\x07');
    while (1) {
        // RENNES
        let url = DOCTOLIB_VILLE_JSON_URL;
        await fetch(url)
            .then(res => res.json())
            .then(
                async (rennes) => {

                    await sleep(1000);
                    // console.log('json', rennes);
                    console.log('Nombre de centres ', rennes.data.doctors.length);
                    for (let doctor of rennes.data.doctors) {
                        // CHRONODOSE => force_max_limit = 2
                        url = "https://www.doctolib.fr/search_results/" + doctor.id + ".json?ref_visit_motive_ids%5B%5D=6970&ref_visit_motive_ids%5B%5D=7005&speciality_id=5494&search_result_format=json&limit=3&force_max_limit=2";
                        await fetch(url)
                            .then(res => res.json())
                            .then(
                                async (json) => {
                                    // On réduit les nom de centre a rallonge (pour la taille du titre de la notif)
                                    let last_name = doctor.last_name.replace("Centre de vaccination", "").replace("Centres de vaccination", "").replace("19 - ", "").replace("19 de ", "").replace("Covid-", "").replace("covid-", "").replace("COVID-19", "").replace("COVID", "");
                                    let name = last_name + "," + doctor.address + "," + doctor.city;
                                    if (json.reason != "no_availabilities") {
                                        console.log("doctor", doctor);
                                        subtitle = json.availability ? JSON.stringify(json.availability) : json.reason;
                                        if (json.availabilities) {
                                            for (let availability of json.availabilities) {
                                                if (availability.slots && availability.slots.length > 0) {
                                                    subtitle = doctor.zipcode + " - " + availability.slots[0].start_date;
                                                    break;
                                                }

                                            }
                                        }
                                        createAlert(name, subtitle)
                                        console.log("json", JSON.stringify(json.availabilities));
                                        console.log('\x07');
                                        console.log('\x07');
                                        console.log('\x07');
                                    }
                                    console.log(new Date().toLocaleTimeString() + " -" + name + "" + "\n  -> " + (json.reason ? json.reason : json.availabilities[0].date));
                                }
                            );

                        await sleep(1000);
                    }

                }
            );

    }
}

main();