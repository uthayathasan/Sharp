import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser"
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AdminComponent } from "./admin.component";
import {OverviewComponent} from "./overview.component";

@NgModule({
imports: [BrowserModule, RouterModule, FormsModule],
declarations: [AdminComponent,OverviewComponent]
})
export class AdminModule { }