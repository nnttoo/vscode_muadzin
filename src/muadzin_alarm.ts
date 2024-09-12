import * as vscode from 'vscode';

import type { MuadzinContext } from "./muadzin_ctx";
import { timeSpan } from '../resources/htmlvue/tslib/PrayTimeTs';
function sleep(milis: number) {
    return new Promise((r, x) => {
        setTimeout(r, milis);
    });
}
export class PrayTimeAlarm {

    private muadzin_ctx : MuadzinContext;
    private keepRun = false;
    private lastAlaramSholatName = "";

    public constructor(ctxIn : MuadzinContext){
        this.muadzin_ctx = ctxIn;
    }
    
    // menampilkan webview
    private openWebview(){
        console.log("harusnya kebuka iniiiiii");
        var panel = vscode.window.createWebviewPanel(
            'myFloatingView', 
            'My Floating View', 
            vscode.ViewColumn.Active, 
            {}
        );
        panel.webview.html = `<html><body><h1>Hello from Floating View</h1></body></html>`;
    }

    public async run(){  
        
        let ptime = this.muadzin_ctx.getPrayTimeNow();



        let ptimeSpan =  ptime.getNextPrayTime();
        if(ptimeSpan.pdate == null) return;  
        console.log(ptimeSpan.pdate);
        console.log(ptimeSpan.span?.seconds);
        if(ptimeSpan.pdate.name == this.lastAlaramSholatName) return; // berarti alarmnya sudah nyala


        if(ptimeSpan.span == null) return;
        if(ptimeSpan.span.hours > 0) return; // berarti belum jamnya
        if(ptimeSpan.span.minutes > 0) return; // hanya tinggal 1 menit

        this.lastAlaramSholatName = ptimeSpan.pdate.name;
        this.openWebview();
    }

    public async startTimer() {



        this.keepRun = true;
        while(this.keepRun){
            await sleep(1000);
            try {
                this.run();
            } catch (error) {
                
            }
        }
    }

    public stopTimer(){
        this.keepRun = false;
    }

}