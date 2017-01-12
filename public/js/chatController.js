/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
app.controller('chatController', ['$scope', 'messageService', function ($scope, messageService) {
    //  var url = window.location.href.split("/")[2];
    // var echoChannel = new WebSocket("ws://" + url + "/echo");

    $scope.messageToServer = {
        sender: "",
        content: ""
    };

    $scope.messagesToClient = messageService.messages;

    var updateCallback = function() {
        $scope.$apply();
    };

    messageService.initializeConnectionToChannel("echo", updateCallback);
    
    $scope.sendMessage = function () {
        messageService.sendMessage(JSON.stringify($scope.messageToServer));
        $scope.messageToServer.sender = "";
        $scope.messageToServer.content = "";
    };
}]);

