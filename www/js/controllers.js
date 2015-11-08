angular.module('starter.controllers', ['ionic','starter.services', 'ngOpenFB'])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, ngFB) {
//   Form data for the login modal
//  $scope.loginData = {};
//
//  // Create the login modal that we will use later
//  $ionicModal.fromTemplateUrl('templates/login.html', {
//    scope: $scope
//  }).then(function(modal) {
//    $scope.modal = modal;
//  });
//
//  // Triggered in the login modal to close it
//  $scope.closeLogin = function() {
//    $scope.modal.hide();
//  };
//
//  // Open the login modal
//  $scope.login = function() {
//    $scope.modal.show();
//  };
//
//  // Perform the login action when the user submits the login form
//  $scope.doLogin = function() {
//    console.log('Doing login', $scope.loginData);
//
//    // Simulate a login delay. Remove this and replace with your login
//    // code if using a login system
//    $timeout(function() {
//      $scope.closeLogin();
//    }, 1000);
//  };
    
})

.controller('FBCtrl', function ($scope, ngFB,$state){
    ngFB.getLoginStatus().then(function(response){
        if(response.status == "connected"){
            $state.go('app.MainPage');
        }
    });  
    
    $scope.fbLogin = function () {
    ngFB.login({scope: 'email'}).then(
        function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                $state.go('app.playlists');
            } else {
                alert('Facebook login failed');
            }
        });
  };
    
})

.controller('MainPage', function ($scope){
    $scope.users = [
        {name: 'Jimmy Patel', classes: 'Math112, Math111, CS113', img_url: ''},
        {name: 'Garry Guan', classes: 'CS114, Phys111, CS280', img_url: ''},
        {name: 'Jeff Chang', classes: 'Math113, Math111, CS113', img_url: ''},
        {name: 'Geoff Ching', classes: 'Math112, Phys112, CS288', img_url: ''},
        ];
    
});
            