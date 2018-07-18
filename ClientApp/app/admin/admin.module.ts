import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser"
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AdminComponent } from "./admin.component";

@NgModule({
imports: [BrowserModule, RouterModule, FormsModule],
declarations: [AdminComponent]
})
export class AdminModule { }