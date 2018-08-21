import { Injectable } from '@angular/core';
import { Http, RequestMethod, Request, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Filter } from './configClasses.repository';
import { ErrorHandlerService, ValidationError } from '../errorHandler.service';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';

import {Store} from './store.model';
import {UserStore} from './userStore.model';
import {Authorization} from './authorization.model';
import {StoreDto} from './storeDto.model';
import {DepartmentDto} from './departmentDto.model';

const storesUrl = '/api/stores';
const usersUrl = '/api/users';
const authorizationUrl = '/api/authorizations';

@Injectable()
export class Repository {
    private filterObject = new Filter();
    apiBusy?: boolean;
    selecttedStore?: Store;
    stores?: Store[];
    userStores?: UserStore[];
    authorizations?: Authorization[];
    logedinUser?: string;
    private loggedInUserRole?: string;
    storeDto?: StoreDto;
    constructor(private http: Http, private localStorage: LocalStorage, private router: Router) {
        this.apiBusy = false;
        this.authorizations = [];
        this.getAuthorizations();
        this.storeDto = new StoreDto();
    }
    login(name: string, password: string): Observable<Response> {
        return this.http.post('/api/account/login', { name: name, password: password});
    }
    logout() {
        this.http.post('/api/account/logout', null).subscribe(respone => {});
    }
    public sendRequest(verb: RequestMethod, url: string, data?: any): Observable<any> {
        return this.http.request(new Request({
            method: verb, url: url, body: data})).map(response => {
                return response.headers.get('Content-Length') !== '0' ? response.json() : null;
            }).catch((errorResponse: Response) => {
                if (errorResponse.toString().indexOf('Unexpected token') >= 0) {
                    this.localStorage.clear().subscribe(() => {
                        this.router.navigateByUrl('/login');
                        location.reload();
                    });
                    throw new Error('Please Sign In');
                }
                if (errorResponse.status === 400 ) {
                    let jsonData: string;
                    try {
                        jsonData = errorResponse.json();
                    } catch (e) {
                        throw new Error('Network Error');
                        // throw new Error(errorResponse.toString());
                    }
                    const messages = Object.getOwnPropertyNames(jsonData).map(p => jsonData[p]);
                    throw new ValidationError(messages);
                }
                throw new Error('Network Error');
                // throw new Error(errorResponse.toString());
            });
        }
    public getStores() {
        const url = storesUrl + '/' + this.logedinUser;
        this.sendRequest(RequestMethod.Get, url)
        .subscribe(response => {
            this.stores = response;
        });
    }
    public getAuthorizations() {
        this.sendRequest(RequestMethod.Get, authorizationUrl)
        .subscribe(response => {
            this.authorizations = response;
            this.saveAuthorizations(this.authorizations);
        });
    }
    private saveAuthorizations(authorizations: Authorization[]) {
        this.localStorage.setItem('authorization', authorizations).subscribe(() => {});
    }
    /*get todayDate(): string {
        const d = new Date(Date.now());
        const ds = d.getFullYear().toString() + '-' + (d.getMonth() + 1).toString() + '-' + d.getDate().toString();
        return ds;
    }
    get nextDayDate(): string {
        const d = new Date(Date.now());
        d.setDate( d.getDate() + 1 );
        const ds = d.getFullYear().toString() + '-' + (d.getMonth() + 1).toString() + '-' + d.getDate().toString();
        return ds;
    }*/
    public setStoreDto() {
        this.storeDto.id = this.selecttedStore.id;
        this.storeDto.address = this.selecttedStore.address;
        this.storeDto.city = this.selecttedStore.city;
        this.storeDto.dataBase = this.selecttedStore.dataBase;
        this.storeDto.port = this.selecttedStore.port;
        this.storeDto.postCode = this.selecttedStore.postCode;
        this.storeDto.publicIp = this.selecttedStore.publicIp;
        this.storeDto.storeId = this.selecttedStore.storeId;
        this.storeDto.storeName = this.selecttedStore.storeName;
        this.storeDto.serialNumber =  this.selecttedStore.serialNumber;
        this.storeDto.macAddress = this.selecttedStore.macAddress;
        this.storeDto.tick = this.selecttedStore.tick;

        if (this.selecttedStore) {
            const url = usersUrl + '?' + 'storeId=' + this.selecttedStore.storeId;
            this.sendRequest(RequestMethod.Get, url)
            .subscribe(response => {
                this.userStores = response;
                this.loggedInUserRole = this.userStores.filter(x => x.userId === this.logedinUser).map(y => y.userRole)[0];
                this.saveUserRole(this.loggedInUserRole);
                });
            }
    }
    private saveUserRole(role: string) {
        this.localStorage.setItem('role', role).subscribe(() => {});
    }
    get userRole(): string {
        if (this.loggedInUserRole) {
            return this.loggedInUserRole;
        } else {
            return 'Admin';
        }
    }
    set userRole(value: string) {
        this.loggedInUserRole = value;
    }
    public getUsers() {
        if (this.selecttedStore) {
            const url = usersUrl + '?' + 'storeId=' + this.selecttedStore.storeId;
            this.sendRequest(RequestMethod.Get, url)
            .subscribe(response => {
                this.userStores = response;
            });
        }
    }
    get chartBackgroundColor() {
        return [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ];
    }
    get chartBorderColor() {
        return [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ];
    }
    get filter(): Filter {
        return this.filterObject;
    }
}
