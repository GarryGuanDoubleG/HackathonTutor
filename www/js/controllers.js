var lat;
var long;

angular.module('starter.controllers', ['ionic','starter.services', 'ngOpenFB'])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, ngFB) {
    
})

.controller('FBCtrl', function ($scope, ngFB,$state,$http){
    
    $scope.calculateAge = function calculateAge(birthday) { // birthday is a date
            var bday = new Date(birthday);
            console.log(bday);
            var ageDifMs = Date.now() - bday ;
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            console.log(Math.abs(ageDate.getUTCFullYear() - 1970));
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        };
    
    $scope.getPos = function getPos(){
        navigator.geolocation.getCurrentPosition(function(position) {
        $scope.positions = [{lat: position.coords.latitude,lng: position.coords.longitude}];
        console.log($scope.positions);
        console.log($scope.positions[0].lng);
        if($scope.positions[0].lat != undefined){
            lat = $scope.positions[0].lat;
        }
        if($scope.positions[0].lng != undefined){
            long = $scope.positions[0].lng;
        }
        console.log(" lat" + lat + " long" + long);
    })
    }
    
    ngFB.getLoginStatus().then(function(response){
        if(response.status == "connected"){
            console.log("connected to facebook");
            $scope.getPos();
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                ngFB.api({
                    path: '/me',
                    params: {fields: 'id,first_name, last_name, birthday'}
                }).then(
                    
                    function(user){
                        data = {
                            'UserId': user.id,
                            'FirstName': user.first_name,
                            'LastName': user.last_name,
//                            'Age': $scope.calculateAge(user.birthday),
                            'Longitude': long,
                            'Latitude': lat
                        }
                        console.log(data);
                        var config = {
                            headers : {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                            }
                        };
                        console.log(config);
                        console.log(data.UserId);
                        $http.get('http://45.79.138.124/UserRegister.php?UserId='+data.UserId + '&FirstName=' + data.FirstName + '&LastName=' + data.LastName + '&Longitude=' + data.Longitude + '&Latitude=' + data.Latitude)
                        .success(function(returndata, status, headers, config)
                        {
                            console.log(status + ' - ' + returndata);
                        })
                        .error(function (data, status, headers, config)
                        {
                            console.log(status + data + 'error');
                        });
                    },
                    
                    function (error){
                        alert ('Facebook error: ' + error.error_description);
                });
            
//            $state.go('app.MainPage');
        }
        }
    });  
    
    $scope.fbLogin = function () {
    ngFB.login({scope: 'email'}).then(
            
        function (response) {         
            $scope.getPos();

            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                ngFB.api({
                    path: '/me',
                    params: {fields: 'id,first_name,last_name,birthday'}
                }).then(
                    function(user){
                        console.log($scope.positions);
                        data = {
                            'UserId': user.id,
                            'FirstName': user.first_name,
                            'LastName': user.last_name,
                            'Longitude': long,
                            'Latitude': lat
                        }
                        var config = {
                            headers : {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                            }
                        };
                        
                        console.log(data.UserId);
                        $http.get('http://45.79.138.124/UserRegister.php?UserId='+data.UserId + '&FirstName=' + data.FirstName + '&LastName=' + data.LastName + '&Longitude=' + data.Longitude + '&Latitude=' + data.Latitude)
                        .success(function(data, status, headers, config)
                        {
                            console.log(status + ' - ' + data);
                        })
                        .error(function (data, status, headers, config)
                        {
                            console.log('error');
                        });
                    },
                    
                    function (error){
                        alert ('Facebook error: ' + error.error_description);
                });
                
                $state.go('app.MainPage');
            } else {
                alert('Facebook login failed');
            }
        });
  };
    
})

.controller('MainPage', function ($scope,$http, $state){
    var currLat;
    var currLong;
    
    $scope.getPos = function (){navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        $http.get("http://45.79.138.124/GetTutorList.php?Latitude=" + lat + "&Longitude=" + long).success(  function(data){
     $scope.users = data;
     console.log(data);
     angular.forEach($scope.users, function(value,key){
//         $scope.users[key].FBPicUrl = "https://graph.facebook.com/"+1221338047892755+"/picture?fields=picture.width(720).height(720)";
        // console.log($scope.users.FBPicUrl);
     });
        console.log("******Lat is " + lat + " &&&&&&&&&& long is " + long);
        })
   })
                               };
 
    
    $scope.getPos();
    
    console.log("lat: " + lat + " long: " + long);
//    $http.get("http://45.79.138.124/GetTutorList.php?Latitude=" + lat + "&Longitude=" + long).success( function(data){
//     $scope.users = data;
//     angular.forEach($scope.users, function(value,key){
//         $scope.users[key].FBPicUrl = "https://graph.facebook.com/"+1221338047892755+"/picture?fields=picture.width(720).height(720)";
//         console.log($scope.users.FBPicUrl);
//     });
        
     console.log('Main Page Get Request');
     console.log($scope.users);
     console.log(lat + " " + long);
    
//    $scope.users = [
//        {UserId:'', name: 'Jimmy Patel', classes: 'Math112, Math111, CS113', img_url: ''},
//        {name: 'Garry Guan', classes: 'CS114, Phys111, CS280', img_url: ''},
//        {name: 'Jeff Chang', classes: 'Math113, Math111, CS113', img_url: ''},
//        {name: 'Geoff Ching', classes: 'Math112, Phys112, CS288', img_url: ''},
//        ];
//    
    $scope.register = function(){
      $state.go('app.tutorReg');
    }
})

.controller('TutorForm', function ($scope,$state){
   $scope.formData = { Age:'', Bio: '', EndTime: '', Subject1: '', Subject2: '', Subject3: '', isTutor: 1 };
    $scope.broadcastGG = function ()
    {
        $state.go('app.broadcast');
    }
    
})

.controller('BroadCast', function ($scope, $state){
    $scope.stopBroadCast = function (){
        $state.go('app.MainPage');
    }
});

            