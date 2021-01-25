import { IReference } from "./resource";

export class Employee implements IReference {
    public title: string;
    
    constructor(_title : string) {
        this.title = _title;
    }
}