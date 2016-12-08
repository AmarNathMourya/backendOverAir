var app =angular.module('overair',['ui.router','ngCookies','ngStorage']);

/*app.constant('config', {  
  app: 'overAir-Dev',
    overAir : {
        url:'http://localhost:5000'
    }
});*/

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.
        state('home', {
            url:'/dashboard',
            templateUrl: 'admindashboard.html'
        })
        .state('/', {
            url: '/',
            controller: 'indexController'
        })
               
}]);


app.run(['$rootScope','$location','$state','$window','$cookies', function($rootScope, $location, $state, $window, $cookies) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {

        console.log("to state value is:::", toState)
        if (toState != null && toState.controller == "indexController") {
            event.preventDefault();
            $state.go("home");
        }
    });

}]);





