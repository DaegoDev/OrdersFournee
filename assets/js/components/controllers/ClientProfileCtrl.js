  var fournee = angular.module('fournee');
  fournee.controller('ClientProfileCtrl', ['$scope', '$log', '$state', '$stateParams', 'ProfileService', 'ClientSvc', '$ngConfirm', function($scope, $log, $state, $stateParams, ProfileService, ClientSvc, $ngConfirm) {
    $scope.employee = {};
    $scope.user = {};

    // Dropdown para listar los tipos de empleados
    $scope.placement = {
      options: ['Pagos',
        'Cartera',
        'Otro'
      ],
      selected: 'Pagos',
    };

    ProfileService.getProfileClient()
      .then(function(res) {
        // console.log(res.data);
        $scope.client = res.data;
      })
      .catch(function(err) {
        $ngConfirm('No se ha podido obtener el perfil. Intente mas tarde');
      })

    $scope.updateGeneralInfo = function() {
      var legalName = $scope.client.legalName;
      var nit = $scope.client.nit;
      var tradeName = $scope.client.tradeName;
      var managerName = $scope.client.managerName;
      var managerPhonenumber = $scope.client.managerPhonenumber;
      var businessPhonenumber = $scope.client.businessPhonenumber;

      var clientCredentials = {
        legalName: legalName,
        nit: nit,
        tradeName: tradeName,
        managerName: managerName,
        managerPhonenumber: managerPhonenumber,
        businessPhonenumber: businessPhonenumber,
      }

      // Validación de los campos del formulario de actualización de info general de un cliente.
      if (!legalName || !nit || !tradeName || !managerName || !managerPhonenumber || !businessPhonenumber) {
        return;
      }

      ClientSvc.updateGeneralInfo(clientCredentials)
        .then(function(res) {
          var clientUpdated = res.data;
          $scope.client.legalName = clientUpdated.legalName;
          $scope.client.nit = clientUpdated.nit;
          $scope.client.tradeName = clientUpdated.tradeName;
          $scope.client.managerName = clientUpdated.managerName;
          $scope.client.managerPhonenumber = clientUpdated.managerPhonenumber;
          $scope.client.businessPhonenumber = clientUpdated.businessPhonenumber;
          $scope.alertMessageGeneral = "Información actualizada!";
          $scope.signingUp = false;
          $scope.signupError = false;
          $scope.showAlertGeneral = true;
          $scope.update.$setPristine();
          $scope.update.$setUntouched();
        })
        .catch(function(err) {
          $scope.alertMessageGeneral = "No se ha podido actualizar la información.";
          $scope.signingUp = false;
          $scope.signupError = true;
          $scope.showAlertGeneral = true;
        })
    }

    $scope.updateBillAddress = function() {
      var country = $scope.client.billAddress.country;
      var department = $scope.client.billAddress.department;
      var city = $scope.client.billAddress.city;
      var neighborhood = $scope.client.billAddress.neighborhood;
      var nomenclature = $scope.client.billAddress.nomenclature;
      var additionalInformation = $scope.client.billAddress.additionalInformation;

      var addressCredentials = {
        billCountry: country,
        billDepartment: department,
        billCity: city,
        billNeighborhood: neighborhood,
        billNomenclature: nomenclature,
        billAdditionalInformation: additionalInformation,
      }

      // Validación de los campos del formulario de actualización de info general de un cliente.
      if (!country || !department || !city || !neighborhood || !nomenclature || !additionalInformation) {
        return;
      }

      ClientSvc.updateBillAddress(addressCredentials)
        .then(function(res) {
          $scope.alertMessageBillAddress = "Dirección actualizada!";
          $scope.signingUp = false;
          $scope.signupError = false;
          $scope.showAlertBill = true;
          $scope.billAddressUpdate.$setPristine();
          $scope.billAddressUpdate.$setUntouched();
        })
        .catch(function(err) {
          $scope.alertMessageBillAddress = "No se ha podido actualizar la dirección.";
          $scope.signingUp = false;
          $scope.signupError = true;
          $scope.showAlertBill = true;
        })
    }

    $scope.updateDeliveryAddress = function() {
      var country = $scope.client.deliveryAddress.country;
      var department = $scope.client.deliveryAddress.department;
      var city = $scope.client.deliveryAddress.city;
      var neighborhood = $scope.client.deliveryAddress.neighborhood;
      var nomenclature = $scope.client.deliveryAddress.nomenclature;
      var additionalInformation = $scope.client.deliveryAddress.additionalInformation;

      var addressCredentials = {
        deliveryCountry: country,
        deliveryDepartment: department,
        deliveryCity: city,
        deliveryNeighborhood: neighborhood,
        deliveryNomenclature: nomenclature,
        deliveryAdditionalInformation: additionalInformation
      }

      // Validación de los campos del formulario de actualización de info general de un cliente.
      if (!country || !department || !city || !neighborhood || !nomenclature || !additionalInformation) {
        return;
      }

      ClientSvc.updateDeliveryAddress(addressCredentials)
        .then(function(res) {
          $scope.alertMessageDeliveryAddress = "Dirección actualizada!";
          $scope.signingUp = false;
          $scope.signupError = false;
          $scope.showAlertDelivery = true;
          $scope.deliveryAddressUpdate.$setPristine();
          $scope.deliveryAddressUpdate.$setUntouched();
        })
        .catch(function(err) {
          $scope.alertMessageDeliveryAddress = "No se ha podido actualizar la dirección.";
          $scope.signingUp = false;
          $scope.signupError = true;
          $scope.showAlertDelivery = true;
        })
    }

    $scope.createClientEmployee = function() {
      var name = null;
      var phonenumber = null;
      var role = null;

      if (!$scope.employee) {
        return;
      }

      name = $scope.employee.name;
      phonenumber = $scope.employee.phonenumber;
      role = $scope.placement.selected;

      // Validación de los campos del formulario de crear del empleado.
      if (!name || !phonenumber || !role) {
        return;
      }

      var employeeCredentials = {
        name: name,
        phonenumber: phonenumber,
        role: role,
      }

      ClientSvc.createClientEmployee(employeeCredentials)
        .then(function(res) {
          $scope.client.clientEmployee.push(res.data);
          $scope.alertMessageEmployee = "Empleado creado!";
          $scope.signingUp = false;
          $scope.signupError = false;
          $scope.showAlertEmployee = true;
          $scope.register.$setPristine();
          $scope.register.$setUntouched();
          $scope.employee = {};
          $scope.$apply();
        })
        .catch(function(err) {
          if (err.status === 409) {
            $scope.alertMessage = "Error, el empleado ya está registrado."
          } else {
            $scope.alertMessage = "No se ha podido crear el empleado.";
          }
          $scope.signingUp = false;
          $scope.signupError = true;
          $scope.showAlertEmployee = true;
        })
    }

    $scope.cloneAddress = function() {
      $scope.client.deliveryAddress = $scope.client.billAddress;
    }

    $scope.updatePassword = function () {
      // Definición de variables.

      var currentPassword = null;
      var newPassword = null;
      var rePassword = null;
      var credentials = null;

      if (!$scope.user) {
        return;
      }

      // Inicialicación de datos para el cambio de la contraseña de un equipo.
      currentPassword = $scope.user.currentPassword;
      newPassword = $scope.user.newPassword;
      rePassword = $scope.user.rePassword;

      // Validación de los campos del formulario de cambiar contraseña del equipo.
      if ( !currentPassword || !newPassword || !rePassword) {
        return;
      }

      if (newPassword.length < 6 || newPassword !== rePassword ) {
        return;
      }

      if (newPassword === currentPassword) {
        $scope.alertMessagePassword = "Error, la contraseña nueva no puede ser igual a la contraseña actual.";
        $scope.error = true;
        $scope.showAlertPassword = true;
        return;

      }

      credentials = {
          currentPassword: currentPassword,
          newPassword: newPassword
      };

      // Llamado al servicio de cambiar contraseña de equipos haciendo uso de las credenciales
      // creadas y validadas.
      $scope.processing = true;
      ProfileService.clientChangePsw(credentials)
      .then(function (res) {
        $scope.alertMessagePassword = "La contraseña ha sido cambiada exitosamente.";
        $scope.processing = false;
        $scope.error = false;
        $scope.showAlertPassword = true;
        $scope.user = {};
        $scope.pswForm.$setPristine();
        $scope.pswForm.$setUntouched();
      })
      .catch(function (err) {
        console.log(err);
        $scope.alertMessagePassword = "La contraseña no ha sido cambiada, verifique su contraseña actual.";
        $scope.processing = false;
        $scope.error = true;
        $scope.showAlertPassword = true;
      });
    }

    // switch flag
    $scope.switchAlert = function(value) {
      $scope[value] = !$scope[value];
    };
  }]);
