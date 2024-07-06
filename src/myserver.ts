 
import express, { urlencoded } from 'express';
import { Server } from 'http';

 


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

    public createServer() {
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

        app.get("/getcontent", (r, s) => {
            s.setHeader('Content-Type', 'text/plain');
            s.send("haloooooo");
        });


        this.server = app.listen(0)
        var actualPort = (this.server as any)?.address().port;
        return `http://localhost:${actualPort}/getcontent`;
    }


    public closeServer(){
        if(this.server != null){
            this.server.close();
        }
    } 



}

