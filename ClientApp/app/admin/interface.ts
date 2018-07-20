import { Injectable } from "@angular/core";
import { Repository } from "../models/repository";
import{Store} from "../models/store.model";
import{Authorization} from "../models/authorization.model";
@Injectable()
export class Interface{
    constructor(private repo: Repository){
        this.toggle=-1;
        this.selectedNode="Stores";
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
            const lineDiff = b.lineNo - a.lineNo;
            if (lineDiff) return lineDiff;});
    }
    get authorizationChild():Authorization[]{
        return this.repo.authorizations.filter(x=>x.rootTag==this.selectedNode).filter(x=>x.type=="Child").sort((a, b) => {
            const lineDiff = b.lineNo - a.lineNo;
            if (lineDiff) return lineDiff;});
    }
    selectNode(tag:string){
        this.selectedNode=tag;
    }
    selectedNode?:string;
}