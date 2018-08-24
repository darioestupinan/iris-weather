'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const config = require('../config');
const moment = require('moment');

function getLocation(req, res) {

     return request
        .get(config.endpoints.geocodeApi)
        .query({ address: req.params.location, key: config.geocodingKey})
        .end((err, response) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }

            return getTime({value: response.body.results[0].geometry.location}, res);
        });
}

function getTime(location, res) {
    const timestamp = +moment().format('X');
    const url = config.endpoints.timezoneApi;
    const latlng = `${location.value.lat},${location.value.lng}`;

    request.get(url)
        .query({
            location: latlng,
            timestamp: timestamp,
            key: config.geocodingKey
        })
        .end((err, response) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }

            const result = response.body;
            const timeString = moment
                .unix(timestamp + result.dstOffset + result.rawOffset)
                .utc()
                .format(config.dateFormat);
            return {value: res.json({result: timeString}) };
        });
}

service.get('/service/:location', (req, res, next) => {
    getLocation(req, res);
});

module.exports = service;