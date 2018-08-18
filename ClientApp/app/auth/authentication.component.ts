import {Component, OnInit} from '@angular/core';
import { AuthenticationService } from './authentication.service';
@Component({
templateUrl: 'authentication.component.html'
})
export class AuthenticationComponent implements OnInit {
    constructor(public authService: AuthenticationService) {}
    showError = false;
    ngOnInit() {
        this.authService.getLogedIn().subscribe(response => {
            if (response !== null) {
                this.authService.logedIn = response;
                this.authService.name = this.authService.logedIn.logedinUser;
                this.authService.password = this.authService.logedIn.logedinPassword;
            }
        });
    }
    login() {
        this.showError = false;
        this.authService.login().subscribe(result => {this.showError = !result; });
    }
}
