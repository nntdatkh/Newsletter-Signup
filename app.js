const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { urlencoded } = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    app.post("/failure", function(req, res) {
        res.redirect("/");
    });

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/fde85cbb59";

    const options = {
        method: "POST",
        auth: "nntdat:d8dbc9c12015231adcf7237f393a92fd-us14"
    }

    const request = https.request(url, options, function(response) {

        response.on("data", function(data) {
            let jsonResponse  = JSON.parse(data);
            console.log(JSON.parse(data));

            if (jsonResponse.error_count === 0) {
                res.sendFile(__dirname + "/success.html");
            }
            else {
                res.sendFile(__dirname + "/failure.html");
            }
        })
    });

    request.write(jsonData);
    request.end()
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000...");
    
});


// API Key
// d8dbc9c12015231adcf7237f393a92fd-us14

// List ID
// fde85cbb59