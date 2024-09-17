import type * as vscode from 'vscode';
import { MyServer } from './myserver'; 
import { SettingSaver } from './settingsaver';
import { PrayTimeAlarm } from './muadzin_alarm';

import * as PrayTimesTs from "../tslib/PrayTimeTs"

export class MuadzinContext {

    private myserver: MyServer;
    private praytimeAlarm : PrayTimeAlarm;
    public settingSaver = new SettingSaver();
    public urlAddress : string = "";
    private vscode_ctx: vscode.ExtensionContext | null = null;

    private constructor() {
        this.myserver = new MyServer(this);
        this.praytimeAlarm = new PrayTimeAlarm(this);
    }


    private static _instance: MuadzinContext | null = null;
    public static get instance() {
        if (this._instance == null) {
            this._instance = new MuadzinContext();
        }
        return this._instance;
    }

    public getExtensionPath(){
        if(this.vscode_ctx == null){
            return "";
        }

        return this.vscode_ctx.extensionPath;
    }

    public   onActivate(context: vscode.ExtensionContext)   {
        this.vscode_ctx = context;
        this.settingSaver.context = context;
        this.praytimeAlarm.startTimer();
        this.urlAddress =  this.getServerAddressAndStart();
        console.log(this.urlAddress);
    }

    private getServerAddressAndStart(){ 
        return this.myserver.createServer();
    }
 
    public onDeactivate() {
        this.myserver.closeServer();
        this.praytimeAlarm.stopTimer();
    }

    public getPrayTimeNow(){
        let cdata = this.settingSaver.getSetting();
        let ptimeColl =  PrayTimesTs.prayTime.getPrayTime(new Date,cdata.lat,cdata.lng); 
        return ptimeColl;
    }
}