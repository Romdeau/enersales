angular.module('saleCtrl', ['saleService'])

.controller('saleController', function(Sale) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the sales at page load
	Sale.all()
		.success(function(data) {

			// when all the sales come back, remove the processing variable
			vm.processing = false;

			// bind the sales that come back to vm.sales
			vm.sales = data;
		});

	// function to delete a sale
	vm.deleteSale = function(id) {
		vm.processing = true;

		Sale.delete(id)
			.success(function(data) {

				// get all sales to update the table
				// you can also set up your api
				// to return the list of sales with the delete call
				Sale.all()
					.success(function(data) {
						vm.processing = false;
						vm.sales = data;
					});

			});
	};

})

// controller applied to sale creation page
.controller('saleCreateController', function(Sale) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a sale
	vm.saveSale = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the saleService
		Sale.create(vm.saleData)
			.success(function(data) {
				vm.processing = false;

				//clear the form
				vm.saleData = {};
				vm.message = data.message;
			});

	};

})

// controller applied to sale edit page
.controller('saleEditController', function($routeParams, Sale) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the sale data for the sale you want to edit
	// $routeParams is the way we grab data from the URL
	Sale.get($routeParams.sale_id)
		.success(function(data) {
			vm.saleData = data;
		});

	// function to save the sale
	vm.saveSale = function() {
		vm.processing = true;
		vm.message = '';

		// call the saleService function to update
		Sale.update($routeParams.sale_id, vm.saleData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.saleData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});
