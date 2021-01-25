export class Resource {
    private _plan : number;
    public get plan() : number {
        return this._plan;
    }
    public set plan(v : number) {
        this._plan = v;
    }

    private _current : number;
    public get current() : number {
        return this._current;
    }
    public set current(v : number) {
        this._current = v;
    }

    public reference : IReference;
    public title : string;
    
    constructor(_title: string, _ref : IReference) {
        this._plan = 0;
        this._current = 0;

        this.title = _title;
        this.reference = _ref;
    }
    
}

export interface IReference {
    title : string;
}