import { Component } from "@angular/core";

import { AuthenticationService } from "../auth/authentication.service";
import {Interface} from "./interface";

@Component({
    selector: "top-bar",
    templateUrl: "topbar.component.html"
    })
    export class TopbarComponent {
        constructor(public authService: AuthenticationService,public inter:Interface) {}

        
    }