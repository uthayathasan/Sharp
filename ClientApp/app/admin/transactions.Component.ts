import { Component, OnInit } from '@angular/core';
import { Repository } from '../models/repository';
import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import {Period} from '../models/period.model';
import * as Chart from 'chart.js';
import { RequestMethod} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Operator/map';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Report } from './report';
const transactionUrl = 'api/transactions';
@Component({
    templateUrl: 'transactions.component.html'
    })
    export class TransactionsComponent implements OnInit {
        constructor(private repo: Repository) {}
        ngOnInit() {
            this.getTransactions();
        }
        getTransactions() {
            const url = transactionUrl + '/sales';
            this.repo.storeDto.startDate = '2018-07-01T00:00';
            this.repo.storeDto.endDate = '2018-09-01T00:00';
            this.repo.storeDto.linesPerPage = 20;
            this.repo.storeDto.pageNumber = 1;
            this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response => {
                console.log(response);
            });
        }
    }
