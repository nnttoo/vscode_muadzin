import * as vscode from 'vscode';
import { MyServer } from './myserver';


export class MuadzinContext{ 

    public myserver : MyServer = new MyServer();

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
    }
}