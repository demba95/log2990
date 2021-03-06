import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule, MatProgressSpinnerModule } from "@angular/material";
import { MatCardModule } from "@angular/material/card";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AdminMenuComponent } from "./adminView/admin-menu/admin-menu.component";
import { FreeGeneratorComponent } from "./adminView/free-generator/free-generator.component";
import { SimpleGeneratorComponent } from "./adminView/simple-generator/simple-generator.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { Game2DViewComponent } from "./gameView/game2D-view/game2D-view.component";
import { Game3DViewComponent } from "./gameView/game3D-view/game3D-view.component";
import { InitialComponent } from "./initial/initial.component";
import { ListViewComponent } from "./list-view/list-view.component";
import { RenderService } from "./scene3D/render.service";
import { ShapeCreatorService } from "./scene3D/geometric/shape-creator.service";
import { FileValidatorService } from "./services/file-validator.service";
import { IndexService } from "./services/index.service";
import { ModalService } from "./services/modal.service";
import { SocketService } from "./services/socket.service";
import { GameMessagesComponent } from "./gameView/game-messages/game-messages.component";
import { ErrorPopupComponent } from "./gameView/error-popup/error-popup.component";
import { GamecardComponent } from "./gamecard/gamecard.component";
import { MedievalObjectsCreatorService } from "./scene3D/thematic/medieval-objects-creator.service";
import { TimerService } from "./services/timer.service";
import { EndingMessageComponent } from "./gameView/ending-message/ending-message.component";
import { WaitingComponent } from "./waiting/waiting.component";

@NgModule({
  declarations: [
    AppComponent,
    InitialComponent,
    AdminMenuComponent,
    FreeGeneratorComponent,
    ListViewComponent,
    SimpleGeneratorComponent,
    Game2DViewComponent,
    Game3DViewComponent,
    GameMessagesComponent,
    Game3DViewComponent,
    ErrorPopupComponent,
    GamecardComponent,
    EndingMessageComponent,
    GamecardComponent,
    WaitingComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([])
  ],
  entryComponents: [
    SimpleGeneratorComponent,
    FreeGeneratorComponent,
  ],
  providers: [
    IndexService,
    SocketService,
    ModalService,
    FileValidatorService,
    RenderService,
    ShapeCreatorService,
    MedievalObjectsCreatorService,
    TimerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
