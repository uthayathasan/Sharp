import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser"
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AdminComponent } from "./admin.component";
import{StoresComponent} from "./stores.component";
import {SidebarComponent} from "./sidebar.component";
import {TopbarComponent} from "./topbar.component";
import {NodesComponent} from "./nodes.component";
import {ChildsComponent} from "./childs.component";
import {Interface} from "./interface";
@NgModule({
imports: [BrowserModule, RouterModule, FormsModule],
declarations: [AdminComponent,StoresComponent,SidebarComponent,TopbarComponent,NodesComponent,ChildsComponent],
providers: [Interface]
})
export class AdminModule { }