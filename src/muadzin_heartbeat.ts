

function sleep(milis: number) {
    return new Promise((r, x) => {
        setTimeout(r, milis);
    });
}
export class MuadzinHeartBeat {
    public keepRun = false;

    public run(){
        console.log("halo");
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

}