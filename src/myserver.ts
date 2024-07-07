import * as vscode from 'vscode';
import * as path from 'path';
import * as PrayTimes from "./PrayTimes.js"
 
import express, { urlencoded } from 'express';
import { Server } from 'http';
import { SettingSaver } from './settingsaver.js';

 


export class MyServer {
    private server: Server | null = null;

    /**
     * cunstructor dibuat private agar instance class hanya bisa diakses melalui instance (Singleton)
     */
    private constructor(){}

    private static _instance? : MyServer;

    /**
     * Singleton MyServer class
     */
    public static get instance() : MyServer {
        if(this._instance == null){
            this._instance = new MyServer;
        }

        return this._instance;
    }

    public createServer(context: vscode.ExtensionContext) {
 
        let settingSaver = new SettingSaver(context); 


        const app = express();

        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');  
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');   
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);  
            } else {
                next();  
            }
        });


        app.use("/static", express.static(path.join(context.extensionPath,"resources", "htmlvue")));

        app.get("/gettimes", (r, s) => {
 


            let cursetting = settingSaver.getSetting();  
            let prayTime = PrayTimes.getTimes(new Date, cursetting.lat, cursetting.lng)
         


            s.setHeader('Content-Type', 'text/plain');
            s.send(JSON.stringify(prayTime));
 
        });

        app.get("/getsetting",(r,s)=>{
            let cursetting = settingSaver.getSetting(); 


            s.setHeader('Content-Type', 'text/plain');
            s.send(JSON.stringify(cursetting));

        });


        this.server = app.listen(0)
        var actualPort = (this.server as any)?.address().port;

        var actAdds =  `http://localhost:${actualPort}`;
        console.log(actAdds);
        return actAdds;
    }


    public closeServer(){
        if(this.server != null){
            this.server.close();
        }
    } 



}

