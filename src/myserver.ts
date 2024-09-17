 
import * as path from 'path'; 

import * as fs from 'fs';  
import express, { urlencoded } from 'express';
import { Server } from 'http';
import { SettingSaver } from './settingsaver.js';
import { ConfigData } from "../tslib/PrayTimeData.js"
import   { MuadzinContext } from './muadzin_ctx';
import { HtmlGetter } from './html_getter.js'; 
import { Mp3Player} from "./playaudio.js"


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
    private muadzin_ctx: MuadzinContext



    public constructor(muadinctx: MuadzinContext) {
        this.muadzin_ctx = muadinctx;
    }

    private serverAdd: string | null = null;

    public createServer() {

        if (this.serverAdd != null) {
            return this.serverAdd;
        }

        let settingSaver = this.muadzin_ctx.settingSaver; 


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


        app.use("/static", express.static(path.join(this.muadzin_ctx.getExtensionPath(), "resources", "htmlvue")));
        app.get("/getconfig", (r, s) => {
            let cursetting = settingSaver.getSetting();
            s.setHeader('Content-Type', 'text/plain');
            s.send(JSON.stringify(cursetting));

        });

        app.post("/saveconfig", async (r, s) => {

            let body = await readBody(r);

            try {

                let bodyStr = body.toString();
                let obj = JSON.parse(bodyStr);

                settingSaver.saveSetting((obj as any) as ConfigData);


            } catch (error) {

            }


            s.send("done");

        })

        app.get("/gettimes", (r, s) => {
 
            let prayTime = this.muadzin_ctx.getPrayTimeNow();


            s.setHeader('Content-Type', 'text/plain');
            s.send(JSON.stringify(prayTime.ptimeData));

        });

       

        app.get("/adzan",async (r,s)=>{
            var title = r.query.title;

            
            var audioFile = path.join(MuadzinContext.instance.getExtensionPath(), "resources", "htmlvue", "assets","myadzan.mp3"); 
            Mp3Player.playAutoStop(audioFile);

            s.setHeader('Content-Type', 'text/html'); 
		    let htmlContent = await HtmlGetter.getInstance().getAnyHtml("adzan.html");
		
            if(title != null && title != ""){
                htmlContent =   htmlContent.replaceAll("AdzanName",title +"");
            }

            s.send(htmlContent);
        });

        app.get("/adzan_pump",(r,s)=>{
            Mp3Player.playAutoStopPump();
            console.log("pump send");
            s.send("pump");
        });


        /**Server Vue */

        app.get("/",async (r,s)=>{
            s.setHeader('Content-Type', 'text/html'); 
		    const htmlContent = await HtmlGetter.getInstance().getVueHtml();
		
            s.send(htmlContent);
        });
        app.use("/vueassets", express.static(
            path.join(this.muadzin_ctx.getExtensionPath(), 
            "resources", 
            "MuadzinUiVue",
            "vueassets"
        )));
       
        /** Server Vue End */

        this.server = app.listen(0)
        var actualPort = (this.server as any)?.address().port;

        this.serverAdd = `http://localhost:${actualPort}`;
        return this.serverAdd;
    }


    public closeServer() {
        if (this.server != null) {
            this.serverAdd = null;
            this.server.close();
        }
    }



}

