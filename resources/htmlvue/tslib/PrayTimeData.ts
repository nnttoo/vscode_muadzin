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
    lat: number,
    lng: number,
    alarmLeadTimeMinute : number,
}