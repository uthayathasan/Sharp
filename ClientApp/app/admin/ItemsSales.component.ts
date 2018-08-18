import { Component, OnInit } from '@angular/core';
import { Repository } from '../models/repository';
import { Router } from '@angular/router';
import {ItemDto} from '../models/itemDto.model';
import {DepartmentDto} from '../models/departmentDto.model';
import * as Chart from 'chart.js';
import { RequestMethod} from '@angular/http';
import 'rxjs/add/Operator/map';
import { Report } from './report';
const itemUrl = 'api/items';
@Component({
    templateUrl: 'itemsSales.component.html'
    })
    export class ItemsSalesComponent implements OnInit {
        private departmentsSales?: DepartmentDto[];
        BarChart: any;
        startDate?: string;
        endDate?: string;
        constructor(private repo: Repository, private report: Report, private router: Router) {
            if (!repo.selecttedStore) {
                this.router.navigateByUrl('/admin/stores');
            } else {
                if (!this.report.itemSalesPeriod.initiated) {
                    if (( this.report.itemSalesPeriod.startDate) && ( this.report.itemSalesPeriod.endDate)) {
                        this.startDate = this.report.itemSalesPeriod.startDate;
                        this.endDate = this.report.itemSalesPeriod.endDate;
                        this.report.itemSalesPeriod.initiated = true;
                        this.getItemSales();
                    }
                }
            }
        }
        ngOnInit() {
            if (( this.report.itemSalesPeriod.startDate) && ( this.report.itemSalesPeriod.endDate)) {
                this.startDate = this.report.itemSalesPeriod.startDate;
                this.endDate = this.report.itemSalesPeriod.endDate;
                if (!this.BarChart) {
                    this.getBarChart();
                } else {
                    this.removeData(this.BarChart);
                    this.addData(this.BarChart, this.gettop20().map(x => x.description),
                    this.gettop20().map(x => x.amount));
                }
            }
        }
        getBarChart() {
            this.BarChart = new Chart('barChart', {
                type: 'bar',
                data: {
                    labels: this.gettop20().map(x => x.description),
                    datasets: [ {
                        label: 'Sales Amount',
                        data:  this.gettop20().map(x => x.amount),
                        backgroundColor: this.repo.chartBackgroundColor,
                        borderColor: this.repo.chartBorderColor,
                        borderWidth: 1
                    }]
                },
                options : {
                    title: {
                        text: 'Top 20 Product\'s Sales',
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
        gettop20(): ItemDto[] {
            if (this.report.itemsSales.length < 2) {
                return this.report.itemsSales;
            } else
            if (this.report.itemsSales.length <= 20) {
                return this.report.itemsSales.sort((a , b) => {
                    const amtDiff =  b.amount - a.amount;
                    if ( amtDiff ) {return amtDiff; }
                });
            } else {
                return this.report.itemsSales.sort((a , b) => {
                    const amtDiff =  b.amount - a.amount;
                    if ( amtDiff ) {return amtDiff; }
                }).slice(0, 20);
            }
        }
        getItemSales() {
            const url = itemUrl + '/sales';
            this.repo.storeDto.startDate = this.startDate;
            this.repo.storeDto.endDate = this.endDate;
            if ( this.repo.storeDto.startDate &&  this.repo.storeDto.endDate) {
                this.report.itemSalesPeriod.startDate = this.startDate;
                this.report.itemSalesPeriod.endDate = this.endDate;
                this.repo.apiBusy = true;
                this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response => {
                    this.report.itemsSales = response;
                    if (!this.BarChart) {
                        this.getBarChart();
                    } else {
                        this.removeData(this.BarChart);
                        this.addData(this.BarChart, this.gettop20().map(x => x.description),
                        this.gettop20().map(x => x.amount));
                    }
                    this.repo.apiBusy = false;
                    // this.getDepartmentsSales();
                });
            }
        }
        getTotal(): number {
            if ((this.report.itemsSales) && (this.report.itemsSales.length > 0)) {
                return this.report.itemsSales.map(x => x.amount).reduce((s, u) => s + u + 0);
            } else {
                return 0;
            }

        }
        getDepartmentsSales() {
            const sales = this.report.itemsSales.sort((a , b) => {
                const amtDiff =  a.departmentName.localeCompare(b.departmentName);
                if ( amtDiff ) {return amtDiff; }
            });
            if (!this.departmentsSales) {
                this.departmentsSales = [];
            }
            this.departmentsSales.length = 0;
            let dept = '';
            let amount = 0;
            let yes = 0;
            sales.forEach(element => {
                if (!element.departmentName.localeCompare(dept)) {
                       amount = amount + element.amount;
                       yes = 1;
                } else {
                    if (yes === 1 ) {
                        this.departmentsSales.push({ id : 0, department : dept, amount : amount});
                    }
                    dept = element.departmentName;
                    amount = 0;
                    yes = 0;
                    amount = amount + element.amount;
                }
            });
            this.departmentsSales.push({ id : 0, department : dept, amount : amount});
        }
        /*getItemSalesByDepartment(department?: string){
            return this.itemsSales.filter()
        }*/
        get departmentSales(): DepartmentDto[] {
            return this.departmentsSales;
        }
        get itemSales(): ItemDto[] {
            return this.report.itemsSales.sort((a , b) => {
                const amtDiff =  b.amount - a.amount;
                if ( amtDiff ) {return amtDiff; }
            });
        }
    }
