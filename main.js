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

/*
 * Routing
 */
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.ws('/echo', function(ws, req) {
    ws.on('message', function(msg) {
        console.log(JSON.parse(msg).sender + " " + JSON.parse(msg).content);
        expressWs.getWss().clients.forEach(function(client) {
            client.send(msg);
        });
    });
});

/*
 * Alustetaan palvelin
 */
var server = app.listen(process.get('port'), function() {
    var port = server.address().port;
    console.log('Palvelin kuuntelee portissa ' + port);
});


