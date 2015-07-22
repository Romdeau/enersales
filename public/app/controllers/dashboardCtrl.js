angular.module('dashboardCtrl', ['saleService'])

.controller('dashboardController', function(Sale) {
  var vm = this;

  Sale.totalSales()
    .success(function(data){
      vm.total = data;
    });

  Sale.userSales()
    .success(function(data){
      vm.userNameArray = [];
      vm.userTotalArray = [];
      vm.userSales = data;
      angular.forEach(data, function(sale) {
        vm.userNameArray.push(sale._id);
        vm.userTotalArray.push(sale.total);
      })
    });
})
