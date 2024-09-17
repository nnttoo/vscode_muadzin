import * as vscode from 'vscode';

import {ConfigData} from "../tslib/PrayTimeData"


export class SettingSaver {
    context: vscode.ExtensionContext | null = null;
 

    getNumber(key: string) {
        let vl = this.context?.globalState.get("muadzin.config." + key);
        if (vl != null) {

            let n = Number(vl);
            if (Number.isNaN(n)) {
                n = 0;
            }

            return n;
        }

        return 0;
    }

    saveSetting(cdata: ConfigData) {

        let jsonStr = JSON.stringify(cdata);
        this.context?.globalState.update("muadzin.config.jsonstr", jsonStr);
        this._currentConfigData = null;
    }

    private _currentConfigData : ConfigData | null = null;


    getSetting(): ConfigData {

        if(this._currentConfigData == null){
            let cdata = {} as ConfigData;
            try {
                let text = this.context?.globalState.get("muadzin.config.jsonstr") as string;
                let confobj = JSON.parse(text) as ConfigData;
                if (confobj != null) {
                    cdata = confobj;
                }
            } catch (error) {
    
            }

            this._currentConfigData = cdata;
        }

        if(this._currentConfigData.alarmLeadTimeMinute == null){
            this._currentConfigData.alarmLeadTimeMinute = 5;
        }
       

        return this._currentConfigData;

    }

}