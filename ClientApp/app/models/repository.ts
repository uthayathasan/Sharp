import { Injectable } from '@angular/core';
import { Http, RequestMethod, Request, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Filter } from './configClasses.repository';
import { ErrorHandlerService, ValidationError } from '../errorHandler.service';
import 'rxjs/add/operator/catch';

import {Store} from './store.model';
import {UserStore} from './userStore.model';
import {Authorization} from './authorization.model';
import {StoreDto} from './storeDto.model';
import {DepartmentDto} from './departmentDto.model';

const storesUrl = '/api/stores';
const usersUrl = '/api/users';
const authorizationUrl = '/api/authorizations';
const departmentUrl = 'api/departments';

@Injectable()
export class Repository {
    private filterObject = new Filter();

    constructor(private http: Http) {
        this.apiBusy = false;
        this.getAuthorizations();
        this.storeDto = new StoreDto();
    }
    apiBusy?: boolean;
    selecttedStore?: Store;
    stores?: Store[];
    userStores?: UserStore[];
    authorizations?: Authorization[];
    logedinUser?: string;
    storeDto?: StoreDto;
    departmentsSales?: DepartmentDto[];

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
                if (errorResponse.status === 400 ) {
                    let jsonData: string;
                    try {
                        jsonData = errorResponse.json();
                    } catch (e) {
                        // throw new Error("Network Error");
                        throw new Error(errorResponse.toString());
                    }
                    const messages = Object.getOwnPropertyNames(jsonData).map(p => jsonData[p]);
                    throw new ValidationError(messages);
                }
                // throw new Error("Network Error");
                throw new Error(errorResponse.toString());
            });
        }
    public getStores() {
        const url = storesUrl + '/' + this.logedinUser;
        this.sendRequest(RequestMethod.Get, url)
        .subscribe(response => {
            this.stores = response;
        });
    }
    public getUsers() {
        if (this.selecttedStore != null) {
            const url = usersUrl + '?' + 'storeId=' + this.selecttedStore.storeId;
            this.sendRequest(RequestMethod.Get, url)
            .subscribe(response => {
                this.userStores = response;
            });
        }
    }

    public getAuthorizations() {
        this.sendRequest(RequestMethod.Get, authorizationUrl)
        .subscribe(response => {
            this.authorizations = response;
        });
    }

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
    }
    public getDepartmentSales() {
        const url = departmentUrl + '/sales';
        this.storeDto.startDate = '2018-07-01';
        this.storeDto.endDate = '2018-08-10';
        this.apiBusy = true;
        this.sendRequest(RequestMethod.Post, url, this.storeDto).subscribe(response => {
            this.departmentsSales = response;
            console.log(this.departmentsSales);
            this.apiBusy = false;
        });
    }

    get filter(): Filter {
        return this.filterObject;
    }
}
