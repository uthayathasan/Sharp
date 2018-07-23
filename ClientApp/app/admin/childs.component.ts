import { Component } from "@angular/core";
import {Interface} from "./interface";
import { Router } from "@angular/router";
@Component({
    selector: "childs-component",
    templateUrl: "childs.component.html"
    })
    export class ChildsComponent {
        constructor(public inter:Interface,private router: Router) {
            if(inter.getStore()==null){
                this.router.navigateByUrl("/admin/stores");
            }
        }        
    }