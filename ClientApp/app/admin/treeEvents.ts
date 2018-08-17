import { Injectable } from '@angular/core';
import { Repository } from '../models/repository';
import { Router } from '@angular/router';
@Injectable()
export class TreeEvents {
    constructor(private repo: Repository, private router: Router) {}
    public event(tag?: string) {
        if (tag === 'Department Sales') {
            // this.repo.getDepartmentSales();
            this.router.navigateByUrl('/admin/departmentsSales');
        } else
        if (tag === 'Item Sales') {
            this.router.navigateByUrl('/admin/itemsSales');
        } else
        if (tag === 'Daily Sales') {
            this.router.navigateByUrl('/admin/dailySales');
        }
    }
}
