angular.module('saleCtrl', ['saleService', 'userService', 'authService', 'mailService'])

.controller('saleController', function(Sale, User, $location) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;
	vm.search = "";
	vm.state = [
		"true",
		"false"
	];

	// grab all the sales at page load
	Sale.all()
		.success(function(data) {

			// when all the sales come back, remove the processing variable
			vm.processing = false;

			// bind the sales that come back to vm.sales
			vm.sales = data;
			vm.filtered = data;
		});

	//set the current user and authorisation variables
	User.current()
		.success(function(data) {
			vm.currentUser = data;
			if (data.role == "admin") {
				vm.isAdmin = true;
				vm.isAccounts = true;
			}
			else if (data.role == "accounts") {
				vm.isAdmin = false;
				vm.isAccounts = true;
			}
			else {
				vm.isAdmin = false;
				vm.isAccounts = false;
			}
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

	vm.updateSearch = function(searchText) {
		vm.filtered = [];
		searchText = angular.lowercase(searchText);
		angular.forEach(vm.sales, function(sale) {
			if ( sale.poNumber.indexOf(searchText) >= 0) vm.filtered.push(sale);
			else if ( angular.lowercase(sale.customer).indexOf(searchText) >= 0) vm.filtered.push(sale);
			else if ( angular.lowercase(sale.salesman.name).indexOf(searchText) >= 0) vm.filtered.push(sale);
			else if ( sale.projectManager != null && angular.lowercase(sale.projectManager.name).indexOf(searchText) >= 0) vm.filtered.push(sale);
			else if ( angular.lowercase(sale.description).indexOf(searchText) >= 0) vm.filtered.push(sale);
		});

	};

})

// controller applied to sale creation page
.controller('saleCreateController', function(Sale, User, Mail, $location) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// grab all the users at page load
	User.all()
		.success(function(userData) {
			// bind the users that come back to vm.users
			vm.users = userData;
			vm.salesmanID = userData[0].id;
		});

	// function to create a sale
	vm.saveSale = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the saleService
		Sale.create(vm.saleData)
			.success(function(data) {
				//console.log(data);
				vm.processing = false;
				//send email on success
				Mail.createSale(vm.saleData)

				//route to sales location
				$location.path('/sales/');
			}).error(function(err) {
				vm.message = data.message;
			});
	};

})

//controlled applies to view a single sale
.controller('saleViewController', function($routeParams, Sale, User, $location) {
	var vm = this;
	var handoverTrue = ({
		handoverComplete: true
	});

	var accountsTrue = ({
		accountsEntered: true
	});

	// get the sale data for the sale you want to view
	// $routeParams is the way we grab data from the URL
	Sale.get($routeParams.sale_id)
		.success(function(data) {
			vm.saleData = data;
		});

	// grab all the users at page load so we can display names
	User.all()
		.success(function(userData) {
			// bind the users that come back to vm.users
			vm.users = userData;
			vm.salesmanID = userData[0].id;
		});

	//set the current user and authorisation variables
	User.current()
		.success(function(data) {
			vm.currentUser = data;
			if (data.role == "admin") {
				vm.isAdmin = true;
				vm.isAccounts = true;
			}
			else if (data.role == "accounts") {
				vm.isAdmin = false;
				vm.isAccounts = true;
			}
			else {
				vm.isAdmin = false;
				vm.isAccounts = false;
			}
		});

	//function to complete the handover
	vm.completeHandover = function() {
		vm.processing = true;
		// call the saleService function to update
		Sale.update($routeParams.sale_id, handoverTrue)
			.success(function(data) {
				vm.processing = false;
				//update sale on success so status updates
				Sale.get($routeParams.sale_id)
					.success(function(data) {
						vm.saleData = data;
					});
			});
	}

	//function to complete the accountsProcess
	vm.completeAccounts = function() {
		vm.processing = true;
		// call the saleService function to update
		Sale.update($routeParams.sale_id, accountsTrue)
			.success(function(data) {
				vm.processing = false;
				//update sale on success so status updates
				Sale.get($routeParams.sale_id)
					.success(function(data) {
						vm.saleData = data;
					});
			});
	}

})

// controller applied to sale edit page
.controller('saleEditController', function($routeParams, Sale, User, $location, $scope) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// grab all the users at page load
	User.all()
		.success(function(data) {
			// bind the users that come back to vm.users
			vm.users = data;
		});

	// get the sale data for the sale you want to edit
	// $routeParams is the way we grab data from the URL
	Sale.get($routeParams.sale_id)
		.success(function(data) {
			data.meetingDate = new Date(data.meetingDate);
			vm.saleData = data;
			//$scope.formattedDate = new Date(data.meetingDate);
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
				vm.message = data.message;
				$location.path('/sales');
			});
	};
})

// controller applied to sale handover page
.controller('saleHandoverController', function($routeParams, Sale, User, Mail, $location, $scope) {

	var vm = this;

	// grab all the users at page load
	User.all()
		.success(function(data) {

			// bind the users that come back to vm.users
			vm.users = data;
		});

	// get the sale data for the sale you want to edit
	// $routeParams is the way we grab data from the URL
	Sale.get($routeParams.sale_id)
		.success(function(data) {
			data.meetingDate = new Date(data.meetingDate);
			vm.saleData = data;
			//$scope.formattedDate = new Date(data.meetingDate);
		});

	// function to save the sale
	vm.saveSale = function() {
		vm.processing = true;
		vm.message = '';
		vm.saleData.handoverComplete = true;
		// call the saleService function to update
		Sale.update($routeParams.sale_id, vm.saleData)
			.success(function(data) {
				vm.processing = false;
				//send email
				Mail.createHandover(vm.saleData)
				//route back to sales
				$location.path('/sales');
			});
	};
})

// controller applied to sale accounts page
.controller('saleAccountsController', function($routeParams, Sale, User, Mail, $location, $scope) {

	var vm = this;

	// grab all the users at page load
	User.all()
		.success(function(data) {

			// bind the users that come back to vm.users
			vm.users = data;
			getAccounts(data);
		});

	// get the sale data for the sale you want to edit
	// $routeParams is the way we grab data from the URL
	Sale.get($routeParams.sale_id)
		.success(function(data) {
			data.meetingDate = new Date(data.meetingDate);
			vm.saleData = data;
		});

	// function to save the sale
	vm.saveSale = function() {
		vm.processing = true;
		vm.message = '';
		vm.saleData.accountsEntered = true;
		// call the saleService function to update
		Sale.update($routeParams.sale_id, vm.saleData)
			.success(function(data) {
				vm.processing = false;
				//send email
				Mail.finaliseAccounts(vm.saleData)
				//route back to sales
				$location.path('/sales');
			});
	};

	getAccounts = function(data) {
		vm.accountsUsers = [];
		angular.forEach(data, function(user) {
			if (user.role == "accounts")
				vm.accountsUsers.push(user);
		});
	}
})
