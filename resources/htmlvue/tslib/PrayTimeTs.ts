import * as PrayTimes from "./PrayTimes.js"
import type { PrayTimeData, PrayTimeDate } from "./PrayTimeData.ts"
import {SpanTime} from "./SpanTime"

 
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
    d.setMinutes(m);
    d.setSeconds(0);
    d.setMilliseconds(0);

    var d2 = new Date();

    var selisih = d.getTime() - d2.getTime();
    if(selisih < 0){
        // jika waktunya sudah lewat maka tambah satu hari
        d.setDate(d.getDate() + 1);
    }


    return d;
}



export class PrayTimeCollection {
    public ptimeData!: PrayTimeData;
    private _listpraytimes: PrayTimeDate[] | null = null;

    public get listPrayTimeDate(): PrayTimeDate[] {
        if (this._listpraytimes == null) {
            this._listpraytimes = [];

            for (let key of Object.keys(this.ptimeData)) {
                let str = (this.ptimeData as any)[key] as string;
                let dpray = strClockToDate(str);

                this._listpraytimes.push({
                    date: dpray,
                    name: key,
                    datestring : str,
                })

            }
        }


        return this._listpraytimes;
    } 

    public get listPrayTimeSortByTime() : PrayTimeDate[]{
        let listPrayTime = this.listPrayTimeDate;

        let dateNow = new Date();
        let sort = listPrayTime.sort((a,b)=>{
            let spanA = SpanTime.countTimeSpan(a.date,dateNow);
            let spanB = SpanTime.countTimeSpan(b.date,dateNow);

            if(spanA.diffInMilliseconds > spanB.diffInMilliseconds) return -1;
            if(spanA.diffInMilliseconds < spanB.diffInMilliseconds) return  1;

            return 0; 
        });

        return sort;
    }

   

    constructor(p: PrayTimeData) {
         
        this.ptimeData = p;
    
        // pakai dumy data dulu buat ngetest
        // this.ptimeData = { 
        //     asr :     '16:08',
        //     dhuhr :   '14:22',
        //     fajr :    '10:12',
        //     imsak :   '04:46',
        //     isha :    '00:44',
        //     maghrib :   '18:12',
        //     midnight :   '00:09',
        //     sunrise :   '06:06',
        //     sunset :  '18:12'
        // }

    }

    getNextPrayTime() {
        let listName = [
            "imsak",
            "fajr",
            "sunrise",
            "dhuhr",
            "asr", 
            "maghrib",
            "isha"];

        // untuk menyimpan praytime span
        let savedPrayDateSpan: {
            span: SpanTime | null,
            pdate: PrayTimeDate | null,
        } = {
            span: null,
            pdate: null,
        }
        let now = new Date();


        for (let pdate of this.listPrayTimeDate) {

            if (listName.indexOf(pdate.name) < 0) {
                continue;
            }



            let tspan = SpanTime.countTimeSpan( now,pdate.date);
            if (savedPrayDateSpan.span == null ||
                savedPrayDateSpan.pdate == null ||
                savedPrayDateSpan.span.diffInMilliseconds > tspan.diffInMilliseconds) {

                savedPrayDateSpan = {
                    span: tspan,
                    pdate: pdate,
                }
            }

        }

        return savedPrayDateSpan;

    }
}


class PrayTimeTs {
    getPrayTime(date: Date, lat: Number, lng: Number): PrayTimeCollection {
        let p = PrayTimes.getTimes(date, lat, lng);
        return new PrayTimeCollection(p);
    }


}


let prayTime = new PrayTimeTs();

export {
    prayTime
}   