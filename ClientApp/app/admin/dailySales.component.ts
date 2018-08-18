import { Component, OnInit } from '@angular/core';
import { Repository } from '../models/repository';
import { Router } from '@angular/router';
import {DailySalesDto} from '../models/dailySalesDto.model';
import * as Chart from 'chart.js';
import { RequestMethod} from '@angular/http';
import 'rxjs/add/Operator/map';
import { Report } from './report';
const dailySalesUrl = 'api/daily';
@Component({
    templateUrl: 'dailySales.component.html'
    })
export class DailySalesComponent implements OnInit {
    BarChart: any;
    startDate?: string;
    endDate?: string;
    constructor(private repo: Repository, private report: Report, private router: Router) {
        if (!repo.selecttedStore) {
            this.router.navigateByUrl('/admin/stores');
        } else {
            if (!this.report.dailySalesPeriod.initiated) {
                if (( this.report.dailySalesPeriod.startDate) && ( this.report.dailySalesPeriod.endDate)) {
                    this.startDate = this.report.dailySalesPeriod.startDate;
                    this.endDate = this.report.dailySalesPeriod.endDate;
                    this.report.dailySalesPeriod.initiated = true;
                    this.getDailySales();
                }
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
            this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response => {
                this.report.dailySales = response;
                if (!this.BarChart) {
                    this.getBarChart();
                } else {
                    this.removeData(this.BarChart);
                    this.addData(this.BarChart, this.chartLabels,
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
}
