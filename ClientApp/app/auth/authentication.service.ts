import { Injectable } from '@angular/core';
import { Repository } from '../models/repository';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import { LocalStorage } from '@ngx-pwa/local-storage';
import {LogedIn} from '../models/logedIn.model';
import { Store } from '../models/store.model';
@Injectable()
export class AuthenticationService {
    constructor(private repo: Repository, private router: Router, private localStorage: LocalStorage) {
        this.logedIn = new LogedIn;
     }
    authenticated = false;
    name: string;
    password: string;
    callbackUrl: string;
    logedIn: LogedIn;
    login(): Observable<boolean> {
        this.authenticated = false;
        return this.repo.login(this.name, this.password).map(response => {
            if (response.ok) {
                this.authenticated = true;
                this.logedIn.logedinUser = this.name;
                this.logedIn.logedinPassword = this.password;
                this.password = null;
                this.repo.logedinUser = this.name;
                this.router.navigateByUrl(this.callbackUrl || '/admin/stores');
                this.saveLogedIn(this.logedIn);
            }
            return this.authenticated;
        }).catch(e => {
            this.authenticated = false;
            return Observable.of(false);
        });
    }
    logout() {
    this.authenticated = false;
    this.repo.logout();
    this.clearLogedIn();
    this.repo.logedinUser = null;
    this.repo.selecttedStore = null;
    this.router.navigateByUrl('/login');
    location.reload();
    }
    saveLogedIn(logedIn: LogedIn) {
        this.localStorage.setItem('sharp', logedIn).subscribe(() => {});
    }
    getLogedIn(): Observable<any> {
        return this.localStorage.getItem<LogedIn>('sharp');
    }
    getStore(): Observable<any> {
        return this.localStorage.getItem<Store>('store');
    }
    clearLogedIn() {
        this.localStorage.removeItem('sharp').subscribe(() => {});
        this.localStorage.removeItem('store').subscribe(() => {});
        this.localStorage.removeItem('rootTag').subscribe(() => {});
        this.localStorage.removeItem('childTag').subscribe(() => {});
    }
}
