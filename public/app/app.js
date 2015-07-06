angular.module('saleApp', ['ngAnimate', 'app.routes', 'angularMoment', 'authService', 'mainCtrl', 'userCtrl', 'userService', 'saleCtrl', 'saleService'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

})
.run(function(amMoment) {
	amMoment.changeLocale('en-au');
})
.constant('angularMomentConfig', {
	preprocess: 'unix',
	timezone: 'Australia/Brisbane'
});
