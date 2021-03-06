import { injectable } from "inversify";
import "reflect-metadata";

export interface User {
    username: string;
    socketId: string;
}

@injectable()
export class UsersManager {

    private users: User[];

    public constructor() {
        this.users = [];
    }

    public addUser(socketId: string): void {
        this.users.push(
            {
                username: "",
                socketId: socketId,
            });
    }

    public setUserName(username: string | null, socketId: string | null): boolean {
        if (username === null || socketId === null) {
            return false;
        }
        const index: number = this.users.findIndex((x: User) => x.socketId === socketId);
        if (index === -1) {
            return false;
        }
        this.users[index].username = username;

        return true;
    }

    public removeUser(socketId: string): boolean {
        const index: number = this.users.findIndex((x: User) => x.socketId === socketId);
        if (index === -1) {
            return false;
        }
        this.users.splice(index, 1);

        return true;
    }

    public getUser(username: string): User | null {
        const index: number = this.users.findIndex((x: User) => x.username === username);
        if (index === -1) {
            return null;
        }

        return this.users[index];
    }

    public getUsername(socketId: string): string {
        const index: number = this.users.findIndex((x: User) => x.socketId === socketId);

        return this.users[index].username;
    }

    public userExist(username: string): boolean {
        const index: number = this.users.findIndex((x: User) => x.username === username);

        return index !== -1;
    }
}
