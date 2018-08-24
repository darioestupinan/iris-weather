'use strict';

const service = require('../server/service');
const http = require('http');
const request = require('superagent');

const server = http.createServer(service);
server.listen();

server.on('listening', () => {
    console.log(`Iris Weather is listening on port ${server.address().port} in ${service.get('env')} mode.`);

    const announce = () => {
        const endpoint = `http://127.0.0.1:3000/service/time/${server.address().port}`;
        request.put(endpoint, (err,res) => {
            if (err){
                console.log(err);
                console.log("Error connecting to Iris");
                return;
            }
            console.log(res.body);
        });
    };
    announce();
    setInterval(announce, 15*1000);
});