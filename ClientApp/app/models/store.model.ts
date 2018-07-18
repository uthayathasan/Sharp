export class Store{
    constructor(
        public id?:number,
        public storeId?:string,
        public storeName?:string,
        public address?:string,
        public city?:string,
        public postCode?:string,
        public publicIp?:string,
        public port?:number,
        public dataBase?:number
    ){}
}