// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.



export const environment = {
  production: false,



  fixedUserURL: "http://localhost:3000/api/1.0.0/admin",
  fixedBaseAPI: "http://localhost:3000/",
  IsLoggedIn: () => {
    if (typeof localStorage.getItem("UserEmail") == "undefined" || localStorage.getItem("UserEmail") == null || localStorage.getItem("UserEmail") == "") {
      return false;
    }
    else {
      return true;
    }
  },
  logInDetails: {
    UserName: localStorage.getItem("UserName"),
    UserFirstName: localStorage.getItem("UserFirstName"),
    UserLastName: localStorage.getItem("UserLastName"),
    UserPhoneNumber: localStorage.getItem("UserPhoneNumber"),
    UserEmail: localStorage.getItem("UserEmail"),
    UserProfilePic: localStorage.getItem("UserProfilePic")
  },
  updateLogInDetails: () => { 
    return {
      UserName : localStorage.getItem("UserName"),
      UserFirstName : localStorage.getItem("UserFirstName"),
      UserLastName : localStorage.getItem("UserLastName"),
      UserPhoneNumber : localStorage.getItem("UserPhoneNumber"),
      UserEmail : localStorage.getItem("UserEmail"),
      UserProfilePic : localStorage.getItem("UserProfilePic")
    }
    
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
