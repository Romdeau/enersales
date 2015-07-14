angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})

		// create user page (unauthenticated)
		.when('/create', {
			templateUrl : 'app/views/pages/create.html',
   			controller  : 'mainCreateController',
    			controllerAs: 'user'
		})

		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    			controllerAs: 'login'
		})

		// show all users
		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		// form to create a new user
		// same view as edit page
		.when('/users/create', {
			templateUrl: 'app/views/pages/users/edit.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// page to edit a users role
		.when('/users/role/:user_id', {
			templateUrl: 'app/views/pages/users/edit_role.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})

		// page to edit a user
		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/edit.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})

		// page view the current user
		.when('/current_user/', {
			templateUrl: 'app/views/pages/users/current.html',
			controller: 'userCurrentController',
			controllerAs: 'user'
		})

		//show all sales
		.when('/sales', {
			templateUrl: 'app/views/pages/sales/all.html',
			controller: 'saleController',
			controllerAs: 'sale'
		})

		//form to create a new sale
		//same view as edit page
		.when('/sales/create', {
			templateUrl: 'app/views/pages/sales/edit.html',
			controller: 'saleCreateController',
			controllerAs: 'sale'
		})

		// show the page for a sale
		.when('/sales/:sale_id/', {
			templateUrl: 'app/views/pages/sales/single.html',
			controller: 'saleViewController',
			controllerAs: 'sale'
		})

		// page to edit a sale
		.when('/sales/:sale_id/edit', {
			templateUrl: 'app/views/pages/sales/edit.html',
			controller: 'saleEditController',
			controllerAs: 'sale'
		})

		// page to create a handover
		.when('/sales/:sale_id/handover', {
			templateUrl: 'app/views/pages/sales/handover.html',
			controller: 'saleHandoverController',
			controllerAs: 'sale'
		})

		// page to complete the accounts process
		.when('/sales/:sale_id/accounts', {
			templateUrl: 'app/views/pages/sales/accounts.html',
			controller: 'saleAccountsController',
			controllerAs: 'sale'
		})

		// page for the dashboard
		.when('/dashboard', {
			templateUrl: 'app/views/pages/dashboard/dashboard.html',
			controller: 'dashboardController',
			controllerAs: 'dashboard'
		})

	$locationProvider.html5Mode(true);

});
