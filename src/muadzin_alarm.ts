
import type { MuadzinContext } from "./muadzin_ctx";
function sleep(milis: number) {
    return new Promise((r, x) => {
        setTimeout(r, milis);
    });
}
export class PrayTimeAlarm {

    private muadzin_ctx : MuadzinContext;
    private keepRun = false;

    public constructor(ctxIn : MuadzinContext){
        this.muadzin_ctx = ctxIn;
    }

    public run(){  

        let ptime = this.muadzin_ctx.getPrayTimeNow();
        console.log(ptime);

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