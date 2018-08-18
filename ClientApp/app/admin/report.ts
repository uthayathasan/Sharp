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
        this.departmentSalesPeriod.periodName = 'Today';
        this.departmentSalesPeriod.chart = 'Bar Chart';
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

    getStartDateByTag(tag?: string): string {
        if (tag === 'Today') {
            const d = new Date(Date.now());
            return this.getStartDateTime(d);
        } else
        if (tag === 'Yesterday') {
            const d = new Date(Date.now());
            d.setDate(d.getDate() - 1);
            return this.getStartDateTime(d);
        } else
        if (tag === 'This Week') {
            const curr_date = new Date();
            const day = curr_date.getDay();
            const diff = curr_date.getDate() - day; // 0 for sunday
            const week_start_tstmp = curr_date.setDate(diff);
            const week_start = new Date(week_start_tstmp);
            return this.getStartDateTime(week_start);
        } else
        if (tag === 'Last Week') {
            const curr_date = new Date();
            const day = curr_date.getDay();
            const diff = curr_date.getDate() - day - 7; // 0 for sunday
            const last_week_start_tstmp = curr_date.setDate(diff);
            const last_week_start = new Date(last_week_start_tstmp);
            return  this.getStartDateTime(last_week_start);
        } else
        if (tag === 'This Month') {
            const curr_date = new Date();
            const month_start = new Date (curr_date.getFullYear(), curr_date.getMonth(), 1);
            return this.getStartDateTime(month_start);
        } else
        if (tag === 'Last Month') {
            return '';
        } else
        if (tag === 'This Quarter') {
            return '';
        } else
        if (tag === 'Last Quarter') {
            return '';
        }
    }
    getEndDateByTag(tag?: string): string {
        if (tag === 'Today') {
            const d = new Date(Date.now());
            return this.getEndDateTime(d);
        } else
        if (tag === 'Yesterday') {
            const d = new Date(Date.now());
            d.setDate(d.getDate() - 1);
            return this.getEndDateTime(d);
        } else
        if (tag === 'This Week') {
            const curr_date = new Date();
            const day = curr_date.getDay();
            const diff = curr_date.getDate() - day; // 0 for sunday
            const week_start_tstmp = curr_date.setDate(diff);
            let week_end  = new Date(week_start_tstmp);
            week_end = new Date (week_end.setDate(week_end.getDate() + 6));
            return this.getEndDateTime(week_end);
        } else
        if (tag === 'Last Week') {
            const curr_date = new Date();
            const day = curr_date.getDay();
            const diff = curr_date.getDate() - day - 1; // 0 for sunday
            const last_week_end_tstmp = curr_date.setDate(diff);
            const last_week_end = new Date(last_week_end_tstmp);
            return  this.getEndDateTime(last_week_end);
        } else
        if (tag === 'This Month') {
            const curr_date = new Date();
            const month_end = new Date (curr_date.getFullYear(), (curr_date.getMonth() + 1), 0);
            return this.getEndDateTime(month_end);
        } else
        if (tag === 'Last Month') {
            return '';
        } else
        if (tag === 'This Quarter') {
            return '';
        } else
        if (tag === 'Last Quarter') {
            return '';
        }
    }
}
