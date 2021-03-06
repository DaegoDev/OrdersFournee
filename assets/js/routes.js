var fournee = angular.module('fournee');

fournee.config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'templates/public/home.html',
    controller: 'HomeCtrl'
  })

  /**
  * RUTAS DE ACCESO DE UN ADMINISTRADOR.
  */
  .state("admin", {
    url: "/admin",
    templateUrl: "templates/private/admin/index.html",
    // controller: "AdminController",
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  // Client creation routes.
  .state('client', {
    url: '/client',
    templateUrl: 'templates/private/admin/client.html',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('client.list', {
    url: '/list',
    templateUrl: 'templates/private/admin/client-list.html',
    controller: 'ClientListCtrl',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('client.details', {
    url: '/details',
    templateUrl: 'templates/private/admin/client-details.html',
    controller: 'ClientDetailsCtrl',
    params: {
      client: null
    },
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('client.create', {
    url: '/create',
    templateUrl: 'templates/private/admin/client-create.html',
    controller: 'clientCreateCtrl',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('client.create.user', {
    url: '/user',
    templateUrl: 'templates/private/admin/client-create-user.html',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('client.create.info', {
    url: '/info',
    templateUrl: 'templates/private/admin/client-create-info.html',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('client.create.products', {
    url: '/products',
    templateUrl: 'templates/private/admin/client-create-products.html',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })

  // Product routes.
  .state('product', {
    url: '/product',
    templateUrl: 'templates/private/shared/product.html',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('product.list', {
    url: '/list',
    templateUrl: 'templates/private/shared/product-list.html',
    controller: 'productListCtrl',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('product.disable', {
    url: '/disableProduct',
    templateUrl: 'templates/private/shared/product-disable.html',
    controller: 'productDisableCtrl',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('product.update', {
    url: '/update',
    templateUrl: 'templates/private/shared/product-update.html',
    controller: 'ProductUpdateCtrl',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('product.create', {
    url: '/create',
    templateUrl: 'templates/private/shared/product-create.html',
    controller: 'productCreateCtrl',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })

  // Employee routes
  .state('employee',{
    url: '/employee',
    templateUrl: 'templates/private/admin/employee.html',
  })
  .state('employee.create', {
    url: '/create',
    templateUrl: 'templates/private/admin/employee-create.html',
    controller: 'EmployeeCreateCtrl',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('employee.list', {
    url: '/list',
    templateUrl: 'templates/private/admin/employee-list.html',
    controller: 'EmployeeListCtrl',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })

  // Announcements routes
  .state('announcement', {
    url: '/announcement',
    templateUrl: 'templates/private/admin/announcement.html',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('announcement.create', {
    url: '/create',
    templateUrl: 'templates/private/admin/announcement-create.html',
    controller: 'AnnouncementCreateCtrl',
    params: {announcement: null, mode: null},
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('announcement.list', {
    url: '/list',
    templateUrl: 'templates/private/admin/announcement-list.html',
    controller: 'AnnouncementListCtrl',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('announcementPreview', {
    url: '/preview',
    templateUrl: 'templates/private/admin/announcement-preview.html',
    controller: 'AnnouncementPreviewCtrl',
    params: {announcement: null, mode: null},
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })

  // Reports routes
  .state('report', {
    url: '/report',
    templateUrl: 'templates/private/admin/report/report.html',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('report.productMinMaxPrice', {
    url: '/productMinMaxPrice',
    templateUrl: 'templates/private/admin/report/product-price.html',
    controller: 'ReportProductPriceCtrl',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  // Productions routes
  .state('production', {
    url: '/production',
    templateUrl: 'templates/private/admin/production/production.html',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('production.config', {
    url: '/config',
    templateUrl: 'templates/private/admin/production/production-config.html',
    controller: 'ProductionConfigCtrl',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('production.report', {
    url: '/report',
    templateUrl: 'templates/private/admin/production/production-report.html',
    controller: 'ProductionReportCtrl',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })

  .state('report.amountProductsByClients', {
    url: '/amountProductsByClients',
    templateUrl: 'templates/private/admin/report/products-clients-amount.html',
    controller: 'AmountProductsByClientsCtrl',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })

  // Recipes routes
  .state('recipe', {
    url: '/recipes',
    templateUrl: 'templates/private/admin/recipe/recipes.html',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('recipe.config', {
    url: '/recipes',
    templateUrl: 'templates/private/admin/recipe/recipes-config.html',
    controller: 'RecipeConfigCtrl',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('recipe.ingredients', {
    url: '/ingredients',
    templateUrl: 'templates/private/admin/recipe/recipe-ingredients.html',
    controller: 'IngredientsCtrl',
    data: {
      permissions: {
        only: "ADMINISTRADOR",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })

  /**
  * RUTAS DE ACCESO DE UN CLIENTE.
  */
  .state("clientRole", {
    url: "/clientR",
    templateUrl: "templates/private/client/index.html",
    data: {
      permissions: {
        only: "CLIENTE",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  // Order routes.
  .state('order', {
    url: '/order',
    templateUrl: 'templates/private/client/order.html',
    controller: 'OrderCtrl'
  })
  .state('order.myList', {
    url: '/list',
    templateUrl: 'templates/private/client/order-my-list.html',
    controller: 'OrderMyListCtrl',
    data: {
      permissions: {
        only: "CLIENTE",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('order.create', {
    url: '/create',
    templateUrl: 'templates/private/client/order-create.html',
    controller: 'OrderCreateCtrl',
    params: {
      order: null
    },
    data: {
      permissions: {
        only: "CLIENTE",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('order.create.shoppingCart', {
    url: '/shoppingCart',
    templateUrl: 'templates/private/client/order-create-shoppingCart.html',
    data: {
      permissions: {
        only: "CLIENTE",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('order.create.shoppingCartUpdate', {
    url: '/shoppingCartUpdate',
    templateUrl: 'templates/private/client/order-create-shoppingCart.html',
    data: {
      permissions: {
        only: "CLIENTE",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('order.create.info', {
    url: '/info',
    templateUrl: 'templates/private/client/order-create-info.html',
    data: {
      permissions: {
        only: "CLIENTE",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })

  // Perfil routes
  .state('clientProfile', {
    url: '/clientProfile',
    templateUrl: 'templates/private/client/client-profile.html',
    controller: 'ClientProfileCtrl',
    data: {
      permissions: {
        only: "CLIENTE",
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })

  // Recover password routes
  .state('recoverPassword', {
    url: '/recoverPassword',
    templateUrl: 'templates/private/client/recover-password.html',
    controller: 'RecoverPasswordCtrl'
  })

  /**
  * RUTAS DE ACCESO DE UN EMPLEADO.
  */

  // Profile routes
  .state('employeeProfile', {
    url: '/employeeProfile',
    templateUrl: 'templates/private/employee/employee-profile.html',
    controller: 'EmployeeProfileCtrl',
    data: {
      permissions: {
        only: ["ADMINISTRADOR", "DESPACHADOR"],
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })

  // Order routes
  .state('orders',{
    url: '/orders',
    templateUrl: 'templates/private/employee/orders.html',
    data: {
      permissions: {
        only: ["ADMINISTRADOR", "DESPACHADOR"],
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('orders.orderList', {
    url: '/orderList',
    templateUrl: 'templates/private/employee/order-list.html',
    controller: 'OrderListCtrl',
    data: {
      permissions: {
        only: ["ADMINISTRADOR", "DESPACHADOR"],
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
  .state('orders.productProduction', {
    url: '/productProduction',
    templateUrl: 'templates/private/employee/product-production.html',
    controller: 'ProductProductionCtrl',
    data: {
      permissions: {
        only: ["ADMINISTRADOR", "DESPACHADOR"],
        except: "ANON",
        redirectTo: 'home'
      }
    }
  })
}]);
