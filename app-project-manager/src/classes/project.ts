import { Phase } from "./phase";

export class Project {
    private _phases : Array<Phase>;
    public get phases() : Array<Phase> {
        return this._phases;
    }
    public set phases(v : Array<Phase>) {
        this._phases = v;
    }
    
    public title : string;
    public _id? : string;

    constructor(_title : string) {
        this._phases = new Array<Phase>();
        this.title = _title;
    }

    public static fromModel(model : Array<string>, _title : string) {
        let p = new Project(_title);
        let phases = new Array<Phase>();
        model.forEach(phase => phases.push(new Phase(phase)));
        p.phases = phases;
        return p;
    }
}