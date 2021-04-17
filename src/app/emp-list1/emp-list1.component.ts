import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ApiServciesService } from '../api-servcies.service';
import { environment } from '../../environments/environment';

declare const M: any;


@Component({
  selector: 'app-emp-list1',
  templateUrl: './emp-list1.component.html',
  styleUrls: ['./emp-list1.component.css']
})
export class EmpList1Component implements OnInit {
  
  designationList:any;
  employeeList:any;
  public global_variables:any = environment;
  addEmployeeProfilePic:any = "../assets/images/icons/defaultUser.svg"; 
  editEmployeeProfilePic:any = "../assets/images/icons/defaultUser.svg"; 
  baseImageURL = this.global_variables.fixedBaseAPI;
  editingRow:number = -1;
  editingTable = new FormArray([]);
  totalPages:any;
  currentPage:number = 1;

  
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
        if (this.employeeList.status != "success") {
          // M.toast({html: this.employeeList.message, displayLength: 5000, classes: 'rounded red'});    
        }
        return this.designationList;
      }
    );

    this.employeeList = this.api.post("/emplist", {}).subscribe(
      (result) => {
        this.employeeList = (result as any);
        if (this.employeeList.status != "success") {
          
        }
        this.totalPages = Array(Math.ceil(this.employeeList.dataCount / 10)).fill("").map((x,i)=>i + 1);
        console.log(this.totalPages);
        return this.employeeList;
      }
    );

  }

  ngOnInit(): void {
  }

  getPageData(pageNumber:number) {    
    this.employeeList = this.api.post("/emplist", {PageNumber: pageNumber}).subscribe(
      (result) => {
        this.employeeList = (result as any);
        if (this.employeeList.status != "success") {
          // M.toast({html: this.employeeList.message, displayLength: 5000, classes: 'rounded red'});    
        }
        this.totalPages = Array(Math.ceil(this.employeeList.dataCount / 10)).fill("").map((x,i)=>i + 1);
        this.currentPage = pageNumber;
        this.editingRow = -1;
        console.log(this.totalPages);
        return this.employeeList;
      }
    );
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
  }

  getFormValidationErrors() {
    Object.keys(this.addEmployeeForm.controls).forEach(key => {
  
    const controlErrors = this.addEmployeeForm.get(key)?.errors;
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
                })
                M.toast({html: "Employee Added Successfully!", displayLength: 5000, classes: 'rounded green'}); 
              }
              else {
                M.toast({html: this.employeeList.message, displayLength: 5000, classes: 'rounded red'});    
              }
              this.totalPages = Array(Math.ceil(this.employeeList.dataCount / 10)).fill("").map((x,i)=>i + 1);
              // console.log(this.totalPages);
              return this.employeeList;
            }
          );
        }
      }
    );

    


  }
  
  updateList(id:string, index:number, event?:any) {
    if (this.editingRow != index) {
      this.editingRow = index;
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

          }
        }
      );            
    }
    else {
      this.editingTable.clear();
      this.editingRow = -1;
      this.editingTable.push(this.editEmployeeForm);
    }
    
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
                }
                else {
                  M.toast({html: this.employeeList.message, displayLength: 5000, classes: 'rounded red'});    
                }
                this.totalPages = Array(Math.ceil(this.employeeList.dataCount / 10)).fill("").map((x,i)=>i + 1);
                // console.log(this.totalPages);
                return this.employeeList;
              }
            );
          }
        }
      );
    }
  }

  addEmployeeForm_ImageUpload(event: any) {    
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
        this.addEmployeeProfilePic = reader.result;
    }

    this.addEmployeeForm.get("ProfilePic")?.setValue(event.target.files[0]);
  }

  getEmployeeUpdated(isEmployeeUpdated: any) {
    if (isEmployeeUpdated) {
      this.getPageData(this.currentPage);
    }
  }


}
