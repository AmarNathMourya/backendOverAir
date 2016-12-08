

angular.module('overair')
    .factory('adminApi',['$http','config', function($http, config) {
        var base_url = config.overAir.url;

        return {
            getAllUserData : function() {
                return $http.get(base_url + '/usersData');
            },

            saveBocnId : function(bcon) {
                return $http.post(base_url + '/bconId' , bcon);
            }
        }

    }]);
