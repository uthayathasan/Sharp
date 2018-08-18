import {Component, OnInit} from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Repository } from '../models/repository';
@Component({
templateUrl: 'authentication.component.html'
})
export class AuthenticationComponent implements OnInit {
    constructor(public authService: AuthenticationService, private repo: Repository) {
        this.authService.getLogedIn().subscribe(response => {
            if (response) {
                this.authService.logedIn = response;
                this.authService.name = this.authService.logedIn.logedinUser;
                this.authService.password = this.authService.logedIn.logedinPassword;

                this.authService.getStore().subscribe(result => {
                    if (result) {
                        this.repo.selecttedStore = result;
                        this.repo.setStoreDto();
                    }
                    this.login();
                });
            }
        });
    }
    showError = false;
    ngOnInit() {}
    login() {
        this.showError = false;
        this.authService.login().subscribe(result => {this.showError = !result; });
    }
}
