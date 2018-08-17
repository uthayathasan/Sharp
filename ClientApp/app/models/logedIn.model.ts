export class LogedIn {
    constructor(
        public authenticated?: boolean,
        public logedinUser?: string,
        public storeId?: string
    ) {}
}
