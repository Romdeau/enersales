angular.module('userCtrl', ['userService', 'mailService', 'saleService'])

.controller('userController', function(User) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the users at page load
	User.all()
		.success(function(data) {

			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			vm.users = data;
		});

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

	// function to delete a user
	vm.deleteUser = function(id) {
		vm.processing = true;

		User.delete(id)
			.success(function(data) {

				// get all users to update the table
				// you can also set up your api
				// to return the list of users with the delete call
				User.all()
					.success(function(data) {
						vm.processing = false;
						vm.users = data;
					});

			});
	};

})

// controller applied to user creation page
.controller('userCreateController', function(User, Mail) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the userService
		User.create(vm.userData)
			.success(function(data) {
				vm.processing = false;
				Mail.createUser(vm.userData);
				//clear the form
				vm.userData = {};
				vm.message = data.message;
			});

	};

})

// controller applied to user edit page
.controller('userEditController', function($routeParams, User) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// roles definition for dropdown
	vm.roles = [
		'user',
		'admin',
		'accounts'
	]

	// get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	User.get($routeParams.user_id)
		.success(function(data) {
			vm.userData = data;
		});

	// function to save the user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		// call the userService function to update
		User.update($routeParams.user_id, vm.userData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.userData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

})

.controller('userCurrentController', function(User, Sale) {
	var vm = this;
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
			Sale.bySalesman(data._id)
				.success(function(data) {
					vm.sales = data;
				});
			Sale.byProjectManager(data._id)
				.success(function(data) {
					vm.projects = data;
				});
			Sale.byAccounts(data._id)
				.success(function(data) {
					vm.accounts = data;
				});
		});
});
