import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { ApiServciesService } from '../api-servcies.service';

declare const M: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public global_variables:any = environment;
  ProfilePic:any = "../assets/images/icons/defaultUser.svg";
  IsLogInFormSubmitTried:Boolean = false;

  constructor(private api:ApiServciesService, private pageRouter:Router) { }

  loginForm = new FormGroup({
    "Email": new FormControl("", [Validators.required, Validators.email]),
    "Password": new FormControl("", [Validators.minLength(8), Validators.maxLength(20)])
  });

  ngOnInit(): void {
  }

  login(event: any) {

    this.IsLogInFormSubmitTried = true;

    if (this.loginForm.invalid) { 
      M.Toast.dismissAll();
      M.toast({html: 'Please Fill All Required Feilds And Remove Errors To Proceed!', displayLength: 5000, classes: 'rounded red'});
      return false;
    }
    
    this.api.post("/login", {Email: this.loginForm.get('Email')?.value, PhoneNumber: this.loginForm.get('Phone Number')?.value, Password: (this.loginForm.get("Password")?.value)}).subscribe(
      (result) => {
        
        let loginData = (result as any);

        console.log(loginData);

        if (loginData.status == "success") {

          M.Toast.dismissAll();
          M.toast({html: 'Logged In Successfully!', displayLength: 5000, classes: 'rounded green'});
    
          localStorage.setItem("UserName", loginData.data[0].FirstName + " " + loginData.data[0].LastName);
          localStorage.setItem("UserFirstName", loginData.data[0].FirstName);
          localStorage.setItem("UserLastName", loginData.data[0].LastName);
          localStorage.setItem("UserPhoneNumber", loginData.data[0].PhoneNumber);
          localStorage.setItem("UserEmail", loginData.data[0].Email);
          localStorage.setItem("UserProfilePic", loginData.data[0].ProfilePic);

          this.global_variables.logInDetails.UserName = loginData.data[0].FirstName + " " + loginData.data[0].LastName;
          this.global_variables.logInDetails.UserFirstName = loginData.data[0].FirstName;
          this.global_variables.logInDetails.UserLastName = loginData.data[0].LastName;
          this.global_variables.logInDetails.UserPhoneNumber = loginData.data[0].PhoneNumber;
          this.global_variables.logInDetails.UserEmail = loginData.data[0].Email;
          this.global_variables.logInDetails.UserProfilePic = loginData.data[0].ProfilePic;
    
          this.pageRouter.navigateByUrl("");
    
        }
        else {          
          M.Toast.dismissAll();
          M.toast({html: loginData.message, displayLength: 5000, classes: 'rounded red'});    
        }
      }
    );
    
    return false;
  }

}
