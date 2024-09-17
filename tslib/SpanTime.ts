export class  SpanTime  {
    /**
     * selisih waktu dalam satuan Milliseconds
     */ 
    public diffInMilliseconds :number = 0; 

    constructor(milliseconds : number ){
        this.diffInMilliseconds = milliseconds;
    }

    /**
     * Selisih waktu dalam satuan detik
     */
    public get diffInSeconds() {
        return this.diffInMilliseconds / 1000; 
    }

    public get diffInMinutes(){
        return this.diffInSeconds / 60;
    }

    public get diffInHours(){
        return this.diffInMinutes / 60;
    }

    public get diffInDays(){
        return this.diffInHours / 24;
    }

    /**
     * selisih waktu dalam satuan detik tapi maksimum nilainya adalah 60
     * ini bisa dikombinasikan dengan minutes dan hours
     * jadi misalkan diffInSeconds bernilai 90 detik, 
     * maka itu selisih waktu adalah 1 menit, 30 detik 
     * atau  second = 30
     *       minuts = 1
     */
    get seconds(){
        return Math.floor(this.diffInSeconds ) % 60;
    } 

    get minutes(){
        return Math.floor(this.diffInMinutes ) % 60;
    }

    get hours(){
        return Math.floor(this.diffInHours ) % 24;
    }
 
 
    public static countTimeSpan(date1 : Date, date2 : Date){
        let differenceInMilliseconds = date2.getTime() - date1.getTime();  
        // Mengembalikan objek dengan hasil selisih waktu
        return  new SpanTime(differenceInMilliseconds);
    }

}