import { Component, OnInit } from '@angular/core';
import { Repository } from '../models/repository';
import { Store } from '../models/store.model';
import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Interface } from './interface';
import { Report } from './report';
@Component({
    templateUrl: 'stores.component.html'
    })
    export class StoresComponent implements OnInit {
        constructor(private repo: Repository, private report: Report, private inter: Interface,
             private router: Router, private localStorage: LocalStorage) {}
        ngOnInit() {
            this.inter.setNode('Stores');
            this.repo.getStores();
        }
        get stores(): Store[] {
            return this.repo.stores;
        }
        setStore(store: Store) {
            if (this.repo.selecttedStore !== store) {
                this.report.reset();
            }
            this.repo.selecttedStore = store;
            this.repo.setStoreDto();
            this.saveStore(store);
            this.router.navigateByUrl('/admin/nodes');
        }
        saveStore(store: Store) {
            this.localStorage.setItem('store', store).subscribe(() => {});
        }
    }
