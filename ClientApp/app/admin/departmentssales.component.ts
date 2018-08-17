import { Component, OnInit } from '@angular/core';
import { Repository } from '../models/repository';
import { Router } from '@angular/router';
import {DepartmentDto} from '../models/departmentDto.model';
import * as Chart from 'chart.js';
import { RequestMethod} from '@angular/http';
import 'rxjs/add/Operator/map';
import { Report } from './report';
const departmentUrl = 'api/departments';
@Component({
    templateUrl: 'departmentsSales.component.html'
    })
    export class DepartmentsSalesComponent implements OnInit {
        BarChart: any;
        startDate?: string;
        endDate?: string;
        constructor(private repo: Repository, private report: Report, private router: Router) {
            if (repo.selecttedStore == null) {
                this.router.navigateByUrl('/admin/stores');
            } else {
                if (!this.report.departmentSalesPeriod.initiated) {
                    if (( this.report.departmentSalesPeriod.startDate != null) && ( this.report.departmentSalesPeriod.endDate != null )) {
                        this.startDate = this.report.departmentSalesPeriod.startDate;
                        this.endDate = this.report.departmentSalesPeriod.endDate;
                        this.report.departmentSalesPeriod.initiated = true;
                        this.getDepartmentSales();
                    }
                }
            }
        }
        ngOnInit() {
            if (( this.report.departmentSalesPeriod.startDate != null) && ( this.report.departmentSalesPeriod.endDate != null )) {
                this.startDate = this.report.departmentSalesPeriod.startDate;
                this.endDate = this.report.departmentSalesPeriod.endDate;
                if (this.BarChart == null) {
                    this.getBarChart();
                } else {
                    this.removeData(this.BarChart);
                    this.addData(this.BarChart, this.departmentSales.map(x => x.department),
                    this.departmentSales.map(x => x.amount));
                }
            }
        }
        getBarChart() {
            this.BarChart = new Chart('barChart', {
                type: 'bar',
                data: {
                    labels: this.departmentSales.map(x => x.department),
                    datasets: [ {
                        label: 'Sales Amount',
                        data:  this.departmentSales.map(x => x.amount),
                        backgroundColor: this.repo.chartBackgroundColor,
                        borderColor: this.repo.chartBorderColor,
                        borderWidth: 1
                    }]
                },
                options : {
                    title: {
                        text: 'Department Sales',
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
        getDepartmentSales() {
            const url = departmentUrl + '/sales';
            this.repo.storeDto.startDate = this.startDate;
            this.repo.storeDto.endDate = this.endDate;

            if ( this.repo.storeDto.startDate != null &&  this.repo.storeDto.endDate != null) {
                this.report.departmentSalesPeriod.startDate = this.startDate;
                this.report.departmentSalesPeriod.endDate = this.endDate;
                this.repo.apiBusy = true;
                this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response => {
                    this.report.departmentsSales = response;
                    if (this.BarChart == null) {
                        this.getBarChart();
                    } else {
                        this.removeData(this.BarChart);
                        this.addData(this.BarChart, this.departmentSales.map(x => x.department),
                        this.departmentSales.map(x => x.amount));
                    }
                    this.repo.apiBusy = false;
                });
            }
        }
        getTotal(): number {
            if ((this.departmentSales != null) && (this.departmentSales.length > 0)) {
                return this.departmentSales.map(x => x.amount).reduce((s, u) => s + u + 0);
            } else {
                return 0;
            }

        }
        get departmentSales(): DepartmentDto[] {
            return this.report.departmentsSales.sort((a , b) => {
                const amtDiff =  b.amount - a.amount;
                if ( amtDiff ) {return amtDiff; }
            });
        }
        setPeriod(tag?: string) {
            if (tag !== this.report.departmentSalesPeriod.periodName) {
                this.report.departmentSalesPeriod.periodName = tag;
                this.startDate = this.report.getStartDateByTag(tag);
                this.endDate = this.report.getEndDateByTag(tag);
                this.report.departmentSalesPeriod.startDate = this.startDate;
                this.report.departmentSalesPeriod.endDate = this.endDate;
                this.getDepartmentSales();
            }
        }
        get period(): string {
            return this.report.departmentSalesPeriod.periodName;
        }
        setChart(tag?: string) {
            this.report.departmentSalesPeriod.chart = tag;
        }
        get chart(): string {
            return this.report.departmentSalesPeriod.chart;
        }
    }
