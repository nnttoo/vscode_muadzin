<script setup lang="ts">
import { computed, ref } from "vue";
import Setting from "./components/Setting.vue"
import Home from "./components/Home.vue"

const pageTypeStr = ref("")
const pageTypeStrNext = ref("");
const pageFun = computed(() => {
  if (pageTypeStr.value == "Setting") {
    pageTypeStrNext.value = "Home";
    return Setting;
  }
  pageTypeStrNext.value = "Setting"
  return Home;
});

const clickChangePage = () => {
  pageTypeStr.value = pageTypeStrNext.value;
}
</script>

<template>
  <component :is="pageFun"></component>
  <div class="btnframe">
    <button class="pagebutton" v-on:click="clickChangePage()">
      {{ pageTypeStrNext }}
    </button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.btnframe{
  text-align: center;
  position: absolute;
  bottom: 10px;
  left: 0px;
  right: 0px;
}
.btnframe .pagebutton {
  text-align: center;
  padding: 5px;
  min-width: 200px;
}
</style>
