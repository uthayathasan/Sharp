import { Component } from "@angular/core";
import { Repository } from "../models/repository";
import{Store} from '../models/store.model';
import { RequestMethod } from '@angular/http';
const storesUrl="/api/stores";
@Component({
templateUrl: "admin.component.html"
})
export class AdminComponent {
constructor(private repo: Repository) {}
ngOnInit(){
    this.getstores();
  }

  getstores(){
    this.repo.sendRequest(RequestMethod.Get,storesUrl).subscribe(response =>this.stores=response);
  }
  stores:Store[];
}