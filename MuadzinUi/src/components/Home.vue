<script setup lang="ts">
import { onMounted, onUnmounted, ref, toRaw } from 'vue';
import { ConfigData } from '../../../tslib/PrayTimeData';
import * as serverApi from "../server_API"
import { PrayTimeCollection } from '../../../tslib/PrayTimeTs';
import { Utils } from '../../../tslib/Utils';


const data = ref<PrayTimeCollection | null>(null);
const nextPrayTime = ref<string>("");
const msgLoading = ref<string>("");
const getPrayTime = async () => {
    var praytime = await serverApi.getPrayTimes();
    if (praytime == null) return;

    let delobj = praytime as any;

    delete delobj.midnight;
    delete delobj.sunset;

    let ptimeTools = new PrayTimeCollection(praytime);
    data.value = ptimeTools;
}

const pageIsLive = ref(true);

const checkNextPrayTime = async () => {
    let ex = () => {
        console.log("run ex");
        if (data.value == null) {
            nextPrayTime.value = "";
            return;
        }

        let nextPtime = data.value.getNextPrayTime();
        if (nextPtime.span != null && nextPtime.pdate != null) {
            let pdate = nextPtime.pdate;
            let span = nextPtime.span;

            if (span.diffInMinutes < 60) {
                nextPrayTime.value = pdate.name.toLocaleUpperCase()
                    + "  : "
                    + Utils.padStr(span.minutes + "", 2)
                    + ":"
                    + Utils.padStr(span.seconds + "", 2);
            }

            return;
        }

        nextPrayTime.value = "";
    }

    while (pageIsLive.value) {
        await Utils.sleep(1000);
        ex();
    }
}

onMounted(() => {
    getPrayTime();
    checkNextPrayTime();
});

onUnmounted(()=>{
    pageIsLive.value = false;
})

</script>

<template>
    <div class="homeframe">
        <div v-if="nextPrayTime != ''" class="nextpraytime">
            <div>{{ nextPrayTime }}</div>
        </div>


        <h3>Prays Time</h3>

        <table v-if="data != null">
            <tr v-for="k in data.listPrayTimeSortByTime">
                <td>{{ k.name.toUpperCase() }}</td>
                <td style="text-align: right;"> {{ k.datestring }} </td>
            </tr>
        </table>
    </div>
</template>
<style scoped>
.homeframe table {
    box-sizing: border-box;
    width: 100%;
}

.homeframe .nextpraytime{
    padding: 10px;
    border: solid 1px #555;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
}
.homeframe table th,
td {
    border: solid 1px #555;
    padding: 5px;
}
</style>