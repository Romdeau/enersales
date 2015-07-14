angular.module('saleService', [])

.factory('Sale', function($http) {

	// create a new object
	var saleFactory = {};

	// get a single sale
	saleFactory.get = function(id) {
		return $http.get('/api/sales/' + id);
	};

	// get all sales
	saleFactory.all = function() {
		return $http.get('/api/sales/');
	};

	// create a sale
	saleFactory.create = function(saleData) {
		return $http.post('/api/sales/', saleData);
	};

	// update a sale
	saleFactory.update = function(id, saleData) {
		return $http.put('/api/sales/' + id, saleData);
	};

	// delete a sale
	saleFactory.delete = function(id) {
		return $http.delete('/api/sales/' + id);
	};

	//get all sales for a salesman
	saleFactory.bySalesman = function(id) {
		return $http.get('api/sales/salesman/' + id);
	};

	//get all sales for a project manager
	saleFactory.byProjectManager = function(id) {
		return $http.get('api/sales/projectmanager/' + id);
	};

	//get all sales for an accounts
	saleFactory.byAccounts = function(id) {
		return $http.get('api/sales/accounts/' + id);
	};

	//get the total of all sales
	saleFactory.totalSales = function() {
		return $http.get('api/dashboard/total/');
	};

	//get total sales per user
	saleFactory.userSales = function() {
		return $http.get('api/dashboard/user/');
	};

	// return our entire saleFactory object
	return saleFactory;

});
