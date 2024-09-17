
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path'; 
import { MuadzinContext } from './muadzin_ctx';
export class HtmlGetter{

    private constructor(){

    }

    private static _instance? : HtmlGetter;

    public static getInstance(){
        if(this._instance == null){
            this._instance = new HtmlGetter();
        }

        return this._instance;
    }

    public async getAnyHtml(filename : string) : Promise<string>{
        const filePath = path.join(MuadzinContext.instance.getExtensionPath(), "resources", "htmlvue", filename);
		const htmlContent = await fs.promises.readFile(filePath, 'utf8');
        return htmlContent;
    }


    public async getIframeHtml(urladdress : string) : Promise<string>{
      
        let htmlContent = await this.getAnyHtml("iframe.html");
		const finalHtml = htmlContent.replaceAll('MYSERVERADD', urladdress);
        return finalHtml;
    }

    public get VuePath(){
        const filePath = path.join(MuadzinContext.instance.getExtensionPath(), "resources");
		let vupath = path.join(filePath,"MuadzinUiVue");
        return vupath;
    }

    public async getVueHtml(){
        let vpath = this.VuePath;
        let pathHtml = path.join(vpath,"index.html");
        const htmlContent = await fs.promises.readFile(pathHtml, 'utf8');
        
        return htmlContent;

    }
}