import { Component } from "@angular/core";
import { Repository } from "../models/repository";
import { Store } from "../models/store.model";

@Component({
    templateUrl: "stores.component.html"
    })
    export class StoresComponent {
        constructor(private repo: Repository) {}
        
        ngOnInit(){
            this.repo.getStores();
            this.repo.getUsers();
        }
       
        get stores(): Store[] {
            return this.repo.stores;
        }
        
        setStore(store:Store){
            this.repo.selecttedStore=store;
        }
    }