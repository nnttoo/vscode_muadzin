<script setup lang="ts">
import { onMounted, ref} from "vue"
import {PrayTimeData, getPrayTimes} from "./getfromserver.ts"
import Second from "./second.vue" 


const data  = ref<PrayTimeData>({} as PrayTimeData) 


onMounted(async ()=>{
    var praytime = await getPrayTimes();  
    if(praytime == null) return; 
    data.value = praytime; 
});


</script>
<template>
    <div class="mainframe">
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

    .mainframe h1{
        color : red
    }
</style>