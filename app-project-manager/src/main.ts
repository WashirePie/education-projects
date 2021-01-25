import { connect } from "./connection";
import { Project } from "./classes/project";
import { Activity } from "./classes/activity";
import { Employee } from "./classes/employee";

const db = connect();
const modelIperka = ["Inform", "Plan", "Decide", "Realize", "Control", "Evaulate"];
const sampleEmployees = ["Sam", "Bob", "Sal", "Jeb", "Jon", "Ash", "Jan", "Frederick"];

const project : Project = Project.fromModel(modelIperka, "Sample Project");
let employees : Array<Employee> = new Array<Employee>();

sampleEmployees.forEach(employee => {
    employees.push(new Employee(employee));
})

project.phases.forEach(phase => {
    phase.activities.push(new Activity("Sample Activity"));
});

console.log(project);

db.projects.insert( project );

db.projects.update( { title: "Sample Project" }, { title: "Renamed Sample Project" }, { upsert: true }, (err : any, replaced: number) => {
    console.log(replaced);
});


