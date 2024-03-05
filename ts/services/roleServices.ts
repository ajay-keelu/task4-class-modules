import { Role } from "../models/Role";
class RoleServices {

    set(data: Role[]): void {
        localStorage.setItem("RolesData", JSON.stringify(data));
    }

    getAll(): Role[] {
        return (JSON.parse(localStorage.getItem("RolesData")) || []).map(role => new Role(role));
    }

    getById(id: string): Role {
        return this.getAll().find((role: Role) => role.id == id);
    }

    updateRole(role: Role) {
        let roles = this.getAll()
        let index = roles.findIndex(ele => ele.id == role.id);
        roles[index] = role;
        this.set(roles)
    }

    generateId(): string {
        let date: Date = new Date();
        return `${date.getDay()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getMilliseconds()}`;
    }

    createRole(role: Role) {
        role.id = this.generateId();
        this.set([...this.getAll(), role]);
    }

    save(role: Role) {
        if (role.id)
            this.updateRole(role);
        else
            this.createRole(role);
    }
}

export let roleServices = new RoleServices();
