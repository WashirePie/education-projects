import { Activity } from "./activity";

export class Phase {
    private _activities : Array<Activity>;
    public get activities() : Array<Activity> {
        return this._activities;
    }
    public set activities(v : Array<Activity>) {
        this._activities = v;
    }
    
    public title : string;

    constructor(_title : string) {
        this._activities = new Array<Activity>();
        this.title = _title;
    }
}