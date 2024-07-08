import * as PrayTimes from "./PrayTimes.js" 

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

export function timeSpan(date1 : Date, date2 : Date) {
    // Menghitung selisih waktu dalam milidetik
    let differenceInMilliseconds = date2.getTime() - date1.getTime();

    // Menghitung selisih dalam berbagai unit waktu
    let seconds = Math.floor((differenceInMilliseconds / 1000) % 60);
    let minutes = Math.floor((differenceInMilliseconds / (1000 * 60)) % 60);
    let hours = Math.floor((differenceInMilliseconds / (1000 * 60 * 60)) % 24);
    let days = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    // Mengembalikan objek dengan hasil selisih waktu
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
}

function  strClockToDate(clockstr: string) {
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

    constructor(p: PrayTimeData) {
        this.ptimeData = p;
    }

   
    get imsakDate() {
        return strClockToDate(this.ptimeData.imsak);
    }
    get fajrDate() {

        return strClockToDate(this.ptimeData.fajr);
    }
    get sunriseDate() {

        return strClockToDate(this.ptimeData.sunrise);
    }
    get dhuhrDate() {

        return strClockToDate(this.ptimeData.dhuhr);
    }
    get asrDate() {

        return strClockToDate(this.ptimeData.asr);
    }
    get sunsetDate() {

        return strClockToDate(this.ptimeData.sunset);
    }
    get maghribDate() {

        return strClockToDate(this.ptimeData.maghrib);
    }
    get ishaDate() {

        return strClockToDate(this.ptimeData.isha);
    }
    get midnightDate() {

        return strClockToDate(this.ptimeData.midnight);
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