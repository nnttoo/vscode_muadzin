
export class Utils{
    public static sleep(time : number){
        return new Promise((r,x)=>{
            setTimeout(r, time);
        });
    }

    public static padStr(str : string, n : number){
        while(str.length < n){
            str = "0" + str;
        }

        return str;
    }
}