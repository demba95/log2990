import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class TimerService {

  public readonly CONVERSION_SEC_TO_MILI: number = 1000;
  public readonly CONVERSION_MIN_TO_SEC: number = 60;
  public readonly FORMAT_ZERO_MAX: number = 9;
  private _nbSeconds: number;
  private _nbMinutes: number;
  private timerUpdate: NodeJS.Timeout;
  public constructor() {
    this._nbSeconds = 0;
    this._nbMinutes = 0;
   }

  public startTimer(): void {
    this.stopTimer();
    this._nbSeconds = 0;
    this._nbMinutes = 0;
    this.timerUpdate = setInterval(this.updateTime.bind(this), this.CONVERSION_SEC_TO_MILI);
  }
  public stopTimer(): void {
    clearInterval(this.timerUpdate);
  }
  public getTimeAsString(): string {
    let time: string = "";
    if (this._nbMinutes <= this.FORMAT_ZERO_MAX) {
      time += "0";
    }
    time += this._nbMinutes + ":";
    if (this._nbSeconds <= this.FORMAT_ZERO_MAX) {
      time += "0";
    }
    time += this._nbSeconds;

    return time;
  }

  private updateTime(): void {
    this._nbSeconds++;
    if (this._nbSeconds === this.CONVERSION_MIN_TO_SEC) {
      this._nbMinutes++;
      this._nbSeconds = 0;
    }
  }
  public setToZero(): void {
    this.stopTimer();
    this._nbSeconds = 0;
    this._nbMinutes = 0;
  }
  public get nbMinutes(): number {
    return this._nbMinutes;
  }
  public get nbSeconds(): number {
    return this._nbSeconds;
  }
}
