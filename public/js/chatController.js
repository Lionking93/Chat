/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
app.controller('chatController', ['$scope', 'messageService', '$location',
    '$anchorScroll', '$filter', function ($scope, messageService, $location, $anchorScroll,
    $filter) {
    $scope.messageToServer = {
        sender: "",
        content: "",
        date: ""
    };
    
    var goToBottom = function() {
        $location.hash($scope.messagesToClient[$scope.messagesToClient.length-1].date);
        $anchorScroll();
    };

    $scope.messagesToClient = messageService.messages;

    var updateCallback = function() {
        $scope.$apply();
        goToBottom();
    };

    messageService.initializeConnectionToChannel("echo", updateCallback);
    
    $scope.sendMessage = function () {
        var date = new Date();
        var messageDate = $filter('date')(date, 'HH:mm:ss');
        $scope.messageToServer.date = messageDate;
        messageService.sendMessage(JSON.stringify($scope.messageToServer));
        $scope.messageToServer.sender = "";
        $scope.messageToServer.content = "";
    };
}]);

