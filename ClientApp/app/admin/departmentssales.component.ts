import { Component, OnInit } from '@angular/core';
import { Repository } from '../models/repository';
import { Store } from '../models/store.model';
import { Router } from '@angular/router';
import {DepartmentDto} from '../models/departmentDto.model';
@Component({
    templateUrl: 'departmentsSales.component.html'
    })
    export class DepartmentsSalesComponent {
        constructor(private repo: Repository, private router: Router) {
            this.startDate=this.repo.todayDate;
            this.endDate=this.repo.nextDayDate;
            if (repo.selecttedStore == null) {
                this.router.navigateByUrl('/admin/stores');
            }
        }
        startDate?: string;
        endDate?: string;
        get departmentSales(): DepartmentDto[] {
            return this.repo.departmentsSales;
        }

        getDepartmentSales(){
            this.repo.storeDto.startDate=this.startDate;
            this.repo.storeDto.endDate=this.endDate;
            this.repo.getDepartmentSales();
        }
    }
