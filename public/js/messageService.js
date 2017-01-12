/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
app.factory('messageService', function () {
    var url = window.location.href.split("/")[2];

    var messageService = {};
    
    function messageToClient(pSender, pContent) {
        this.sender = pSender;
        this.content = pContent;
    };
    
    messageService.messages = [];

    messageService.initializeConnectionToChannel = function (channel, updateCallback) {
        messageService.websocket = new WebSocket("ws://" + url + "/" + channel);
        messageService.websocket.onopen = function () {
            console.log("Connection opened.");
        };
        messageService.websocket.onclose = function () {
            console.log("Connection closed.");
        };
        messageService.websocket.onmessage = function(msg) {
            var parsedData = JSON.parse(msg.data);
            var newMessage = new messageToClient(parsedData.sender, parsedData.content);
            messageService.messages.push(newMessage);
            updateCallback();
        };
    };

    messageService.sendMessage = function (message) {
        messageService.websocket.send(message);
        console.log("Message sent.");
    };

    return messageService;
});


