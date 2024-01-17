(function () {

    'use strict';

    angular.module('bookstoreApp').controller('MainCtrl', mainCtrl);
    mainCtrl.$inject = ['$scope', 'BooksService', 'AuthService', '$q','$location'];

    function mainCtrl($scope, BooksService, AuthService, $q, $location) {
        $scope.books = [];
        $scope.totalItems = 0;
        $scope.itemsPerPage = 10;
        $scope.maxSize = 40;
        // we use object in case we will want to save current search in client
        // so we can return from where we left off (if we add boolk page)
        $scope.search = { currentPage: 1, name: 'angularjs' };
        $scope.favorites = [];

        $scope.initBooks = function() {
            BooksService.GetFavorites().then(function (list) {
                $scope.favorites = list;
                getBooks();
            })

        }

        $scope.pageChanged = function (page) {
            $scope.search.currentPage = page;
            getBooks();
        };

        $scope.fetchBooks = function () {
            getBooks();
        };

        $scope.showMore = function (book) {
            $scope.book = book;
            var myModal = new bootstrap.Modal(document.getElementById('bookModal'));
            myModal.show()

        }

        $scope.addToFavorites = function (book) {
            BooksService.AddToFavorites(book);
            // using this method is better for repeater than using template function 
            book.isFav = true;
            $scope.favorites.push(book.id);
        };

        $scope.togglFav = function (book, index) {
            if (book.isFav) {
                BooksService.RemoveFromFavorites(book);
                $scope.favorites.splice(index, 1);
            }
            else {
                BooksService.AddToFavorites(book);
                $scope.favorites.push(book.id);
            }

            book.isFav = !book.isFav;
        };

        $scope.removeFavorite = function (book, $index) {
            BooksService.RemoveFromFavorites(book);
            $scope.favorites.splice($index, 1);
        };

        $scope.logout = function () {
            AuthService.logout();
        };

        $scope.initFavs = function () {
            // Use Promise.all to fetch details for multiple books concurrently
            BooksService.GetFavorites().then(function (list) {
                $scope.favorites = list;
                var bookRequests = $scope.favorites.map(function (bookId) {
                    return BooksService.GetBook(bookId);
            });

            $q.all(bookRequests)
                .then(function (responses) {
                    $scope.books = responses.map(function (response) {
                        return response.data;
                    });
                    //todo: this will not update count after remove from favorite
                    $scope.totalItems = $scope.books.length;
                })
                .catch(function (error) {
                    console.error('Error fetching book details:', error);
                });
            })

         
        }

        $scope.logout = function () {
            AuthService.logout();
            $location.path('login')
        }

        function getBooks() {
            BooksService.GetBooks($scope.search.currentPage, $scope.itemsPerPage, $scope.search.name)
                .then(function (response) {
                    $scope.books = response.data.items;
                    if ($scope.favorites.length)
                        $scope.books.forEach(function (book, idx) {
                            book.isFav = $scope.favorites.indexOf(book.id) > -1;
                        });
                    $scope.totalItems = response.data.totalItems;
                })
                .catch(function (error) {
                    console.error('Error fetching books:', error);
                });
        }

    }
})();
