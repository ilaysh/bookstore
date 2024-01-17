(function () {
    'use strict';

    angular.module('bookstoreApp').controller('LoginCtrl', loginCtrl)
    loginCtrl.$inject = ['$location', '$scope', 'AuthService'];

    function loginCtrl($location, $scope, AuthService) {
        $scope.user = {};
        $scope.login = function () {
			// just check for username and pasword
            if ($scope.loginForm.$invalid)
                return;					// 

			// mark as logged-in for auth
            AuthService.login();
			
            $location.path('/main'); // return to main page
        };

    }

})();