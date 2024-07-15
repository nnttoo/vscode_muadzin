import * as PrayTimes from "./PrayTimes.js"
import {PrayTimeData, PrayTimeDate} from "./PrayTimeData"
 
 

export function timeSpan(date1: Date, date2: Date) : number {
    // Menghitung selisih waktu dalam milidetik
    let differenceInMilliseconds = date2.getTime() - date1.getTime(); 
    // Mengembalikan objek dengan hasil selisih waktu
    return differenceInMilliseconds;
}

function strClockToDate(clockstr: string) {
    let h = 0;
    let m = 0;

    let splited = clockstr.split(":");
    if (splited.length > 1) {
        h = Number(splited[0])
        m = Number(splited[1])
    }

    let d = new Date();
    d.setHours(h);
    d.setMinutes(m)
    return d;
}



class PrayTimeNumberData {
    public ptimeData!: PrayTimeData;
    private _listpraytimes : PrayTimeDate[] | null = null;

    public get listPrayTimeDate() : PrayTimeDate[]{
        if(this._listpraytimes == null){
            this._listpraytimes = [];

            for(let key of Object.keys( this.ptimeData)){   
                let str = (this.ptimeData as any)[key] as string;
                let dpray = strClockToDate(str);

                this._listpraytimes.push({
                    date : dpray,
                    name : key,
                })

            }
        }


        return this._listpraytimes;
    }

    constructor(p: PrayTimeData) {
        this.ptimeData = p;
    } 

    getNextPrayTime() {
        let listName = [
            "imsak",
            "fajr",
            "sunrise",
            "dhuhr",
            "asr",
            "sunset",
            "maghrib",
            "isha"]; 

        let prayDateSpan : {
            span : number,
            pdate : PrayTimeDate | null,
        } = {
            span : -1,
            pdate : null,
        }
        let now = new Date();
         

        for(let pdate of this.listPrayTimeDate){

            if(listName.indexOf(pdate.name) < 0){
                continue;
            }

           

            let tspan = timeSpan(pdate.date,now);
            if(prayDateSpan.span == -1 || 
                prayDateSpan.pdate == null || 
                prayDateSpan.span > tspan){

                prayDateSpan = {
                    span : tspan,
                    pdate : pdate,
                }
            }
             
        } 
 
        return prayDateSpan;

    }
}


class PrayTimeTs {
    getPrayTime(date: Date, lat: Number, lng: Number): PrayTimeNumberData {
        let p = PrayTimes.getTimes(date, lat, lng);
        return new PrayTimeNumberData(p);
    }


}


let prayTime = new PrayTimeTs();

export {
    prayTime
}   