/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require("express");
/*
 * Alustetaan sovellus, joka hyödyntää express-frameworkia
 */
var app = express();
var expressWs = require('express-ws')(app);
/*
 * Sovelluksen käytössä resurssit, jotka löytyvät public-kansiosta
 */
app.use(express.static('public'));

app.set('port', (process.env.PORT || 8081));

setInterval(function() {
    var heartbeat = {
        type: 'heartbeat',
        content: 'heartbeat'
    };
    expressWs.getWss().clients.forEach(function(client) {
        client.send(JSON.stringify(heartbeat));
    });
}, 10000);

/*
 * Routing
 */
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.ws('/echo', function (ws, req) {
    ws.on('message', function (msg) {
        console.log(JSON.parse(msg).sender + " " + JSON.parse(msg).content +
                " " + JSON.parse(msg).date);
        expressWs.getWss().clients.forEach(function (client) {
           // console.log(client['upgradeReq']['headers']['sec-websocket-key']);
            client.send(msg);
        });
    });
    ws.on('close', function() {
        console.log("Connection closed.");
    });
});

/*
 * Alustetaan palvelin
 */
var server = app.listen(app.get('port'), function () {
    var port = app.get('port');
    console.log('Palvelin kuuntelee portissa ' + port);
});


