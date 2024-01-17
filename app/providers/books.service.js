(function () {

    angular.module('bookstoreApp')
        .service('BooksService', booksService);
    booksService.$inject = ['$http', '$q'];

    function booksService($http, $q) {
        var favorites = [];
	    var baseUrl='https://www.googleapis.com/books/v1/volumes';

        this.GetBooks = function (startIndex, pageSize, name) {
            return $http.get(baseUrl, { params: { q: name, startIndex: startIndex, maxResults: pageSize } });
        }

	// get single book
        this.GetBook = function (bookId) {
            return $http.get(`${baseUrl}/${bookId}`);
        }

        this.AddToFavorites = function (book) {
            ensureFavs(); // append to existing

	   // better to add id to prevetnt localstorage capacity
	   // since book object as a lotof data
           // but we can also make custom object with specific params and save it instead of id
	   // this can save api call traffic

            favorites.push(book.id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }

        this.RemoveFromFavorites = function (book) {
            ensureFavs();

            // remove book from favorites and update local id list 
            let idx = favorites.findIndex(x => x == book.id);
            if (idx > -1) {
                favorites.splice(book.id);
                localStorage.setItem('favorites', JSON.stringify(favorites));
            }
        }


        this.GetFavorites = function () {
	    // i use defer to prevent blocking the ui
	   // also minor change later if the favorites will come from DB 
            var deferred = $q.defer();
            ensureFavs()
            deferred.resolve(favorites);
            return deferred.promise;
        }

        /**
         * @returns {Array<number>}
         * */
        function ensureFavs() {
	
            if (!favorites.length)
                favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        }
    }
})();
