import { Component } from "@angular/core";
import { AuthenticationService } from "../auth/authentication.service";
@Component({
templateUrl: "admin.component.html"
})
export class AdminComponent {
constructor(public authService: AuthenticationService) {}
}