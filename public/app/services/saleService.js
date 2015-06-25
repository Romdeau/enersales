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

	// return our entire saleFactory object
	return saleFactory;

});
