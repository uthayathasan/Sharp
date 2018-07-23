import { Component } from "@angular/core";
import { Repository } from "../models/repository";
import { Store } from "../models/store.model";
import { Router } from "@angular/router";
@Component({
    templateUrl: "stores.component.html"
    })
    export class StoresComponent {
        constructor(private repo: Repository,private router: Router) {}
        
        ngOnInit(){
            this.repo.getStores();
            this.repo.getUsers();
        }
       
        get stores(): Store[] {
            return this.repo.stores;
        }
        
        setStore(store:Store){
            this.repo.selecttedStore=store;
            this.router.navigateByUrl("/admin/nodes");
        }
    }