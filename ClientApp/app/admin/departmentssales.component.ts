import { Component, OnInit } from '@angular/core';
import { Repository } from '../models/repository';
import { Router } from '@angular/router';
import {DepartmentDto} from '../models/departmentDto.model';
import * as Chart from 'chart.js';
import { RequestMethod} from '@angular/http';
import {Period} from '../models/period.model';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Operator/map';
import * as jsPDF from 'jspdf';
import { Report } from './report';
const departmentUrl = 'api/departments';
@Component({
    templateUrl: 'departmentsSales.component.html'
    })
    export class DepartmentsSalesComponent implements OnInit {
        BarChart: any;
        PieChart: any;
        startDate?: string;
        endDate?: string;
        constructor(private repo: Repository, private localStorage: LocalStorage, private report: Report, private router: Router) {
            if (!repo.selecttedStore) {
                this.router.navigateByUrl('/admin/stores');
            } else {
                if (!this.report.departmentSalesPeriod.initiated) {
                    this.getPeriod().subscribe(response => {
                        if (response) {
                            this.report.departmentSalesPeriod = response;
                            this.report.departmentSalesPeriod.initiated = false;
                        }
                        if (( this.report.departmentSalesPeriod.startDate) && ( this.report.departmentSalesPeriod.endDate)) {
                                this.startDate = this.report.departmentSalesPeriod.startDate;
                                this.endDate = this.report.departmentSalesPeriod.endDate;
                                this.report.departmentSalesPeriod.initiated = true;
                                this.getDepartmentSales();
                        }
                    });
                }
            }
        }
        ngOnInit() {
            if (( this.report.departmentSalesPeriod.startDate) && ( this.report.departmentSalesPeriod.endDate)) {
                this.startDate = this.report.departmentSalesPeriod.startDate;
                this.endDate = this.report.departmentSalesPeriod.endDate;
                if (!this.BarChart) {
                    this.getBarChart();
                } else {
                    this.removeData(this.BarChart);
                    this.addData(this.BarChart, this.departmentSales.map(x => x.department),
                    this.departmentSales.map(x => x.amount));
                }
                if (!this.PieChart) {
                    this.getPieChart();
                } else {
                    this.removeData(this.PieChart);
                    this.addData(this.PieChart, this.departmentSales.map(x => x.department),
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
        getPieChart() {
            this.PieChart = new Chart('pieChart', {
                type: 'pie',
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

            if ( this.repo.storeDto.startDate &&  this.repo.storeDto.endDate) {
                this.report.departmentSalesPeriod.startDate = this.startDate;
                this.report.departmentSalesPeriod.endDate = this.endDate;
                this.repo.apiBusy = true;
                this.savePeriod(this.report.departmentSalesPeriod);
                this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response => {
                    this.report.departmentsSales = response;
                    if (!this.BarChart) {
                        this.getBarChart();
                    } else {
                        this.removeData(this.BarChart);
                        this.addData(this.BarChart, this.departmentSales.map(x => x.department),
                        this.departmentSales.map(x => x.amount));
                    }
                    if (!this.PieChart) {
                        this.getPieChart();
                    } else {
                        this.removeData(this.PieChart);
                        this.addData(this.PieChart, this.departmentSales.map(x => x.department),
                        this.departmentSales.map(x => x.amount));
                    }
                    this.repo.apiBusy = false;
                });
            }
        }
        getTotal(): number {
            if ((this.departmentSales) && (this.departmentSales.length > 0)) {
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
                if (tag !== '') {
                    this.startDate = this.report.getStartDateByTag(tag);
                    this.endDate = this.report.getEndDateByTag(tag);
                }
                this.report.departmentSalesPeriod.startDate = this.startDate;
                this.report.departmentSalesPeriod.endDate = this.endDate;
                if (tag !== '') {
                    this.getDepartmentSales();
                }
            }
        }
        get period(): string {
            return this.report.departmentSalesPeriod.periodName;
        }
        setChart(tag?: string) {
            this.report.departmentSalesPeriod.chart = tag;
            this.savePeriod(this.report.departmentSalesPeriod);
        }
        get chart(): string {
            return this.report.departmentSalesPeriod.chart;
        }
        savePeriod(period: Period) {
            this.localStorage.setItem('departmentSales', period).subscribe(() => {});
        }
        getPeriod(): Observable<Period> {
            return this.localStorage.getItem<Period>('departmentSales');
        }
        isBarchart() {
            if (this.report.departmentSalesPeriod.chart === 'Bar Chart') {
                return true;
            } else {
                return false;
            }
        }
        isPieChart() {
            if (this.report.departmentSalesPeriod.chart === 'Pie Chart') {
                return true;
            } else {
                return false;
            }
        }
        exportToPdf() {
            const data = this.departmentSales;
            const doc = new jsPDF('p', 'pt', 'a4');
            doc.setFont('Open Sans', 'san-serif');
            doc.setFontSize(14);
            doc.setFontType('bold');
            doc.cellInitialize();
            doc.cell(10, 10, 40, 25, 'Id', 0, 'right');
            doc.cell(50, 10, 200, 25, 'Department', 0, 'left');
            doc.cell(250, 10, 100, 25, 'Amount', 0, 'right');
            doc.setFontSize(12);
            doc.setFontType('normal');
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                // doc.cell(leftMargin, topMargin, cellWidth, rowHeight, cellContent, index);
                doc.cell(10, 10, 40, 25, element.id.toString(), (index + 1), 'right');
                doc.cell(50, 10, 200, 25, element.department, (index + 1), 'left');
                doc.cell(250, 10, 100, 25, element.amount.toFixed(2), (index + 1), 'right');
            }
            doc.save('DepartmentSales.pdf');
            // doc.autoPrint();
            // window.open(doc.output('bloburl'), '_blank');
        }
    }
