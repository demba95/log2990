import { OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Gamer, NewGameStarted, IGameRoomUpdate } from "../../../../common/communication/message";
import { ErrorPopupComponent } from "./error-popup/error-popup.component";
import { GameService } from "../services/game.service";
import { SocketService } from "../services/socket.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IndexService } from "../services/index.service";
import { TimerService } from "../services/timer.service";
import { INITIAL_PATH, CORRECT_SOUND_PATH, ERROR_SOUND_PATH, VICTORY_SOUND_PATH, GAMES_LIST_PATH } from "../global/constants";
import { SocketsEvents } from "../../../../common/communication/socketsEvents";

export abstract class GameViewComponent implements OnInit, OnDestroy {
    private readonly CLICK_DELAY: number = 1000;
    private readonly NB_MAX_DIFF: number = 7;
    private readonly NB_MAX_DIFF_MULTI: number = 4;

    protected gamers: Gamer[];
    protected _disableClick: string;
    protected _blockedCursor: string;
    protected gameRoomId: string;

    @ViewChild(ErrorPopupComponent)
    private errorPopup: ErrorPopupComponent;
    protected lastClick: MouseEvent;

    private correctSound: HTMLAudioElement;
    private errorSound: HTMLAudioElement;
    private victorySound: HTMLAudioElement;

    protected constructor(
        protected gameService: GameService,
        protected socket: SocketService,
        protected route: ActivatedRoute,
        protected index: IndexService,
        protected timer: TimerService,
        protected ref: ChangeDetectorRef,
        protected router: Router) {
        if (!this.index.username) {
            this.router.navigate([INITIAL_PATH]);
        }
        this.socket.addEvent(SocketsEvents.CREATE_GAME_ROOM, this.handleCreateGameRoom.bind(this));
        this.correctSound = new Audio(CORRECT_SOUND_PATH);
        this.errorSound = new Audio(ERROR_SOUND_PATH);
        this.victorySound = new Audio(VICTORY_SOUND_PATH);
        this.gamers = [];
        this._disableClick = "";
        this._blockedCursor = "";
    }

    public ngOnInit(): void {
        this.timer.setToZero();
        this.gameRoomId = this.getGameRoomId();
    }

    public ngOnDestroy(): void {
        this.socket.unsubscribeTo(SocketsEvents.CREATE_GAME_ROOM);
    }

    protected getId(): string {
        return String(this.route.snapshot.paramMap.get("id"));
    }

    private getGameRoomId(): string {
        return this.route.snapshot.queryParamMap.get("gameRoomId");
    }

    private handleCreateGameRoom(response: NewGameStarted): void {
        this.gameRoomId = response.gameRoomId;
        this.gamers = response.players;
        this.ref.reattach();
        this.timer.startTimer();
    }

    protected abstract handleCheckDifference(update: IGameRoomUpdate): void;

    protected handleDifferenceFound(username: string, differencesFound: number): void {
        const gamer: Gamer = this.gamers.find((x: Gamer) => x.username === username);
        gamer.differencesFound = differencesFound;
        const isGameOver: boolean = differencesFound === (this.gamers.length > 1 ? this.NB_MAX_DIFF_MULTI : this.NB_MAX_DIFF);
        if (username === this.index.username) {
            if (isGameOver) {
                this.finishGame();
            } else {
                this.correctSound.play().catch((error: Error) => console.error(error.message));
            }
        } else {
            if (isGameOver) {
                this.timer.stopTimer();
                this._disableClick = "disable-click";
                // TODO TELL THE GAMER THAT HE'S BAD
            }
        }
    }

    protected handleDifferenceError(username: string): void {
        if (this.index.username === username) {
            this.errorSound.play().catch((error: Error) => console.error(error.message));
            this.errorPopup.showPopup(this.lastClick.clientX, this.lastClick.clientY);
            this._disableClick = "disable-click";
            this._blockedCursor = "cursor-not-allowed";
            setTimeout(
                () => {
                    this.errorPopup.hidePopup();
                    this._disableClick = "";
                    this._blockedCursor = "";
                },
                this.CLICK_DELAY
            );
        }
    }

    protected finishGame(): void {
        this.timer.stopTimer();
        this._disableClick = "disable-click";
        this.victorySound.play().catch((error: Error) => console.error(error.message));
    }

    protected getBack(): void {
        this.router.navigate([GAMES_LIST_PATH]).catch((error: Error) => console.error(error.message));
    }

    public get disableClick(): string {
        return this._disableClick;
    }

    public get blockedCursor(): string {
        return this._blockedCursor;
    }
}
