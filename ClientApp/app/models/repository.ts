import { Injectable } from "@angular/core";
import { Http, RequestMethod, Request, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { Filter } from "./configClasses.repository";
import { ErrorHandlerService, ValidationError } from "../errorHandler.service";
import "rxjs/add/operator/catch"

import {Store} from "./store.model";
import {UserStore} from "./userStore.model";
import {Authorization} from "./authorization.model";

const storesUrl="/api/stores";
const usersUrl="/api/users";
const authorizationUrl="/api/authorizations";

@Injectable()
export class Repository {
    
    private filterObject = new Filter();

    constructor(private http: Http){
        this.apiBusy=false;
        this.getAuthorizations();
    }
    login(name: string, password: string) : Observable<Response> {
        return this.http.post("/api/account/login",{ name: name, password: password});
    }
    logout() {
        this.http.post("/api/account/logout", null).subscribe(respone => {});
    }
    public sendRequest(verb: RequestMethod, url: string,data?: any): Observable<any> {
        return this.http.request(new Request({
            method: verb, url: url, body: data})).map(response =>{
                return response.headers.get("Content-Length") != "0"? response.json() : null;
            }).catch((errorResponse: Response) => {
                if (errorResponse.status == 400 ) {
                    let jsonData: string;
                    try {
                        jsonData = errorResponse.json();
                    } catch (e) {
                        //throw new Error("Network Error");
                        throw new Error(errorResponse.toString());
                    }
                    let messages = Object.getOwnPropertyNames(jsonData).map(p => jsonData[p]);
                    throw new ValidationError(messages);
                }
                //throw new Error("Network Error");
                throw new Error(errorResponse.toString());
            });
        }
    public getStores(){
        let url=storesUrl+"/"+this.logedinUser
        this.sendRequest(RequestMethod.Get, url)
        .subscribe(response =>this.stores = response);   
    }
    public getUsers(){
        this.sendRequest(RequestMethod.Get, usersUrl)
        .subscribe(response =>this.userStores = response);   
    }
    
    public getAuthorizations(){
        this.sendRequest(RequestMethod.Get, authorizationUrl)
        .subscribe(response =>this.authorizations = response);   
    }
    

    apiBusy?:boolean;
    get filter(): Filter {
        return this.filterObject;
    }
    selecttedStore?:Store;
    stores?:Store[];
    userStores?:UserStore[];
    authorizations?:Authorization[];
    logedinUser?:string;
}