angular.module('saleApp', ['ngAnimate', 'app.routes', 'authService', 'mainCtrl', 'userCtrl', 'userService', 'saleCtrl', 'saleService'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});
