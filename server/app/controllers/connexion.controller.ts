import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { Message } from "../../../common/communication/message";
import { ConnexionService } from "../services/connexion.service";
import { TYPES } from "../types";
@injectable()
export class ConnexionController {
    public static  readonly URL: string = "/api/connexion";

    public constructor(@inject(TYPES.ConnexionService) private connexionService: ConnexionService) { }

    public get router(): Router {
        const router: Router = Router();
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            this.connexionService.addName(req.query.name, req.query.id).then(
                (message: Message) => {
                    res.json(message);
                },
                (error: Error) => {
                    res.json(error);
                });
        });

        return router;
    }
}
