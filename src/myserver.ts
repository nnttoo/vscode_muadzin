import * as vscode from 'vscode';
import * as path from 'path';
import * as PrayTimesTs from "../resources/htmlvue/tslib/PrayTimeTs"
 
import express, { urlencoded } from 'express';
import { Server } from 'http';
import {  SettingSaver } from './settingsaver.js';
import {ConfigData} from "../resources/htmlvue/tslib/PrayTimeData"

 
async function readBody(req: express.Request) {
    let bodystr: any = await new Promise((r, x) => {
        let fileData: Buffer[] = [];
        req.on("data", (chunk) => {
            fileData.push(chunk);
        });

        req.on("end", () => {
            const fileBuffer = Buffer.concat(fileData);
            r(fileBuffer);
        })
    });

    return bodystr;
}

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

    private serverAdd? : string;

    public createServer(context: vscode.ExtensionContext) {

        if(this.serverAdd != null){
            return this.serverAdd;
        }
 
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
        app.get("/getconfig",(r,s)=>{
            let cursetting = settingSaver.getSetting();  
            s.setHeader('Content-Type', 'text/plain');
            s.send(JSON.stringify(cursetting));

        });

        app.post("/saveconfig", async (r,s)=>{

            let body =  await readBody(r);

            try {
                
                let bodyStr = body.toString();
                let obj = JSON.parse(bodyStr);

                settingSaver.saveSetting((obj as any) as ConfigData);


            } catch (error) {
                
            }

            console.log();

            s.send("done");

        })

        app.get("/gettimes", (r, s) => { 

            let cursetting = settingSaver.getSetting();  
            let prayTime = PrayTimesTs.prayTime.getPrayTime(new Date, cursetting.lat, cursetting.lng)  
            

            s.setHeader('Content-Type', 'text/plain');
            s.send(JSON.stringify(prayTime.ptimeData));
 
        }); 
       

        this.server = app.listen(0)
        var actualPort = (this.server as any)?.address().port;

        this.serverAdd =  `http://localhost:${actualPort}`; 
        return this.serverAdd;
    }


    public closeServer(){
        if(this.server != null){
            this.server.close();
        }
    } 



}

