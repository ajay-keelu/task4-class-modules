import { Employee } from "./Employees"

export class Role {
    public name: string;
    public department: string;
    public description: string;
    public location: string;
    public id: string;
    public employeesAssigned: Employee[];
    constructor(role: Role) {
        Object.assign(this, role);
    }
}