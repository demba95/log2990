import { Server } from "http";
import { inject, injectable } from "inversify";
import * as SocketIO from "socket.io";
import { UsersManager } from "../services/users.service";
import { TYPES } from "../types";

type Socket = SocketIO.Socket;

@injectable()
export class SocketServerManager {
    private socketServer: SocketIO.Server;

    public constructor(@inject(TYPES.UserManager) private userManager: UsersManager) {}

    public startServer(server: Server): void {
        this.socketServer = SocketIO(server);
        this.socketServer.on("connect", (socket: Socket) => {
            this.userManager.addUser(socket.client.id);
            socket.on("disconnect", () => {
                this.userManager.removeUser(socket.client.id);
            });
        });
    }

    public emitEvent(event: string): void {
        this.socketServer.emit(event);
    }
}