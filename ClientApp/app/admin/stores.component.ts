import { Component, OnInit } from '@angular/core';
import { Repository } from '../models/repository';
import { Store } from '../models/store.model';
import { Router } from '@angular/router';
@Component({
    templateUrl: 'stores.component.html'
    })
    export class StoresComponent implements OnInit {
        constructor(private repo: Repository, private router: Router) {}
        ngOnInit() {
            this.repo.getStores();
        }
        get stores(): Store[] {
            return this.repo.stores;
        }
        setStore(store: Store) {
            this.repo.selecttedStore = store;
            this.repo.setStoreDto();
            this.router.navigateByUrl('/admin/nodes');
        }
    }
