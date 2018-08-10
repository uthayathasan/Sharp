import { Injectable } from '@angular/core';
import { Repository } from '../models/repository';
import {Store} from '../models/store.model';
import {Authorization} from '../models/authorization.model';
import { Router } from '@angular/router';
@Injectable()
export class TreeEvents {
    constructor(private repo: Repository, private router: Router) {}
    public event(tag?: string) {
        if (tag === 'Department Sales') {
            this.repo.getDepartmentSales();
        }
    }
}
