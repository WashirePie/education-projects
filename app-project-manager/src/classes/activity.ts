import { Resource } from "./resource";

export class Activity {
    private _resources : Array<Resource>;
    public get resources() : Array<Resource> {
        return this._resources;
    }
    public set resources(v : Array<Resource>) {
        this._resources = v;
    }

    public title : string;

    constructor(_title : string) {
        this._resources = new Array<Resource>();
        this.title = _title;
    }
}