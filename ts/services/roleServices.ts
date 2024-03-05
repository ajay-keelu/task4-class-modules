import { Role } from "../models/Role";
class RoleServices {

    setRoles(data: Role[]): void {
        localStorage.setItem("RolesData", JSON.stringify(data));
    }
    getRoles(): Role[] {
        return JSON.parse(localStorage.getItem("RolesData")) || [];
    }
    getRoleById(id: string): Role {
        return this.getRoles().find((role: Role) => role.id == id);
    }
    updateRole(role: Role) {
        let roles = this.getRoles()
        let index = roles.findIndex(ele => ele.id == role.id);
        roles[index] = role;
        this.setRoles(roles)
    }
    generateId(): string {
        let date: Date = new Date();
        return `${date.getDay()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getMilliseconds()}`;
    }
    createRole(role: Role) {
        role.id = this.generateId();
        this.setRoles([...this.getRoles(), role]);
    }
    save(role: Role) {
        if (role.id)
            this.updateRole(role);
        else
            this.createRole(role);
    }
}

export let roleServices = new RoleServices();
