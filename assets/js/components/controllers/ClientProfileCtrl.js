  var fournee = angular.module('fournee');
  fournee.controller('ClientProfileCtrl', ['$scope', '$log', '$state', '$stateParams', 'ProfileService', 'ClientSvc', 'ReceptionHourSvc', '$ngConfirm', function($scope, $log, $state, $stateParams, ProfileService, ClientSvc, ReceptionHourSvc, $ngConfirm) {
      $scope.employee = {};
      $scope.user = {};

      $scope.timeInitial = new Date();
      $scope.timeInitial.setHours(12);
      $scope.timeInitial.setMinutes(0);

      $scope.minTimeInitial = new Date();
      $scope.minTimeInitial.setHours(8);
      $scope.minTimeInitial.setMinutes(0);
      $scope.maxTimeInitial = new Date();
      $scope.maxTimeInitial.setHours(22);
      $scope.maxTimeInitial.setMinutes(0);

      $scope.timeFinal = new Date();
      $scope.timeFinal.setHours(12);
      $scope.timeFinal.setMinutes(0);

      $scope.minTimeFinal = new Date();
      $scope.minTimeFinal.setHours($scope.timeInitial.getHours() + 2);
      $scope.minTimeFinal.setMinutes($scope.timeInitial.getMinutes());
      $scope.maxTimeFinal = new Date();
      $scope.maxTimeFinal.setHours(24);
      $scope.maxTimeFinal.setMinutes(0);

      $scope.hstep = 1;
      $scope.mstep = 10;


      // Dropdown para listar los tipos de empleados
      $scope.placement = {
        options: [
          'Administración',
          'Cartera',
          'Cocina',
          'Pagos',
          'Otro'
        ],
        selected: 'Administración',
      };

    ProfileService.getProfileClient()
      .then(function(res) {
        $scope.client = res.data;
      })
      .catch(function(err) {
        $ngConfirm('No se ha podido obtener el perfil. Intente mas tarde');
      })

      ReceptionHourSvc.getWeekDays()
        .then(function(res) {
          $scope.weekDays = res.data;
          // Dropdown para listar los tipos de empleados
          $scope.placementWeekDays = {
            options: $scope.weekDays,
            selectedOption: {id: 1, name: 'Lunes' },
          };
        })
        .catch(function(err) {

        })

      $scope.addReceptionHour = function () {
        var initialReceptionTime = null;
        var finalReceptionTime = null;
        var weekDay = null;

        if (!$scope.timeInitial) {
          return;
        }

        if (!$scope.timeFinal) {
          return;
        }

        if ($scope.timeInitial.getMinutes() <= 9) {
          initialReceptionTime = $scope.timeInitial.getHours() + ':0' + $scope.timeInitial.getMinutes();
        } else {
          initialReceptionTime = $scope.timeInitial.getHours() + ':' + $scope.timeInitial.getMinutes();
        }

        if ($scope.timeFinal.getMinutes() <= 9) {
          finalReceptionTime = $scope.timeFinal.getHours() + ':0' + $scope.timeFinal.getMinutes();
        } else {
          finalReceptionTime = $scope.timeFinal.getHours() + ':' + $scope.timeFinal.getMinutes();
        }

        weekDay = $scope.placementWeekDays.selectedOption.id;

        var receptionHourCredentials = {
          initialReceptionTime: initialReceptionTime,
          finalReceptionTime: finalReceptionTime,
          weekDay: weekDay,
        }

        ReceptionHourSvc.createReceptionHour(receptionHourCredentials)
          .then(function(res) {
            $scope.client.receptionHour.push(res.data);
          })
          .catch(function(err) {
            if(err.data.code == 410){
              $ngConfirm(err.data.msg);
            }else {
              $ngConfirm('No fue posible crear el horario de recepción');
            }
          })
      }

      $scope.confirm = function (receptionHourId) {
        $ngConfirm({
          title: '¿Realmente desea eliminar el horario?',
          useBootstrap: true,
          content: 'Este dialogo eligirá la opción cancelar automaticamente en 6 segundo si no responde.',
          autoClose: 'cancel|8000',
          buttons: {
            deleteReceptionHour: {
              text: 'Eliminar',
              btnClass: 'btn-red',
              action: function() {
                $scope.deleteReceptionHour(receptionHourId);
              }
            },
            cancel: function() {
              $ngConfirm('La acción ha sido cancelada');
            }
          }
        });
      }

      $scope.deleteReceptionHour = function(receptionHourId) {
        ReceptionHourSvc.deleteReceptionHour({
            receptionHourId: receptionHourId
          })
          .then(function(res) {
            angular.forEach($scope.client.receptionHour, function (receptionHour, index) {
              if(receptionHour.id == receptionHourId){
                $scope.client.receptionHour.splice(index,1);
                $ngConfirm('Horario eliminado.');
                return;
              }
            })
          })
          .catch(function(err) {
            $ngConfirm('No se pudo eliminar el horario.');
          })
      }

      $scope.changedInitial = function() {
        if(($scope.timeFinal.getHours() - 2) <= ($scope.timeInitial.getHours())){
          $scope.timeFinal = new Date();
          $scope.timeFinal.setHours($scope.timeInitial.getHours() + 2);
          $scope.timeFinal.setMinutes($scope.timeInitial.getMinutes());
        }
        $scope.minTimeFinal = new Date();
        $scope.minTimeFinal.setHours($scope.timeInitial.getHours() + 2);
        $scope.minTimeFinal.setMinutes($scope.timeInitial.getMinutes());
      };

      $scope.changedFinal = function() {
      };

      $scope.updateGeneralInfo = function() {
        var legalName = $scope.client.legalName;
        var nit = $scope.client.nit;
        var tradeName = $scope.client.tradeName;
        var ownerName = $scope.client.ownerName;
        var ownerPhonenumber = $scope.client.ownerPhonenumber;
        var businessPhonenumber = $scope.client.businessPhonenumber;

        var clientCredentials = {
          legalName: legalName,
          nit: nit,
          tradeName: tradeName,
          ownerName: ownerName,
          ownerPhonenumber: ownerPhonenumber,
          businessPhonenumber: businessPhonenumber,
        }

        // Validación de los campos del formulario de actualización de info general de un cliente.
        if (!legalName || !nit || !tradeName) {
          return;
        }

        ClientSvc.updateGeneralInfo(clientCredentials)
          .then(function(res) {
            var clientUpdated = res.data;
            $scope.client.legalName = clientUpdated.legalName;
            $scope.client.nit = clientUpdated.nit;
            $scope.client.tradeName = clientUpdated.tradeName;
            $scope.client.ownerName = clientUpdated.ownerName;
            $scope.client.ownerPhonenumber = clientUpdated.ownerPhonenumber;
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
              $scope.showAlertEmployee = "Error, el empleado ya está registrado."
            } else {
              $scope.showAlertEmployee = "No se ha podido crear el empleado.";
            }
            $scope.signingUp = false;
            $scope.signupError = true;
            $scope.showAlertEmployee = true;
          })
      }


      $scope.cloneAddress = function() {
        $scope.client.deliveryAddress = JSON.parse(JSON.stringify($scope.client.billAddress));
      }

      $scope.updatePassword = function() {
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
        if (!currentPassword || !newPassword || !rePassword) {
          return;
        }

        if (newPassword.length < 6 || newPassword !== rePassword) {
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
          .then(function(res) {
            $scope.alertMessagePassword = "La contraseña ha sido cambiada exitosamente.";
            $scope.processing = false;
            $scope.error = false;
            $scope.showAlertPassword = true;
            $scope.user = {};
            $scope.pswForm.$setPristine();
            $scope.pswForm.$setUntouched();
          })
          .catch(function(err) {
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
