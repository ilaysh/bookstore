(function(){
    
angular.module('bookstoreApp')
.service('AuthService', service)
  
    service.$inject = ['$q'];

  // fake login in
    function service($q) {
        var userLoggedIn = JSON.parse(localStorage.getItem('loggedIn')) || false; // Initially, the user is not logged in

    this.login = function(){
     userLoggedIn = true;
        localStorage.setItem('loggedIn', true);
    }

      this.check = function () {
          if (userLoggedIn)
              return true;

          return $q.reject(401);
    }

    this.logout = function () {
        userLoggedIn = false;
        localStorage.setItem('loggedIn', false);
    }
}
})();


