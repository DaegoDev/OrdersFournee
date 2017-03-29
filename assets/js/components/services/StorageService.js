angular.module('fournee')
.factory('StorageService', function(){

	// Servicios basicos para la gestion de sesiones.
	return {
		get: function (key, type) {
			switch (type) {
				case 'local':
					return localStorage.getItem(key);
				case 'session':
					return sessionStorage.getItem(key);
				}
		},
		set: function (key, value, type) {
			switch (type) {
				case 'local':
					return localStorage.setItem(key, value);
				case 'session':
					return sessionStorage.setItem(key, value);
			}
		},
		unset: function (key, type) {
			switch (type) {
				case 'local':
					return localStorage.removeItem(key);
				case 'session':
					return sessionStorage.removeItem(key);
			}
		}
	};
});
