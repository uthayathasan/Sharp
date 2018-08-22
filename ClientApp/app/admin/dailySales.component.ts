import { Component, OnInit } from '@angular/core';
import { Repository } from '../models/repository';
import { Router } from '@angular/router';
import {DailySalesDto} from '../models/dailySalesDto.model';
import { LocalStorage } from '@ngx-pwa/local-storage';
import {Period} from '../models/period.model';
import * as Chart from 'chart.js';
import { RequestMethod} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Operator/map';
import { Report } from './report';
const dailySalesUrl = 'api/daily';
@Component({
    templateUrl: 'dailySales.component.html'
    })
export class DailySalesComponent implements OnInit {
    BarChart: any;
    PieChart: any;
    startDate?: string;
    endDate?: string;
    constructor(private repo: Repository, private localStorage: LocalStorage, private report: Report, private router: Router) {
        if (!repo.selecttedStore) {
            this.router.navigateByUrl('/admin/stores');
        } else {
            if (!this.report.dailySalesPeriod.initiated) {
                this.getPeriod().subscribe(response => {
                    if (response) {
                        this.report.dailySalesPeriod = response;
                        this.report.dailySalesPeriod.initiated = false;
                    }
                    if (( this.report.dailySalesPeriod.startDate) && ( this.report.dailySalesPeriod.endDate)) {
                        this.startDate = this.report.dailySalesPeriod.startDate;
                        this.endDate = this.report.dailySalesPeriod.endDate;
                        this.report.dailySalesPeriod.initiated = true;
                        this.getDailySales();
                    }
                });
            }
        }
    }
    ngOnInit() {
        if (( this.report.dailySalesPeriod.startDate) && ( this.report.dailySalesPeriod.endDate)) {
            this.startDate = this.report.dailySalesPeriod.startDate;
            this.endDate = this.report.dailySalesPeriod.endDate;
            if (!this.BarChart) {
                this.getBarChart();
            } else {
                this.removeData(this.BarChart);
                this.addData(this.BarChart, this.chartLabels,
                this.dailySales.map(x => x.amount));
            }
            if (!this.PieChart) {
                this.getPieChart();
            } else {
                this.removeData(this.PieChart);
                this.addData(this.PieChart, this.chartLabels,
                this.dailySales.map(x => x.amount));
            }
        }
    }
    getBarChart() {
        this.BarChart = new Chart('barChart', {
            type: 'bar',
            data: {
                labels: this.chartLabels,
                datasets: [ {
                    label: 'Sales Amount',
                    data:  this.dailySales.map(x => x.amount),
                    backgroundColor: this.repo.chartBackgroundColor,
                    borderColor: this.repo.chartBorderColor,
                    borderWidth: 1
                }]
            },
            options : {
                title: {
                    text: 'Daily Sales',
                    display: true
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            offsetGridLines: true
                        },
                        ticks: {
                          minRotation: 90
                        }
                      }]
                }
            }
        });
    }
    getPieChart() {
        this.PieChart = new Chart('pieChart', {
            type: 'pie',
            data: {
                labels: this.chartLabels,
                datasets: [ {
                    label: 'Sales Amount',
                    data:  this.dailySales.map(x => x.amount),
                    backgroundColor: this.repo.chartBackgroundColor,
                    borderColor: this.repo.chartBorderColor,
                    borderWidth: 1
                }]
            },
            options : {
                title: {
                    text: 'Daily Sales',
                    display: true
                }
            }
        });
    }
    private removeData(chart) {
        chart.data.labels.length = 0;
        chart.data.datasets.forEach((dataset) => {
        dataset.data.length = 0;
        });
        chart.update();
    }
    private addData(chart, labels, datas) {
        labels.forEach(element => {
            chart.data.labels.push(element);
        });
        chart.data.datasets.forEach((dataset) => {
            datas.forEach(element => {
                dataset.data.push(element);
            });
        });
        chart.update();
    }
    getDailySales() {
        const url = dailySalesUrl + '/sales';
        this.repo.storeDto.startDate = this.startDate;
        this.repo.storeDto.endDate = this.endDate;
        if ( this.repo.storeDto.startDate &&  this.repo.storeDto.endDate) {
            this.report.dailySalesPeriod.startDate = this.startDate;
            this.report.dailySalesPeriod.endDate = this.endDate;
            this.repo.apiBusy = true;
            this.savePeriod(this.report.dailySalesPeriod);
            this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response => {
                this.report.dailySales = response;
                if (!this.BarChart) {
                    this.getBarChart();
                } else {
                    this.removeData(this.BarChart);
                    this.addData(this.BarChart, this.chartLabels,
                    this.dailySales.map(x => x.amount));
                }
                if (!this.PieChart) {
                    this.getPieChart();
                } else {
                    this.removeData(this.PieChart);
                    this.addData(this.PieChart, this.chartLabels,
                    this.dailySales.map(x => x.amount));
                }
                this.repo.apiBusy = false;
            });
        }
    }
    getTotal(): number {
        if ((this.dailySales) && (this.dailySales.length > 0)) {
            return this.dailySales.map(x => x.amount).reduce((s, u) => s + u + 0);
        } else {
            return 0;
        }
    }
    get dailySales(): DailySalesDto[] {
        return this.report.dailySales;
    }
    get chartLabels() {
        const label = [];
        this.dailySales.forEach(element => {
            label.push(element.dayDate + ' : ' + element.dayName);
        });
        return label;
    }
    setPeriod(tag?: string) {
        if (tag !== this.report.dailySalesPeriod.periodName) {
            this.report.dailySalesPeriod.periodName = tag;
            if (tag !== '') {
                this.startDate = this.report.getStartDateByTag(tag);
                this.endDate = this.report.getEndDateByTag(tag);
            }
            this.report.dailySalesPeriod.startDate = this.startDate;
            this.report.dailySalesPeriod.endDate = this.endDate;
            if (tag !== '') {
                this.getDailySales();
            }
        }
    }
    get period(): string {
        return this.report.dailySalesPeriod.periodName;
    }
    setChart(tag?: string) {
        this.report.dailySalesPeriod.chart = tag;
        this.savePeriod(this.report.dailySalesPeriod);
    }
    get chart(): string {
        return this.report.dailySalesPeriod.chart;
    }
    savePeriod(period: Period) {
        this.localStorage.setItem('dailySales', period).subscribe(() => {});
    }
    getPeriod(): Observable<Period> {
        return this.localStorage.getItem<Period>('dailySales');
    }
    isBarchart() {
        if (this.report.dailySalesPeriod.chart === 'Bar Chart') {
            return true;
        } else {
            return false;
        }
    }
    isPieChart() {
        if (this.report.dailySalesPeriod.chart === 'Pie Chart') {
            return true;
        } else {
            return false;
        }
    }
}
