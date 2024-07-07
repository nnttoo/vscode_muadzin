 
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

export type ConfigData = {
    lat : number,
    lng : number,
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


async function getJsonFromServer(add : string){
    let res = await fetch(getFullUrl(add));
    let tst = await res.text();

    console.log(tst);
    return JSON.parse(tst);
}


export async function getPrayTimes() : Promise<PrayTimeData> {
    try {
 
        let obj = await getJsonFromServer("/gettimes") as PrayTimeData  
        return obj;        
    } catch (error) {
        
    }

    return null;
}


export async function getSetting() : Promise<ConfigData> {
    try { 
        
        let obj = await getJsonFromServer("/getconfig") as ConfigData  
        return obj;        
    } catch (error) {
        
    }

    return null;
}

export async function saveConfig(configData : ConfigData) {
    
    try {
        
        let res = await fetch(getFullUrl("/saveconfig"),{
            method : "POST",
            body : JSON.stringify(configData),
        });

        let txt = await res.text();

        return txt;

    } catch (error) {
        
    }

    return '';
}
