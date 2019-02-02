import { Component, OnInit, Input} from '@angular/core';
import { GameService } from '../game.service';
import { IGame } from '../../../../common/models/game';
import { SocketService } from '../socket.service';
import { SocketsEvents } from "../../../../common/communication/SocketsEvents";

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})

export class ListViewComponent implements OnInit {

  public simpleGames: IGame[];
  public freeGames: IGame[];
  @Input() isAdminMode: Boolean;

  constructor(private gameService: GameService, private socket:SocketService) {
    this.isAdminMode = false;
    this.socket.addEvent(SocketsEvents.UPDATE_SIMPLES_GAMES, this.getSimpleGames.bind(this));
  }

  ngOnInit() {
    this.getSimpleGames();
    this.getFreeGames();
    this.isAdminMode = false;
  
  }


  public getSimpleGames(): void {
    this.gameService.getSimpleGames()
        .subscribe((response: IGame[]) => this.simpleGames = response);
  }

  public deleteSimpleGames(game: IGame): void {
    //faudra afficher le message
    this.gameService.deleteSimpleGame(game).subscribe();
  }

  public getFreeGames(): void {
    this.gameService.getFreeGames()
        .subscribe((response: IGame[]) => this.freeGames = response);
  }

  

}