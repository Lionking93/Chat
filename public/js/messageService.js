/* 
 * Palvelu, joka vastaa WebSocket-yhteydestä, ja viestien lähettämisestä sen kautta.
 */
app.factory('messageService', ['$interval', function ($interval) {
        /*
         * Osa url:ista, jota käytetään yhdeyden muodostamiseen, tähän ei siis
         * kuulu alun http://
         */
        var url = window.location.href.split("/")[2];
        /*
         * Alustetaan objekti, johon talletetaan palvelun julkisesti käytössä olevat
         * muuttujat ja funktiot.
         */
        var messageService = {};
        /*
         * Konstruktori viesteille, jotka palvelin on lähettänyt käyttäjälle.
         * @param String pSender
         * @param String pContent
         * @returns messageToClient
         */
        function messageToClient(pSender, pContent, pDate) {
            this.sender = pSender;
            this.content = pContent;
            this.date = pDate;
        }
        ;
        /*
         * Taulukko, johon talletetaan palvelimelta tulleet viestit. ChatController
         * hakee viestit tästä taulukosta näkymässä näytettäviksi.
         */
        messageService.messages = [];

        var retries = 0;

        var checkInterval;

        checkInterval = $interval(function () {
            retries++;
            if (retries > 3) {
                console.log("Connection has closed due to server not responding.");
                messageService.websocket.close();
                $interval.cancel(checkInterval);
            } else {
                var heartbeat = {
                    type: 'heartbeat',
                    content: 'heartbeat'
                };
                messageService.sendMessage(JSON.stringify(heartbeat));
            }
        }, 15000);

        /*
         * Muodostetaan websocket-yhteys kokonaan uudelleen. Ajastin käynnistetään
         * myös aina tätä funktiota kutsuttaessa.
         */
        messageService.initializeConnectionToChannel = function (channel, updateCallback) {
            messageService.websocket = new WebSocket("ws://" + url + "/" + channel);
            messageService.websocket.onopen = function () {
                console.log("Connection opened.");
            };
            messageService.websocket.onclose = function () {
                console.log("Connection closed.");
            };
            messageService.websocket.onmessage = function (msg) {
                var parsedData = JSON.parse(msg.data);
                if (parsedData.type === 'heartbeat' && parsedData.content === 'heartbeat') {
                    retries = 0;
                    console.log('Heartbeat received from server.');
                } else {
                    var newMessage = new messageToClient(parsedData.sender, parsedData.content,
                    parsedData.date);
                    messageService.messages.push(newMessage);
                    updateCallback();
                }
            };
            messageService.websocket.onerror = function (error) {
                console.log("Something went wrong: " + error);
            };
        };

        /*
         * Funktio viestin lähettämiseksi palvelimelle. Estetään myös yhteyden 
         * aikakatkaisu, koska yhteys on edelleen aktiivinen.
         */
        messageService.sendMessage = function (message) {
            messageService.websocket.send(message);
            if (JSON.parse(message).type === 'heartbeat' && JSON.parse(message)
                    .content === 'heartbeat') {
                console.log('Heartbeat sent to server.');
            } else {
                console.log("Message sent.");
            }
        };

        return messageService;
    }]);


