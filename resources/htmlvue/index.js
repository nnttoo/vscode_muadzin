
/** @type {string} **/
var dserver = window.myserveradd ;
if(dserver.endsWith("/")){
    dserver = dserver.substring(0,dserver.length - 1);

    
}

const options = {
    moduleCache: { vue: Vue },
    /** @param {string} fname **/
    getFile: async (fname) => {


        if(
            !fname.endsWith(".js") &&
            !fname.endsWith(".vue") &&
            !fname.endsWith(".ts") 

            
        ) {
            fname = fname + ".ts";
        }
      
 
        console.log("ini  " + fname);
        var f = await fetch(dserver + fname);
        var txt = await f.text();
        return txt;

    }, 
    
    addStyle(textContent) {

        const style = Object.assign(document.createElement('style'), { textContent });
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
    },
}
Vue.createApp(Vue.defineAsyncComponent(
    () => window['vue3-sfc-loader'].loadModule('/static/vue_component/mainapp.vue', options))

    
).mount( document.getElementById("myapp"));