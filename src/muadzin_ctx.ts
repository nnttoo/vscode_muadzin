import type * as vscode from 'vscode';
import { MyServer } from './myserver';
import { MuadzinHeartBeat } from './muadzin_heartbeat';
import { SettingSaver } from './settingsaver';


export class MuadzinContext {

    private myserver: MyServer;
    private heartbeat = new MuadzinHeartBeat();
    public settingSaver = new SettingSaver();
    private vscode_ctx: vscode.ExtensionContext | null = null;

    private constructor() {
        this.myserver = new MyServer(this);
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

    public onActivate(context: vscode.ExtensionContext) {
        this.vscode_ctx = context;
        this.settingSaver.context = context;
        this.heartbeat.startTimer();
    }

    public getServerAddressAndStart(){
        return this.myserver.createServer();
    }

    public onDeactivate() {
        this.myserver.closeServer();
        this.heartbeat.stopTimer();
    }
}