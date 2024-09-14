import * as vscode from 'vscode';   
import { MuadzinContext } from "./muadzin_ctx"; 
import { HtmlGetter } from './html_getter';
import path from 'path';
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
    private async openWebview(title : string){
        console.log("harusnya kebuka iniiiiii");
        var panel = vscode.window.createWebviewPanel(
            'myFloatingView', 
            title, 
            vscode.ViewColumn.Active, 
            {
                enableScripts : true,
            }
        );

        var urlAdd = MuadzinContext.instance.urlAddress;
        if(!urlAdd.endsWith("/")){
            urlAdd = urlAdd + "/";
        }

        urlAdd = urlAdd + "adzan?title=" + encodeURI(title);

        console.log(urlAdd);
        var iframehtml = await HtmlGetter.getInstance().getIframeHtml(urlAdd)

        panel.webview.html =  iframehtml;  
    }

    public async run(){  
        
        let ptime = this.muadzin_ctx.getPrayTimeNow();
        let config = this.muadzin_ctx.settingSaver.getSetting();




        let ptimeSpan =  ptime.getNextPrayTime(); 
        if(ptimeSpan.pdate == null) return;   

        
        console.log(ptimeSpan.pdate.name);
        console.log(config.alarmLeadTimeMinute);

        /**
         * Jika alarm yang sebelumnya menyala adalah nama shalat yang sama
         * maka diabaikan, misalkan dzuhur sudah timbul alarm, maka dia return di sini
         */
        if(ptimeSpan.pdate.name == this.lastAlaramSholatName) return; 


        if(ptimeSpan.span == null) return;

        
        // ambil settingan lead time dan kurangi nilai timespan 
        // dengan leadTime
        let leadTime = config.alarmLeadTimeMinute  * 60 * 1000;

        ptimeSpan.span.diffInMilliseconds =  ptimeSpan.span.diffInMilliseconds - leadTime;

        console.log(ptimeSpan.span?.diffInMinutes);
        if(ptimeSpan.span.hours > 0) return; // berarti belum jamnya
        if(ptimeSpan.span.minutes > 0) return; // lebih dari 1 menit lagi
        if(ptimeSpan.span.seconds > 1) return; // nah ini tinggal 1 detik lagi

        this.lastAlaramSholatName = ptimeSpan.pdate.name;
        this.openWebview(ptimeSpan.pdate.name.toUpperCase());
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