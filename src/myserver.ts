 
import * as path from 'path'; 

import * as fs from 'fs';  
import express, { urlencoded } from 'express';
import { Server } from 'http';
import { SettingSaver } from './settingsaver.js';
import { ConfigData } from "../resources/htmlvue/tslib/PrayTimeData"
import   { MuadzinContext } from './muadzin_ctx';


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

            console.log();

            s.send("done");

        })

        app.get("/gettimes", (r, s) => {
 
            let prayTime = this.muadzin_ctx.getPrayTimeNow();


            s.setHeader('Content-Type', 'text/plain');
            s.send(JSON.stringify(prayTime.ptimeData));

        });

        app.get("/",async (r,s)=>{
            s.setHeader('Content-Type', 'text/html');
            const filePath = path.join(MuadzinContext.instance.getExtensionPath(), "resources", "htmlvue", "index.html");
		    const htmlContent = await fs.promises.readFile(filePath, 'utf8');
		
            s.send(htmlContent);
        });

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

