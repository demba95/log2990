import { Container } from "inversify";
import { Application } from "./app";
import { DateController } from "./controllers/date.controller";
import { ImageController } from "./controllers/image.controller";
import { IndexController } from "./controllers/index.controller";
import { Server } from "./server";
import { DateService } from "./services/date.service";
import { IndexService } from "./services/index.service";
import { TYPES } from "./types";

import {ConnexionController} from "./controllers/connexion.controller";
import {ConnexionService} from "./services/connexion.service";
import { ConvertImage } from "./services/convertImage.service";
import { ImageService } from "./services/image.service";

const container: Container = new Container();

container.bind(TYPES.Server).to(Server);
container.bind(TYPES.Application).to(Application);
container.bind(TYPES.IndexController).to(IndexController);
container.bind(TYPES.IndexService).to(IndexService);

container.bind(TYPES.DateController).to(DateController);
container.bind(TYPES.DateService).to(DateService);

container.bind(TYPES.ImageController).to(ImageController);
container.bind(TYPES.ImageService).to(ImageService);
container.bind(TYPES.ConvertImage).to(ConvertImage);

container.bind(TYPES.ConnexionService).to(ConnexionService);
container.bind(TYPES.ConnexionController).to(ConnexionController);

export { container };
