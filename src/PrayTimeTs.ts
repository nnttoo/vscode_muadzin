import * as PrayTimes from "./PrayTimes.js"

  type PrayTimeData = {
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

class PrayTimeTs{
    getPrayTime(date : Date, lat : Number, lng : Number) : PrayTimeData{
        return PrayTimes.getTimes(date,lat,lng);
    }
}


let prayTime = new PrayTimeTs();

export  {
    prayTime
}   