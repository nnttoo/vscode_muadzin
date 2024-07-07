<script setup lang="ts">
import { onMounted, onUpdated, ref, toRaw } from "vue"
import * as serverApi from "./server_API.ts"
import Second from "./second.vue"

const data = ref<serverApi.PrayTimeData>({} as serverApi.PrayTimeData);
const configData = ref<serverApi.ConfigData>({} as serverApi.ConfigData);

onUpdated(()=>{
    console.log(toRaw(configData.value));
})


onMounted(() => {
    const getPrayTime = async () => {
        var praytime = await serverApi.getPrayTimes();
        if (praytime == null) return;
        data.value = praytime;
    }

    const getConfigData = async () => {
        let result = await serverApi.getSetting();
        if(result == null) return; 
        configData.value = result;
    }

    getPrayTime();
    getConfigData();

});

function getNumberFromVal(e : Event){
    let txt = (e.target as HTMLInputElement).value;
    let n = 0;
    try {
        
        let nn = Number(txt);
        if(!Number.isNaN(nn)){
            n = nn;
        }

    } catch (error) {
        
    }

    return n;
}


</script>
<template>
    <div class="mainframe">

        <div>Lattitude : </div>
        <input  :value="configData?.lat" @input="configData.lat = getNumberFromVal($event)"/>
        <div>Longitude : </div>
        <input  :value="configData?.lng"/>
        <h1>Adzan Time</h1>

        <table>
            <tr v-for="k of Object.keys(data)">
                <td>{{ k.toUpperCase() }}</td>
                <td style="min-width: 10px;"> : </td>
                <td> {{ data[k] }} </td>
            </tr>
        </table>

    </div>
</template>
<style scoped>
.mainframe h1 {
    color: red
}
</style>