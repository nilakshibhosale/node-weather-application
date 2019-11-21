const request = require('request')
const forcast = (latitude, longitude, callback) => {
    const url =
        "https://api.darksky.net/forecast/0bc2371f962a607f3971b6150adf2a2e/" + latitude + "," + longitude;
    request({
        url,
        json: true
    }, (error, {
        body
    }) => {
        if (error) {
            callback("unable to connect!", undefined);
        } else if (body.error) {
            callback("something wrong");
        } else {
            if (body && body.minutely) {
                callback(undefined,
                    body.minutely.summary +
                    " " +
                    body.minutely.data[0].precipProbability
                );
            } else {
                callback(undefined,
                    body.hourly.data[0].summary +
                    " " +
                    body.hourly.data[0].precipProbability
                );
            }
        }
    })
}
module.exports = forcast