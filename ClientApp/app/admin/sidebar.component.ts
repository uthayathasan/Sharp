import { Component } from "@angular/core";
import { Repository } from "../models/repository";
import {Interface} from "./interface";
@Component({
    selector: "side-bar",
    templateUrl: "sidebar.component.html"
    })
    export class SidebarComponent {
        constructor(private repo: Repository,public inter:Interface) {}        
    }