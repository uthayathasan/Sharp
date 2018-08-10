import { Component, OnInit } from '@angular/core';
import { Repository } from '../models/repository';
import { Store } from '../models/store.model';
import { Router } from '@angular/router';
import {DepartmentDto} from '../models/departmentDto.model';
@Component({
    templateUrl: 'departmentssales.component.html'
    })
    export class DepartmentsSalesComponent {
        constructor(private repo: Repository, private router: Router) {}

        get departmentSales(): DepartmentDto[] {
            return this.repo.departmentsSales;
        }
    }
