<script setup lang="ts">
import { onMounted, onUpdated, ref, toRaw } from "vue"
import * as serverApi from "./server_API" 
import  type {ConfigData, PrayTimeData, PrayTimeDate } from "../tslib/PrayTimeData" 
import { PrayTimeCollection } from "../tslib/PrayTimeTs"
import { Utils} from "../tslib/Utils"


const data = ref<PrayTimeCollection>(null);
const configData = ref<ConfigData>({} as  ConfigData);
const msgLoading = ref<string>("");
const nextPrayTime = ref<string>("");

const getPrayTime = async () => {
        var praytime = await serverApi.getPrayTimes();
        if (praytime == null) return;
        delete praytime.midnight;
        delete praytime.sunset;
        
        let ptimeTools = new PrayTimeCollection(praytime); 
        data.value = ptimeTools;
    }

const getConfigData = async () => {
    let result = await serverApi.getSetting();
    if (result == null) return;
    configData.value = result;
}

const checkNextPrayTime = async ()=>{
    let ex = ()=>{
        nextPrayTime.value = "";
        if(data.value == null) return;

        let nextPtime = data.value.getNextPrayTime();
        if(nextPtime.span !=null && nextPtime.pdate != null){
            let pdate = nextPtime.pdate;
            let span = nextPtime.span;

            if(span.diffInMinutes < 60){
                nextPrayTime.value = pdate.name.toLocaleUpperCase()
                    + "  : "
                    + Utils.padStr(span.minutes + "",2) 
                    + ":"
                    + Utils.padStr(span.seconds + "",2);
            }
        } 
    }

    while(true){
       await Utils.sleep(1000);
       ex();
    }
}

onMounted(() => { 
    getPrayTime();
    getConfigData();
    checkNextPrayTime();
});


function getNumberFromVal(e: Event) {
    let txt = (e.target as HTMLInputElement).value;
    let n = 0;
    try {

        let nn = Number(txt);
        if (!Number.isNaN(nn)) {
            n = nn;
        }

    } catch (error) {

    }

    return n;
}

const saveConfig = async ()=>{
    msgLoading.value = "save to config";
    let cdata = toRaw(configData.value);
    await serverApi.saveSetting(cdata);
    getPrayTime();
    msgLoading.value = "";

}


</script>
<template>
    <div  class="mainframe">
        <div>{{ msgLoading }}</div>

        <div class="setttingform">
            <div>Lattitude : </div>
            <input :value="configData?.lat" @input="configData.lat = getNumberFromVal($event)" />
            <div>Longitude : </div>
            <input :value="configData?.lng" @input="configData.lng = getNumberFromVal($event)" />

            <div>Alarm Lead Time (Minutes)</div>
            <input :value="configData?.alarmLeadTimeMinute" @input="configData.alarmLeadTimeMinute = getNumberFromVal($event)" />

            <div> 
                <button :disabled="msgLoading != '' " 
                    @click="saveConfig()" >Save</button>
            </div>
        </div>

        <div v-if="nextPrayTime != ''" class="nextpraytime"> 
            <div>{{ nextPrayTime }}</div>
        </div>


        <h3>Prays Time</h3>

        <table  v-if="data != null">  
            <tr v-for="k in data.listPrayTimeSortByTime">
                <td>{{ k.name.toUpperCase() }}</td> 
                <td style="text-align: right;"> {{ k.datestring }} </td>
            </tr>
        </table>

    </div>
</template>
<style scoped>
.mainframe{
    color: #fff;
    font-family: "Consolas, 'Courier New', monospace";
}
.mainframe h1 {
    color: red
}
.mainframe .nextpraytime{
    padding: 10px;
    border: solid 1px #555;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
}
.mainframe input {
    box-sizing: border-box;
    width: 100%;
    padding: 5px;
}
.setttingform{
    color: #000;
    margin-bottom: 10px;
    background-color: rgb(241, 245, 244);
    padding: 10px;
}
.mainframe table{
    box-sizing: border-box;
    width: 100%;
}
.mainframe table th, td { 
    border: solid 1px #555;
    padding: 5px;
}
</style>