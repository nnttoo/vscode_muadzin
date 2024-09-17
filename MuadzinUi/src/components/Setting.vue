<script setup lang="ts">
    import { onMounted, onUpdated, ref, toRaw } from "vue"
    import * as serverApi from "../server_API" 
    import  type {ConfigData, PrayTimeData, PrayTimeDate } from "../../../tslib/PrayTimeData" 
    import { PrayTimeCollection } from "../../../tslib/PrayTimeTs"
    import { Utils} from "../../../tslib/Utils" 


const configData = ref<ConfigData>({} as  ConfigData);
const msgLoading = ref<string>("");
const nextPrayTime = ref<string>("");



const getConfigData = async () => {
    let result = await serverApi.getSetting();
    if (result == null) return;
    configData.value = result;
}


onMounted(() => {  
    getConfigData(); 
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
    await Utils.sleep(500);
    let cdata = toRaw(configData.value);
    await serverApi.saveSetting(cdata); 
    msgLoading.value = "";

}


</script>
<template>
    <div  class="mainframe">
        <h3>Setting</h3>
        <div v-if="msgLoading != ''" class="loadingelem">{{ msgLoading }}</div>

        <div v-if="msgLoading == ''" class="setttingform">
            <div>Lattitude : </div>
            <input :value="configData?.lat" @input="configData.lat = getNumberFromVal($event)" />
            <div>Longitude : </div>
            <input :value="configData?.lng" @input="configData.lng = getNumberFromVal($event)" />

            <div>Alarm Lead Time (Minutes)</div>
            <input :value="configData?.alarmLeadTimeMinute" @input="configData.alarmLeadTimeMinute = getNumberFromVal($event)" />

            <div class="btncenter"> 
                <button :disabled="msgLoading != '' " 
                    @click="saveConfig()" >Save</button>
            </div>
        </div>

        

    </div>
</template>
<style scoped>
.mainframe{
    color: #fff;
    font-family: "Consolas, 'Courier New', monospace";
}
.mainframe h3{
    text-align: center;
}
.mainframe .loadingelem{
    text-align: center;
    margin-top: 20px;
}
.mainframe h1 {
    color: red
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
.setttingform .btncenter{
    text-align: center;
}

.setttingform .btncenter button{
    margin-top: 20px;
    text-align: center;
    padding: 5px;
    color: #fff;
    min-width: 150px;
    background-color: #000;
    border-radius: 10px;
}
</style>