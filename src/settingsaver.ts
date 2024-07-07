import * as vscode from 'vscode';

export type ConfigData = {
    lat : number,
    lng : number,
}

export class SettingSaver{
    context : vscode.ExtensionContext | null = null;

    public constructor(context: vscode.ExtensionContext){
        this.context = context;
        
    }

    getNumber(key : string){
        let vl = this.context?.globalState.get("muadzin.config." + key);
        if(vl != null){

            let n = Number(vl);
            if(Number.isNaN(n)){
                n = 0;
            }

            return n;
        }

        return 0;
    }

    saveSetting(cdata : ConfigData){
        this.context?.globalState.update("muadzin.config.lat",cdata.lat);
        this.context?.globalState.update("muadzin.config.lng",cdata.lng);
    }


    getSetting() : ConfigData{

        let cdata = {} as ConfigData;

        cdata.lat = this.getNumber("lat");
        cdata.lng = this.getNumber("lng");

        return cdata;

    }
     
}