import { Injectable } from "@angular/core";
import { Repository } from "../models/repository";
import{Store} from "../models/store.model";
import{Authorization} from "../models/authorization.model";
import { Router } from "@angular/router";
@Injectable()
export class Interface{
    constructor(private repo: Repository,private router: Router){
        this.toggle=-1;
        this.selectedNode="Stores";
        this.selectedChild="";
    }
    toggle?:number;
    clickToggle(){
        this.toggle=-1*this.toggle;
    }
    getToggle():number{
        return this.toggle;
    }
    getStore():Store{
        return this.repo.selecttedStore;
    }

    get authorizationRoot():Authorization[]{
        return this.repo.authorizations.filter(x=>x.type=="Root").sort((a, b) => {
            const lineDiff =  a.lineNo-b.lineNo;
            if (lineDiff) return lineDiff;});
    }
    get authorizationChild(){
        return this.repo.authorizations.filter(x=>x.rootTag==this.selectedNode).filter(x=>x.type=="Child").sort((a, b) => {
            const lineDiff =  a.lineNo-b.lineNo;
            if (lineDiff) return lineDiff;});
    }
    getAuthorizationChild(tag:string):Authorization[]{
        if(tag==this.selectedNode){
        return this.repo.authorizations.filter(x=>x.rootTag==tag).filter(x=>x.type=="Child").sort((a, b) => {
            const lineDiff =  a.lineNo-b.lineNo;
            if (lineDiff) return lineDiff;});
        }
    }
    getSelectedNodeIcon(tag:string):string{
        return tag == this.selectedNode ? "fa fa-caret-down" : "fa fa-caret-right";
    }
    setNode(tag:string){
        this.selectedNode=tag;
        if(tag=='Stores') this.router.navigateByUrl("/admin/stores");
        else this.router.navigateByUrl("/admin/childs");
    }
    setChild(tag:string){
        this.selectedChild=tag;
    }
    selectedNode?:string;
    selectedChild?:string;
}