import * as authController from './controller.auth';
import auth from './middleware.auth';
import jwtStrategy from './passport';
import * as authService from './service.auth';
import * as authValidation from './validation.auth';

/* The line `export { authController, auth, authService, authValidation, jwtStrategy };` is exporting
multiple variables from the current module. It allows other modules to import these variables using
the `import` statement. In this case, it is exporting the variables `authController`, `auth`,
`authService`, `authValidation`, and `jwtStrategy` so that other modules can access them. */
export { auth, authController, authService, authValidation, jwtStrategy };
