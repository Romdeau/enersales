angular.module('dashboardCtrl', ['saleService'])

.controller('dashboardController', function(Sale) {
  var vm = this;

  Sale.totalSales()
    .success(function(data){
      vm.total = data;
    });

  Sale.userSales()
    .success(function(data){
      vm.userSales = data;
    });
})
