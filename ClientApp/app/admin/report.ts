import { Injectable } from '@angular/core';
import {DepartmentDto} from '../models/departmentDto.model';
import {ItemDto} from '../models/itemDto.model';
import {Period} from '../models/period.model';
import { DailySalesDto } from '../models/dailySalesDto.model';
@Injectable()
export class Report {
    departmentSalesPeriod?: Period;
    departmentsSales?: DepartmentDto[];

    itemSalesPeriod?: Period;
    itemsSales?: ItemDto[];

    dailySalesPeriod?: Period;
    dailySales?: DailySalesDto[];

    constructor() {
        const d = new Date(Date.now());
        const ds = this.getStartDateTime(d);
        const de = this.getEndDateTime(d);

        this.departmentSalesPeriod = new Period();
        this.departmentSalesPeriod.startDate = ds;
        this.departmentSalesPeriod.endDate = de;
        this.departmentsSales = [];

        this.itemSalesPeriod = new Period();
        this.itemSalesPeriod.startDate = ds;
        this.itemSalesPeriod.endDate = de;
        this.itemsSales = [];

        const dd = new Date(Date.now());
        dd.setDate(dd.getDate() - 7);
        const dds = this.getStartDateTime(dd);

        dd.setDate(dd.getDate() + 6);
        const dde = this.getEndDateTime(dd);

        this.dailySalesPeriod = new Period();
        this.dailySalesPeriod.startDate = dds;
        this.dailySalesPeriod.endDate = dde;
        this.dailySales = [];
    }

    private getStartDateTime(d?: Date): string {
        let month = (d.getMonth() + 1).toString();
        if ((d.getMonth() + 1) < 10 ) {
            month = '0' +  month;
        }
        let day = d.getDate().toString();
        if (d.getDate() < 10) {
            day = '0' + day;
        }
        return  d.getFullYear().toString() + '-' + month + '-' + day + 'T00:00';
    }
    private getEndDateTime(d?: Date): string {
        let month = (d.getMonth() + 1).toString();
        if ((d.getMonth() + 1) < 10 ) {
            month = '0' +  month;
        }
        let day = d.getDate().toString();
        if (d.getDate() < 10) {
            day = '0' + day;
        }
        return  d.getFullYear().toString() + '-' + month + '-' + day + 'T23:59';
    }
}
