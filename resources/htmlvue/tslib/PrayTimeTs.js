"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prayTime = void 0;
exports.timeSpan = timeSpan;
const PrayTimes = __importStar(require("./PrayTimes.js"));
function timeSpan(date1, date2) {
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
function strClockToDate(clockstr) {
    let h = 0;
    let m = 0;
    let splited = clockstr.split(":");
    if (splited.length > 1) {
        h = Number(splited[0]);
        m = Number(splited[1]);
    }
    let d = new Date();
    d.setHours(h);
    d.setMinutes(m);
    return d;
}
class PrayTimeNumberData {
    ptimeData;
    constructor(p) {
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
    getNextPrayTime() {
        let listName = [
            "imsak",
            "fajr",
            "sunrise",
            "dhuhr",
            "asr",
            "sunset",
            "maghrib",
            "isha"
        ];
        let result = null;
        for (let key of listName) {
        }
    }
}
class PrayTimeTs {
    getPrayTime(date, lat, lng) {
        let p = PrayTimes.getTimes(date, lat, lng);
        return new PrayTimeNumberData(p);
    }
}
let prayTime = new PrayTimeTs();
exports.prayTime = prayTime;
