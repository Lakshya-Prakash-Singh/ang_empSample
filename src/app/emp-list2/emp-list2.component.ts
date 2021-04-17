import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiServciesService } from '../api-servcies.service';
import { environment } from '../../environments/environment';

declare const M: any;


@Component({
  selector: 'app-emp-list2',
  templateUrl: './emp-list2.component.html',
  styleUrls: ['./emp-list2.component.css']
})
export class EmpList2Component implements OnInit {
 
  designationList:any;
  employeeList:any;
  public global_variables:any = environment;
  addEmployeeProfilePic:any = "../assets/images/icons/defaultUser.svg"; 
  editEmployeeProfilePic:any = "../assets/images/icons/defaultUser.svg"; 
  baseImageURL = this.global_variables.fixedBaseAPI;
  editingRow:number = -1;
  editingTable:any;
  totalPages:number = 1;
  currentPages:number = 1;
  scrollCheckerInitiated:Boolean = false;

  
  @ViewChild("FirstName") FirstNameElement: ElementRef | undefined;
  @ViewChild("LastName") LastNameElement: ElementRef | undefined;
  @ViewChild("PhoneNumber") PhoneNumberElement: ElementRef | undefined;
  @ViewChild("AlternateNumber") AlternateNumberElement: ElementRef | undefined;
  @ViewChild("Email") EmailElement: ElementRef | undefined;
  @ViewChild("TempAddrLine1") TempAddrLine1Element: ElementRef | undefined;
  @ViewChild("TempAddrLine2") TempAddrLine2Element: ElementRef | undefined;
  @ViewChild("TempAddrPincode") TempAddrPincodeElement: ElementRef | undefined;
  @ViewChild("IsTempAndPermAddrSame") IsTempAndPermAddrSameElement: ElementRef | undefined;
  @ViewChild("PermAddrLine1") PermAddrLine1Element: ElementRef | undefined;
  @ViewChild("PermAddrLine2") PermAddrLine2Element: ElementRef | undefined;
  @ViewChild("PermAddrPincode") PermAddrPincodeElement: ElementRef | undefined;

  @ViewChild("searchString")  searchString!: ElementRef;

  
  addEmployeeForm = new FormGroup({
    "ProfilePic": new FormControl(),
    "FirstName": new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern("^[A-Za-z]+$")]),
    "LastName": new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern("^[A-Za-z]+$")]),
    "PhoneNumber": new FormControl("", [Validators.required,Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[6-9]\\d{9}$")]),
    "AlternateNumber": new FormControl("", [Validators.pattern("^(\\s*|[6-9]\\d{9})$")]),
    "Email": new FormControl("", [Validators.required, Validators.email, Validators.maxLength(50)]),
    "TempAddrLine1": new FormControl("", [Validators.required, Validators.maxLength(100), Validators.pattern("^[a-zA-Z0-9,-<>/&$%@ ]*$")]),
    "TempAddrLine2": new FormControl("", [Validators.required, Validators.maxLength(100), Validators.pattern("^[a-zA-Z0-9,-<>/&$%@ ]*$")]),
    "TempAddrPincode": new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^[0-9]*$")]),
    "IsTempAndPermAddrSame": new FormControl(),
    "PermAddrLine1": new FormControl("", [Validators.required, Validators.maxLength(100), Validators.pattern("^[a-zA-Z0-9,-<>/&$%@ ]*$")]),
    "PermAddrLine2": new FormControl("", [Validators.required, Validators.maxLength(100), Validators.pattern("^[a-zA-Z0-9,-<>/&$%@ ]*$")]),
    "PermAddrPincode": new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^[0-9]*$")]),
    "Designation": new FormControl("", [Validators.required])
  });

  editEmployeeForm = new FormGroup({
    "ProfilePic": new FormControl(),
    "ID": new FormControl("", [Validators.required]),
    "FirstName": new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern("^[A-Za-z]+$")]),
    "LastName": new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern("^[A-Za-z]+$")]),
    "PhoneNumber": new FormControl("", [Validators.required,Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[6-9]\\d{9}$")]),
    "AlternateNumber": new FormControl("", [Validators.pattern("^(\\s*|[6-9]\\d{9})$")]),
    "Email": new FormControl("", [Validators.required, Validators.email, Validators.maxLength(50)]),
    "TempAddrLine1": new FormControl("", [Validators.required, Validators.maxLength(100), Validators.pattern("^[a-zA-Z0-9,-<>/&$%@ ]*$")]),
    "TempAddrLine2": new FormControl("", [Validators.required, Validators.maxLength(100), Validators.pattern("^[a-zA-Z0-9,-<>/&$%@ ]*$")]),
    "TempAddrPincode": new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^[0-9]*$")]),
    "IsTempAndPermAddrSame": new FormControl(),
    "PermAddrLine1": new FormControl("", [Validators.required, Validators.maxLength(100), Validators.pattern("^[a-zA-Z0-9,-<>/&$%@ ]*$")]),
    "PermAddrLine2": new FormControl("", [Validators.required, Validators.maxLength(100), Validators.pattern("^[a-zA-Z0-9,-<>/&$%@ ]*$")]),
    "PermAddrPincode": new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^[0-9]*$")]),
    "Designation": new FormControl("", [Validators.required])
  });



  constructor(private api:ApiServciesService) {

    this.designationList = this.api.post("/getDesignations", {}).subscribe(
      (result) => {
        this.designationList = (result as any);
        if (this.designationList.status != "success") {
          // M.toast({html: this.employeeList.message, displayLength: 5000, classes: 'rounded red'});    
        }
        return this.designationList;
      }
    );

    this.employeeList = this.api.post("/emplist", {PageNumber: this.currentPages, searchString: this.searchString?.nativeElement.value}).subscribe(
      (result) => {
        this.employeeList = (result as any);
        if (this.employeeList.status != "success") {
          // M.toast({html: this.employeeList.message, displayLength: 5000, classes: 'rounded red'});    
        }
        this.totalPages = Math.ceil(this.employeeList.dataCount / 10);
        return this.employeeList;
      }
    );
    

  }

  ngOnInit(): void {
    this.doSomething();
  }

  @HostListener('window:scroll', ['$event']) 
  async doSomething() {
    let offSet = window.pageYOffset + window.innerHeight;
    let height = document.documentElement.offsetHeight;
    let scrolledPercentage = (offSet / height * 100);

    

    if (scrolledPercentage >= 90 && (this.totalPages >= (this.currentPages + 1)) && !this.scrollCheckerInitiated) {
      this.scrollCheckerInitiated = true;
      this.currentPages = this.currentPages + 1;
      this.api.post("/emplist", {PageNumber: this.currentPages,searchString: this.searchString?.nativeElement.value}).subscribe(
        (result) => {
          var response = (result as any);
          if (this.employeeList.status == "success") {
            response.data.forEach((element:any) => {
              this.employeeList.data.push(element);
            });
          }
          this.scrollCheckerInitiated = false;
          return this.employeeList;
        }
      );
    };
  }
  

  ngAfterViewInit(): void {
    M.AutoInit();
  }

  TempAndPermAddrHandler(event:any) {
    if (this.addEmployeeForm.get("IsTempAndPermAddrSame")?.value) {
      this.addEmployeeForm.get("PermAddrLine1")?.setValue(this.addEmployeeForm.get("TempAddrLine1")?.value);
      this.addEmployeeForm.get("PermAddrLine2")?.setValue(this.addEmployeeForm.get("TempAddrLine2")?.value);
      this.addEmployeeForm.get("PermAddrPincode")?.setValue(this.addEmployeeForm.get("TempAddrPincode")?.value);
    }
    if (this.editEmployeeForm.get("IsTempAndPermAddrSame")?.value) {
      this.editEmployeeForm.get("PermAddrLine1")?.setValue(this.editEmployeeForm.get("TempAddrLine1")?.value);
      this.editEmployeeForm.get("PermAddrLine2")?.setValue(this.editEmployeeForm.get("TempAddrLine2")?.value);
      this.editEmployeeForm.get("PermAddrPincode")?.setValue(this.editEmployeeForm.get("TempAddrPincode")?.value);
    }
  }

  getFormValidationErrors() {
    Object.keys(this.editEmployeeForm.controls).forEach(key => {
  
    const controlErrors = this.editEmployeeForm.get(key)?.errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
  }

  addEmployee(event:any):void {
    if (this.addEmployeeForm.invalid) {
        this.addEmployeeForm.markAllAsTouched();
        M.toast({html: 'Please Fill All Required Feilds And Remove Errors To Proceed!', displayLength: 5000, classes: 'rounded red'});      
        return;
    }

    const addEmployeeFormData = new FormData();
    addEmployeeFormData.append("FirstName", this.addEmployeeForm.get("FirstName")?.value)
    addEmployeeFormData.append("LastName", this.addEmployeeForm.get("LastName")?.value)
    addEmployeeFormData.append("PhoneNumber", this.addEmployeeForm.get("PhoneNumber")?.value)
    addEmployeeFormData.append("AlternateNumber", this.addEmployeeForm.get("AlternateNumber")?.value)
    addEmployeeFormData.append("Email", this.addEmployeeForm.get("Email")?.value)
    addEmployeeFormData.append("TempAddrLine1", this.addEmployeeForm.get("TempAddrLine1")?.value)
    addEmployeeFormData.append("TempAddrLine2", this.addEmployeeForm.get("TempAddrLine2")?.value)
    addEmployeeFormData.append("TempAddrPincode", this.addEmployeeForm.get("TempAddrPincode")?.value)
    addEmployeeFormData.append("IsTempAndPermAddrSame", this.addEmployeeForm.get("IsTempAndPermAddrSame")?.value)
    addEmployeeFormData.append("PermAddrLine1", this.addEmployeeForm.get("PermAddrLine1")?.value)
    addEmployeeFormData.append("PermAddrLine2", this.addEmployeeForm.get("PermAddrLine2")?.value)
    addEmployeeFormData.append("PermAddrPincode", this.addEmployeeForm.get("PermAddrPincode")?.value)
    addEmployeeFormData.append("Designation", this.addEmployeeForm.get("Designation")?.value)
    addEmployeeFormData.append("ProfilePic", this.addEmployeeForm.get("ProfilePic")?.value)
    
    this.api.post("/addEmployee", addEmployeeFormData).subscribe(
      (result) => {
        const addEmployeeData = (result as any);
        if (addEmployeeData.status != "success") {
          M.toast({html: addEmployeeData.message, displayLength: 5000, classes: 'rounded red'}); 
        }
        else {
          this.employeeList = this.api.post("/emplist", {}).subscribe(
            (result) => {
              this.employeeList = (result as any);
              if (this.employeeList.status == "success") {
                this.addEmployeeForm.setValue({
                  ProfilePic : "",
                  FirstName : "",
                  LastName : "",
                  PhoneNumber : "",
                  AlternateNumber : "",
                  Email : "",
                  TempAddrLine1 : "",
                  TempAddrLine2 : "",
                  TempAddrPincode : "",
                  IsTempAndPermAddrSame : "",
                  PermAddrLine1 : "",
                  PermAddrLine2 : "",
                  PermAddrPincode : "",
                  Designation : ""
                });
                this.currentPages = 1;
                window.scrollTo(0, 0);
                M.toast({html: "Employee Added Successfully!", displayLength: 5000, classes: 'rounded green'}); 
              }
              else {
                M.toast({html: this.employeeList.message, displayLength: 5000, classes: 'rounded red'});    
              }
              return this.employeeList;
            }
          );
        }
      }
    );

    


  }

  updateList(id:string, event?:any) {
    console.log(id);  
    this.api.post("/emplist/" + id, {}).subscribe(
      (result) => {
        let emplyData = (result as any);
        
        if (emplyData.status == "success") {

          this.editEmployeeForm.setValue({
            "ProfilePic": "",
            "ID": emplyData.data[0]._id,
            "FirstName": (emplyData.data[0].FirstName)? emplyData.data[0].FirstName: "",
            "LastName": (emplyData.data[0].LastName)? emplyData.data[0].LastName: "",
            "PhoneNumber": (emplyData.data[0].PhoneNumber)? emplyData.data[0].PhoneNumber: "",
            "AlternateNumber": (emplyData.data[0].AltPhoneNumber)? emplyData.data[0].AltPhoneNumber: "",
            "Email": (emplyData.data[0].Email)? emplyData.data[0].Email: "",
            "TempAddrLine1": (emplyData.data[0].TempAddrLine1)? emplyData.data[0].TempAddrLine1: "",
            "TempAddrLine2": (emplyData.data[0].TempAddrLine2)? emplyData.data[0].TempAddrLine2: "",
            "TempAddrPincode": (emplyData.data[0].TempAddrPincode)? emplyData.data[0].TempAddrPincode: "",
            "IsTempAndPermAddrSame": (emplyData.data[0].IsTempAndPermAddrSame)? emplyData.data[0].IsTempAndPermAddrSame: "",
            "PermAddrLine1": (emplyData.data[0].PermAddrLine1)? emplyData.data[0].PermAddrLine1: "",
            "PermAddrLine2": (emplyData.data[0].PermAddrLine2)? emplyData.data[0].PermAddrLine2: "",
            "PermAddrPincode": (emplyData.data[0].PermAddrPincode)? emplyData.data[0].PermAddrPincode: "",
            "Designation": (emplyData.data[0].Designation)? emplyData.data[0].Designation: ""
          });

          this.LastNameElement?.nativeElement.focus();
          this.PhoneNumberElement?.nativeElement.focus();
          this.AlternateNumberElement?.nativeElement.focus();
          this.EmailElement?.nativeElement.focus();
          this.TempAddrLine1Element?.nativeElement.focus();
          this.TempAddrLine2Element?.nativeElement.focus();
          this.TempAddrPincodeElement?.nativeElement.focus();
          this.IsTempAndPermAddrSameElement?.nativeElement.focus();
          this.PermAddrLine1Element?.nativeElement.focus();
          this.PermAddrLine2Element?.nativeElement.focus();
          this.PermAddrPincodeElement?.nativeElement.focus();
          this.FirstNameElement?.nativeElement.focus();

          this.editEmployeeProfilePic = (emplyData?.data[0].ProfilePic)? this.global_variables.fixedBaseAPI + emplyData?.data[0].ProfilePic:"../assets/images/icons/defaultUser.svg";

        }
        else {
          M.Toast.dismissAll();
          M.toast({html: emplyData.message, displayLength: 5000, classes: 'rounded red'});    
        }

      }
    );
  }

  editEmployee(event:any) {
    console.log("Hello");
    if (this.editEmployeeForm.invalid) {
      this.getFormValidationErrors();
      M.toast({html: 'Please Fill All Required Feilds And Remove Errors To Proceed!', displayLength: 5000, classes: 'rounded red'});      
      return;
    }

    const editEmployeeFormData = new FormData();
    editEmployeeFormData.append("FirstName", this.editEmployeeForm.get("FirstName")?.value)
    editEmployeeFormData.append("LastName", this.editEmployeeForm.get("LastName")?.value)
    editEmployeeFormData.append("PhoneNumber", this.editEmployeeForm.get("PhoneNumber")?.value)
    editEmployeeFormData.append("AlternateNumber", this.editEmployeeForm.get("AlternateNumber")?.value)
    editEmployeeFormData.append("Email", this.editEmployeeForm.get("Email")?.value)
    editEmployeeFormData.append("TempAddrLine1", this.editEmployeeForm.get("TempAddrLine1")?.value)
    editEmployeeFormData.append("TempAddrLine2", this.editEmployeeForm.get("TempAddrLine2")?.value)
    editEmployeeFormData.append("TempAddrPincode", this.editEmployeeForm.get("TempAddrPincode")?.value)
    editEmployeeFormData.append("IsTempAndPermAddrSame", this.editEmployeeForm.get("IsTempAndPermAddrSame")?.value)
    editEmployeeFormData.append("PermAddrLine1", this.editEmployeeForm.get("PermAddrLine1")?.value)
    editEmployeeFormData.append("PermAddrLine2", this.editEmployeeForm.get("PermAddrLine2")?.value)
    editEmployeeFormData.append("PermAddrPincode", this.editEmployeeForm.get("PermAddrPincode")?.value)
    editEmployeeFormData.append("Designation", this.editEmployeeForm.get("Designation")?.value)
    editEmployeeFormData.append("ProfilePic", this.editEmployeeForm.get("ProfilePic")?.value)

    this.api.put("/updtEmployee/" + this.editEmployeeForm.get("ID")?.value, editEmployeeFormData).subscribe(
      (result) => {
        const editUserResult = (result as any);
        if (editUserResult.status == "success") {          
          this.employeeList = this.api.post("/emplist", {}).subscribe(
            (result) => {
              this.employeeList = (result as any);
              if (this.employeeList.status == "success") {
                this.currentPages = 1;
                window.scrollTo(0, 0);
                M.toast({html: "Employee Updated Successfully!", displayLength: 5000, classes: 'rounded green'}); 
              }
              else {
                M.toast({html: this.employeeList.message, displayLength: 5000, classes: 'rounded red'});    
              }
              return this.employeeList;
            }
          ); 
        }
        else {
          M.Toast.dismissAll();
          M.toast({html: editUserResult.message, displayLength: 5000, classes: 'rounded red'});         
        }
      }
    );
  }

  deleteUserInitiator(id:string, name:string, event?:any) {
    if (confirm("You really want to delete " + name)) {        
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: {
          ID: id
        },
      };
      this.employeeList = this.api.delete("/employee", options).subscribe(
        (result) => {
          const deleteUserResult = (result as any);
          if (deleteUserResult.status != "success") {
            M.toast({html: this.employeeList.message, displayLength: 5000, classes: 'rounded red'}); 
          }
          else {
            this.employeeList = this.api.post("/emplist", {}).subscribe(
              (result) => {
                this.employeeList = (result as any);
                if (this.employeeList.status == "success") {
                  M.toast({html: "Employee deleted Successfully!", displayLength: 5000, classes: 'rounded green'}); 
                  this.currentPages = 1;
                  window.scrollTo(0, 0);
                }
                else {
                  M.toast({html: this.employeeList.message, displayLength: 5000, classes: 'rounded red'});    
                }
                return this.employeeList;
              }
            );
          }
        }
      );
    }
  }

  employeeSearch(searchString:any) {
    searchString = (typeof searchString == "string")? searchString: searchString.target.value;
    this.employeeList = this.api.post("/emplist", {searchString: searchString}).subscribe(
      (result) => {
        var response = (result as any);
        if (response.status == "success") {
          console.log(response);
          this.currentPages = 1;
          this.totalPages = Math.ceil(response.dataCount / 10);
          window.scrollTo(0, 0);
          if (typeof response.data != "object") {
            response.data = [];
          }
          this.employeeList = response;
        }
        else {
          M.toast({html: response.message, displayLength: 5000, classes: 'rounded red'});    
        }
        return response;
      }
    ); 
  }

  editEmployeeForm_ImageUpload(event: any) {   
    const files = event.target.files;
    if (files.length === 0)
        return;   


    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        M.Toast.dismissAll();
        M.toast({html: 'Invalid File! Only images allowed.', displayLength: 5000, classes: 'rounded red'});
        return;
    }

    console.log(files[0].size);
    if (files[0].size >= 600000) {
      M.Toast.dismissAll();
      M.toast({html: 'Image Should be less than 5mb!', displayLength: 5000, classes: 'rounded red'});
      return;
    }

    
    const reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
        this.editEmployeeProfilePic = reader.result;
    }

    this.editEmployeeForm.get("ProfilePic")?.setValue(event.target.files[0]);
  }

  
  addEmployeeForm_ImageUpload(event: any) {    
    const files = event.target.files;
    if (files.length === 0)
        return;   


    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        M.toast({html: 'Invalid File! Only images allowed.', displayLength: 5000, classes: 'rounded red'});
        return;
    }

    console.log(files[0].size);
    if (files[0].size >= 600000) {
      M.Toast.dismissAll();
      M.toast({html: 'Image Should be less than 5mb!', displayLength: 5000, classes: 'rounded red'});
      return;
    }

    
    const reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
        this.addEmployeeProfilePic = reader.result;
    }

    this.addEmployeeForm.get("ProfilePic")?.setValue(event.target.files[0]);
  }

  closeSearch() {
    this.searchString.nativeElement.value = "";
    this.employeeSearch("")
  }

}
