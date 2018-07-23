import { Component } from "@angular/core";
import {Interface} from "./interface";
import { Router } from "@angular/router";
@Component({
    selector: "nodes-component",
    templateUrl: "nodes.component.html"
    })
    export class NodesComponent {
        constructor(public inter:Interface,private router: Router) {
            if(inter.getStore()==null){
                this.router.navigateByUrl("/admin/stores");
            }
        }        
    }