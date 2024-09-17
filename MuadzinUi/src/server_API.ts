
import type  {ConfigData, PrayTimeData} from "../../tslib/PrayTimeData" 


function getFullUrl(relative:string){
    var add = "/";
    if(import.meta.env.VITE_SERVERURL){
        add = import.meta.env.VITE_SERVERURL 
    }

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
    return JSON.parse(tst);
}


export async function getPrayTimes() : Promise<PrayTimeData | null  > {
    try {
 
        let obj = await getJsonFromServer("/gettimes") as PrayTimeData  
        return obj;        
    } catch (error) {
        
    }

    return null;
}


export async function getSetting() : Promise<ConfigData | null> {
    try { 
        
        let obj = await getJsonFromServer("/getconfig") as ConfigData  
        return obj;        
    } catch (error) {
        
    }

    return null;
}

export async function saveSetting(configData : ConfigData) {
    
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
