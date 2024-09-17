import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')

console.log("import.meta.env.PROD : " + import.meta.env.PROD);
console.log(import.meta.env.VITE_SERVERURL);
if(import.meta.env.VITE_SERVERURL){
    console.log("ini dev : " + import.meta.env.VITE_SERVERURL);
} else {
    console.log("production")
}
