import { Role } from "../models/Role";

function setRoles(data: Role[]): void {
    localStorage.setItem("RolesData", JSON.stringify(data));
}
function getRoles(): Role[] {
    return JSON.parse(localStorage.getItem("RolesData")) || [];
}
function getRoleById(id: string): Role {
    return getRoles().find((role: Role) => role.id == id)
}
function updateRole(roles: Role[], role: Role): Role[] {
    let index = roles.findIndex(ele => ele.id == role.id);
    roles[index] = role;
    return roles;
}
function getRoleLocations(): string[] {
    let locations = new Set<string>()
    getRoles().forEach(role => {
        locations.add(role.location)
    })
    return [...locations] as string[]
}

function getRoleDepartments(): string[] {
    let departments = new Set<string>()
    getRoles().forEach(role => {
        departments.add(role.department)
    })
    return [...departments] as string[]
}
function generateId(): string {
    let date: Date = new Date()
    return `${date.getDay()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getMilliseconds()}`;
}
export { setRoles, getRoles, getRoleById, updateRole, generateId, getRoleLocations, getRoleDepartments }
