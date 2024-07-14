import * as vscode from 'vscode';
import { MyServer } from './myserver';
import { MuadzinHeartBeat } from './muadzin_heartbeat';


export class MuadzinContext{ 

    public myserver : MyServer = new MyServer();
    private heartbeat = new MuadzinHeartBeat();

    private constructor(){}


    private static _instance : MuadzinContext | null = null;
    public static get instance(){
        if(this._instance == null){
         this._instance = new MuadzinContext();
        } 
        return this._instance;
    }


    public onActivate(context: vscode.ExtensionContext){

    }


    public onDeactivate(){
        this.myserver.closeServer();
        this.heartbeat.stopTimer();
    }
}