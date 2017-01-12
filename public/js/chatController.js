/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
app.controller('chatController', function ($scope) {
    var url = window.location.href.split("/")[2];
    var echoChannel = new WebSocket("ws://" + url + "/echo");
    
    $scope.messageToServer = {
        sender: "",
        content: ""
    };
    
    $scope.messagesToClient = [];
    
    function messageToClient(pSender, pContent) {
        this.sender = pSender,
        this.content = pContent
    };

    $scope.sendMessage = function () {
        echoChannel.send(JSON.stringify($scope.messageToServer));
        $scope.messageToServer.sender = "";
        $scope.messageToServer.content = "";
    };
    
    echoChannel.onopen = function() {
        console.log("Connection opened.");
    };
    
    echoChannel.onclose = function() {
        console.log("Connection closed.");
    };
    
    echoChannel.onmessage = function(evt) {
        var parsedMessage = JSON.parse(evt.data);
        var newMessage = new messageToClient(parsedMessage.sender, parsedMessage.content);
        $scope.messagesToClient.push(newMessage);
        $scope.$apply();
        console.log($scope.messagesToClient);
    };
});

