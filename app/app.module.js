(function(){
    "use strict";

   // ui.bootstrap for pager but requires BS3
    angular.module('bookstoreApp', ['ngRoute','ui.bootstrap'])
    .config(function ($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/login.html',
            controller: 'LoginCtrl'
        })
        .when('/main', {
            templateUrl: '/main.html',
            controller: 'MainCtrl',
            resolve: {
//
                isLoggedIn: function (AuthService) {
                    return AuthService.check();
                }
            }
        }).when('/favorites', {
            templateUrl: '/favorites.html',
            controller: 'MainCtrl',
            resolve: {
                isLoggedIn: function (AuthService) {
                    return AuthService.check();
                }
            }
        })
        .otherwise({
            redirectTo: '/login'
        });
}).run(["$rootScope", "$location",
    function ($rootScope, $location) {
		
                $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
                    if (rejection == 401) {
                	// not loggedin => redirect to login 
		        $location.path('/login');
                    }
                });

            }]);


})();