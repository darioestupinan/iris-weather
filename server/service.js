'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const config = require('../config');

function getLocation(req, res) {

     return request
        .get(config.endpoints.openWeather)
        .query({ q: req.params.location, appid: config.openWeatherKey})
        .end((err, response) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }

            return res.json({result: `${response.body.weather[0].description} and a temperature of ${convertFromKelvin(response.body.main.temp)} celsius at ${response.body.name}, ${response.body.sys.country}`});
        });
}

function convertFromKelvin(kelvin) {
    return kelvin - 273.15;
}

service.get('/service/:location', (req, res, next) => {
    getLocation(req, res);
});

module.exports = service;