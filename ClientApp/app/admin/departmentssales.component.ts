import { Component, OnInit } from '@angular/core';
import { Repository } from '../models/repository';
import { Store } from '../models/store.model';
import { Router } from '@angular/router';
import {DepartmentDto} from '../models/departmentDto.model';
import * as Chart from 'chart.js';
import { Http, RequestMethod, Request, Response } from '@angular/http';
import 'rxjs/add/Operator/map';
const departmentUrl = 'api/departments';
@Component({
    templateUrl: 'departmentsSales.component.html'
    })
    export class DepartmentsSalesComponent implements OnInit {
        private departmentsSales?: DepartmentDto[];
        BarChart: any;
        startDate?: string;
        endDate?: string;
        constructor(private repo: Repository, private router: Router) {
            if (repo.selecttedStore == null) {
                this.router.navigateByUrl('/admin/stores');
            }
            if (this.departmentsSales == null) {
                this.departmentsSales = [] ;
            }
        }
        ngOnInit() {
            if ( this.repo.storeDto.startDate != null) {
                this.startDate = this.repo.storeDto.startDate;
            }
            if ( this.repo.storeDto.endDate != null ) {
                this.endDate = this.repo.storeDto.endDate;
            }
            this.getDepartmentSales();
        }
        getBarChart() {
            this.BarChart = new Chart('barChart', {
                type: 'bar',
                data: {
                    labels: this.departmentsSales.map(x => x.department),
                    datasets: [ {
                        label: 'Sales Amount',
                        data:  this.departmentsSales.map(x => x.amount),
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
                this.repo.apiBusy = true;
                this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response => {
                    this.departmentsSales = response;
                    if (this.BarChart == null) {
                        this.getBarChart();
                    } else {
                        this.removeData(this.BarChart);
                        this.addData(this.BarChart, this.departmentsSales.map(x => x.department),
                        this.departmentsSales.map(x => x.amount));
                    }
                    this.repo.apiBusy = false;
                });
            }
        }
        get departmentSales(): DepartmentDto[] {
            return this.departmentsSales;
        }
    }
