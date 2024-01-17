(function () {

   // a simple pager since using BS5 
    angular.module('bookstoreApp')
        .directive('appPaging', [function () {
            return {
                restrict: 'E',
                templateUrl: 'app/providers/paging.directive/paging.template.html',
                controller: ['$scope', PagingController],
                scope: {
                    totalItems: "=",
                    pagingSize: '=',
                    currentPage: '=',
                    itemPerPage: '=noofitem',
                    onChange: '&?'
                }
            };
        }]);

    PagingController.$inject = ['$scope'];
    function PagingController($scope) {
        $scope.pager = {};
        $scope.pagingSize = $scope.pagingSize || 10;
        $scope.itemPerPage = $scope.itemPerPage || 10;

        function setPager(itemCount, currentPage, itemPerPage) {
            currentPage = currentPage || 1;
            var startPage, endPage;

            var totalPages = Math.ceil(itemCount / itemPerPage);
            if (totalPages <= $scope.pagingSize) {
                startPage = 1;
                endPage = totalPages;
            } else {
                if (currentPage + 1 >= totalPages) {
                    startPage = totalPages - ($scope.pagingSize - 1);
                    endPage = totalPages;
                } else {
                    startPage = currentPage - parseInt($scope.pagingSize / 2);
                    startPage = startPage <= 0 ? 1 : startPage;
                    endPage = (startPage + $scope.pagingSize - 1) <= totalPages ? (startPage + $scope.pagingSize - 1) : totalPages;
                    if (totalPages === endPage) {
                        startPage = endPage - $scope.pagingSize + 1;
                    }
                }
            }

            var startIndex = (currentPage - 1) * itemPerPage;
            var endIndex = startIndex + itemPerPage - 1;

            var index = startPage;
            var pages = [];
            for (; index < endPage + 1; index++)
                pages.push(index);

            $scope.pager.currentPage = currentPage;
            $scope.pager.totalPages = totalPages;
            $scope.pager.startPage = startPage;
            $scope.pager.endPage = endPage;
            $scope.pager.startIndex = startIndex;
            $scope.pager.endIndex = endIndex;
            $scope.pager.pages = pages;
        }

        $scope.setPage = function (currentPage) {
            if (currentPage < 1 || currentPage > $scope.pager.totalPages)
                return;

            setPager($scope.totalItems, currentPage, $scope.itemPerPage);
        };

        $scope.pageChanged = function (page) {
            $scope.setPage(page);
            if ($scope.onChange)
                $scope.onChange({ page:page})
        };

        $scope.setPage($scope.currentPage)
    }


})();