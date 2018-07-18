import { Component } from "@angular/core";
import { Repository } from "../models/repository";
import { Store } from "../models/store.model";
import { UserStore } from "../models/userStore.model";

@Component({
    templateUrl: "overview.component.html"
    })
    export class OverviewComponent {
        constructor(private repo: Repository) { }
        ngOnInit(){
            this.repo.getStores();
            this.repo.getUsers();
        }
        get stores(): Store[] {
            return this.repo.stores;
        }
        get userStores(): UserStore[] {
            return this.repo.userStores;
        }
    }