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

export type PrayTimeDate = {
    name : string,
    date : Date,
    datestring : string,
}

export type ConfigData = {
    /**
     * latitude
     */
    lat: number,
    /**
     * longitude
     */
    lng: number,

    /**
     * alarmLeadTimeMinute
     * adalah waktu untuk mengurani waktu sholat. 
     * Misalkan kita ingin membunyikan alamarm 10 menit sebelum waktu sholat
     * tiba, maka kita bisa menggunakan alarmLeadTimeMinute 10 menit 
     * 
     */
    alarmLeadTimeMinute : number,
}

