import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ApiServciesService } from '../api-servcies.service';

declare const M: any;

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {  
  @Input() EmployeeID: number | undefined;
  @Output() EmployeeUpdated = new EventEmitter<boolean>(); 

  designationList:any;
  employeeList:any;
  public global_variables:any = environment;
  editEmployeeProfilePic2:any = "../assets/images/icons/defaultUser.svg"; 
  baseImageURL = this.global_variables.fixedBaseAPI;
  editingRow:number = -1;
  editingTable:any;
  totalPages:number = 1;
  currentPages:number = 1;
  scrollCheckerInitiated:Boolean = false;
  
  
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


  constructor(private api:ApiServciesService) {
    this.designationList = this.api.post("/getDesignations", {}).subscribe(
      (result) => {
        this.designationList = (result as any);
        if (this.designationList.status != "success") { 
        }
        return this.designationList;
      }
    );
    
  }

  ngOnInit(): void {
  }

  ngAfterViewInit():void {
    this.api.post("/emplist/" + this.EmployeeID, {}).subscribe(
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

          this.editEmployeeProfilePic2 = (emplyData?.data[0].ProfilePic)? this.global_variables.fixedBaseAPI + emplyData?.data[0].ProfilePic:"../assets/images/icons/defaultUser.svg";

        }
        else {
          M.Toast.dismissAll();
          M.toast({html: emplyData.message, displayLength: 5000, classes: 'rounded red'});    
        }

      }
    );
  }

  
  TempAndPermAddrHandler(event:any) {
    if (this.editEmployeeForm.get("IsTempAndPermAddrSame")?.value) {
      this.editEmployeeForm.get("PermAddrLine1")?.setValue(this.editEmployeeForm.get("TempAddrLine1")?.value);
      this.editEmployeeForm.get("PermAddrLine2")?.setValue(this.editEmployeeForm.get("TempAddrLine2")?.value);
      this.editEmployeeForm.get("PermAddrPincode")?.setValue(this.editEmployeeForm.get("TempAddrPincode")?.value);
    }
  }
  
  editEmployee(event:any) {
    console.log("Hello");
    if (this.editEmployeeForm.invalid) {
      // this.getFormValidationErrors();
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
          M.toast({html: "Employee updated successfully!", displayLength: 5000, classes: 'rounded green'});    
          this.EmployeeUpdated.emit(true);
        }
        else {
          M.Toast.dismissAll();
          M.toast({html: editUserResult.message, displayLength: 5000, classes: 'rounded red'});         
        }
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
        this.editEmployeeProfilePic2 = reader.result;
    }

    this.editEmployeeForm.get("ProfilePic")?.setValue(event.target.files[0]);
  }


}
