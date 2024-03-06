import { Employee } from "../models/Employees";
import { Role } from "../models/Role";

class MasterService {
    getRoles(): Role[] {
        return (JSON.parse(localStorage.getItem("RolesData")) || []).map(role => new Role(role));
    }

    getStatus(employees: Employee[]): string[] {
        let status = new Set<string>()
        employees.forEach(employee => {
            status.add(employee.status == 1 ? 'Active' : 'InActive')
        })
        return [...status];
    }

    getLocations(employees: Employee[]): string[] {
        let locations = new Set<string>();
        employees.forEach(employee => {
            locations.add(employee.location);
        })
        return [...locations];
    }

    getDepartments(employees: Employee[]): string[] {
        let departments = new Set<string>();
        employees.forEach(employee => {
            departments.add(employee.department);
        })
        return [...departments];
    }

    getRoleLocations(): string[] {
        let locations = new Set<string>();
        this.getRoles().forEach(role => {
            locations.add(role.location);
        })
        return [...locations];
    }

    getRoleDepartments(): string[] {
        let departments = new Set<string>();
        this.getRoles().forEach(role => {
            departments.add(role.department);
        })
        return [...departments];
    }
}

export let masterService = new MasterService();