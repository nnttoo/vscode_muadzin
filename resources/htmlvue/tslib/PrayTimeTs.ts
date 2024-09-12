import * as PrayTimes from "./PrayTimes.js"
import { PrayTimeData, PrayTimeDate } from "./PrayTimeData"

type SpanTime = {
    differenceInMilliseconds: number,
    days: number,
    hours: number,
    minutes: number,
    seconds: number,

}

export function timeSpan(date1: Date, date2: Date): SpanTime {
    // Menghitung selisih waktu dalam milidetik
    let differenceInMilliseconds = date2.getTime() - date1.getTime();
    // Mengembalikan objek dengan hasil selisih waktu 

    // Menghitung selisih dalam berbagai unit waktu
    let seconds = Math.floor((differenceInMilliseconds / 1000) % 60);
    let minutes = Math.floor((differenceInMilliseconds / (1000 * 60)) % 60);
    let hours = Math.floor((differenceInMilliseconds / (1000 * 60 * 60)) % 24);
    let days = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    

    // Mengembalikan objek dengan hasil selisih waktu
    return {
        differenceInMilliseconds,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
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



class PrayTimeNumberData {
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
                })

            }
        }


        return this._listpraytimes;
    }

    constructor(p: PrayTimeData) {
         
        //this.ptimeData = p;
    
        // pakai dumy data dulu buat ngetest
        this.ptimeData = { 
            asr :     '15:19',
            dhuhr :   '12:09',
            fajr :    '10:12',
            imsak :   '04:46',
            isha :    '00:44',
            maghrib :   '18:12',
            midnight :   '00:09',
            sunrise :   '06:06',
            sunset :  '18:12'
        }

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



            let tspan = timeSpan( now,pdate.date);
            if (savedPrayDateSpan.span == null ||
                savedPrayDateSpan.pdate == null ||
                savedPrayDateSpan.span.differenceInMilliseconds > tspan.differenceInMilliseconds) {

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
    getPrayTime(date: Date, lat: Number, lng: Number): PrayTimeNumberData {
        let p = PrayTimes.getTimes(date, lat, lng);
        return new PrayTimeNumberData(p);
    }


}


let prayTime = new PrayTimeTs();

export {
    prayTime
}   