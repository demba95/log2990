// tslint:disable-next-line:typedef
const TYPES =  {
        Server: Symbol("Server"),
        Application: Symbol("Application"),
        ImageController: Symbol("ImageController"),
        ImageService: Symbol("ImageService"),
        ConvertImage: Symbol("ConvertImage"),
        ConnexionController : Symbol("ConnexionController"),
        ConnexionService: Symbol("ConnexionService"),
        GameListService: Symbol.for("GameListService"),
        GameListController: Symbol.for("GameListController"),
        UserManager: Symbol("UserManager"),
        SocketServerManager: Symbol("SocketServerManager"),
        DatabaseService: Symbol("DatabaseService"),
        Game3DGeneratorService: Symbol("Game3DGeneratorService"),
        Game3DModificatorService: Symbol("Game3DModificatorService"),
        ObjectGeneratorService: Symbol("ObjectGeneratorService"),
        IdentificationController: Symbol("IdentificationController"),
        IdentificationServiceManager: Symbol("IdentificationServiceManager"),
        Identification3DController: Symbol("Identification3DController"),
        Identification3DService: Symbol("Identification3DService"),
        GameRoomService: Symbol("GameRoomService"),
        FormValidatorService: Symbol("FormValidatorService"),
};

export  { TYPES };
