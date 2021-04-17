import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'

import { LoginComponent } from "./login/login.component";
import { EmpList1Component } from "./emp-list1/emp-list1.component";
import { EmpList2Component } from "./emp-list2/emp-list2.component";

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "alternatepage", canActivate: [AuthGuard], component: EmpList2Component},
  {path: "", canActivate: [AuthGuard], component: EmpList1Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
