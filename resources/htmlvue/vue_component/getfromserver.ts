 
export type PrayTimeData = {
    imsak: string,
    fajr: string,
    sunrise: string,
    dhuhr: string,
    asr: string,
    sunset: string,
    maghrib: string,
    isha: string,
    midnight: string,
}

function getFullUrl(relative:string){
    var add =  (window as any).myserveradd as string;

    if(add.endsWith("/")){
        add = add.substring(0, add.length - 1);
    }

    if(!relative.startsWith("/")){
        relative = "/" + relative;
    }

    return add + relative;

}

export async function getPrayTimes() : Promise<PrayTimeData> {
    try {

        let res = await fetch(getFullUrl("/gettimes"));
        let tst = await res.text();

        let obj = JSON.parse(tst) as PrayTimeData;

        return obj;        
    } catch (error) {
        
    }

    return null;
}