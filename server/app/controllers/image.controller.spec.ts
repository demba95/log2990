import chai = require("chai");
import spies = require("chai-spies");
import supertest = require("supertest");
import { ERROR_ID, Message } from "../../../common/communication/message";
import { Application } from "../app";
import { container } from "../inversify.config";
import { ImageService } from "../microservices/image.service";
import { TYPES } from "../types";
import { ImageController } from "./image.controller";

const HTTP_OK: number = 200;
const HTTP_BADREQUEST: number = 400;

const path1: string = "./app/documents/test-images/image_test_1.bmp";
const path2: string = "./app/documents/test-images/image_test_2.bmp";

const mockedGetDifferenceData: Message = {
    title: "Image created",
    body: "Image with difference created",
};

const mockedNoNameError: Message = {
    title: ERROR_ID,
    body: ImageController.NAME_PARAMETER_ERROR,
};

const mockedInvalidParameterError: Message = {
    title: ERROR_ID,
    body: ImageController.INVALID_PARAMETERS_ERROR,
};

const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);

describe("Image Controller", () => {
    let app: Express.Application;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();

    before(() => {
        container.snapshot();
        const service: ImageService = container.get<ImageService>(TYPES.ImageService);
        sandbox.on(service, "getDifferencesImage", () => mockedGetDifferenceData);
        sandbox.on(service, "imageToString64", () => "");
        container.rebind(TYPES.ImageService).toConstantValue(service);
        app = container.get<Application>(TYPES.Application).app;
    });

    after(() => {
        container.restore();
        sandbox.restore();
    });

    it("Should return image with difference created", (done: Mocha.Done) => {
        supertest(app)
        .post("/api/image/generation")
        .field("name", "test")
        .attach("originalImage", path1)
        .attach("modifiedImage", path2)
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedGetDifferenceData, "Image differences not created");
            done(error);
        });
    });

    it("Should return image with difference created", (done: Mocha.Done) => {
        supertest(app)
        .post("/api/image/generation")
        .field("name", "")
        .attach("originalImage", path1)
        .attach("modifiedImage", path2)
        .expect(HTTP_BADREQUEST)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedNoNameError);
            done(error);
        });
    });

    it("Should return image with difference created", (done: Mocha.Done) => {
        supertest(app)
        .post("/api/image/generation")
        .field("name", "test")
        .attach("originalImage", "")
        .attach("modifiedImage", "")
        .expect(HTTP_BADREQUEST)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedInvalidParameterError);
            done(error);
        });
    });
});
