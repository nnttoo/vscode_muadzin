
/** @type {string} **/
var dserver = window.myserveradd;
if (dserver.endsWith("/")) {
    dserver = dserver.substring(0, dserver.length - 1);


} 

const { loadModule } = window['vue3-sfc-loader'];  
const options = {
    moduleCache: { vue: Vue },
    /** @param {string} fname **/
    getFile: async (fname) => {  

        console.log("get file : " + fname);

        const regex = /\.\w{2,}$/;
        let withExtension = regex.test(fname);

        if (!withExtension) {
            /**
             * Langsung return aja, karena file tanpa extension
             * akan direwrite pada handleModule
             */
            console.log("tanpa extensi : " + fname);
            return ""; 

        }   

        if(fname.endsWith(".js")){
            /**
             * File js diignore aja karena dia akan direwrite menjadi .mjs 
             * agar bisa dihandle secara .mjs
             */
            return "";
        }

        if(fname.endsWith("fake.mjs")){
            let panjangDipotong = fname.length - ("fake.mjs".length); 
            fname = fname.substring(0, panjangDipotong); 
        }  


        var f = await fetch(dserver + fname);
        var txt = await f.text();  
        return txt;

    },

    addStyle(textContent) {

        const style = Object.assign(document.createElement('style'), { textContent });
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
    },

    async handleModule(type, getContentData, path, o) { 
        if(type == ""){ 
            return loadModule(path + ".ts",options);
        }

        if(type == ".js"){
            return  loadModule( path + "fake.mjs",options);
        } 
        return undefined;
      },
}
Vue.createApp(Vue.defineAsyncComponent(
    () => loadModule('/static/vue_component/mainapp.vue', options))


).mount(document.getElementById("myapp"));