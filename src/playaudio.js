const { exec } = require('child_process');
const execPromise = require('util').promisify(exec);


//WINDOWS
const addPresentationCore = `Add-Type -AssemblyName presentationCore;`
const createMediaPlayer = `$player = New-Object system.windows.media.mediaplayer;`
const stopPowerShell = `taskkill /F /IM powershell.exe`;
const loadAudioFile = path => `$player.open('${path}');`
const playAudio = `$player.Play();`
const stopAudio = `Start-Sleep 1; Start-Sleep -s $player.NaturalDuration.TimeSpan.TotalSeconds;Exit;`
const loopAudio = `while ($true) { Start-Sleep -Milliseconds 100; if ($player.Position -ge $player.NaturalDuration.TimeSpan) { $player.Position = [TimeSpan]::Zero; $player.Play(); }};`

const windowPlayCommand = (path, volume, loop) => `powershell -c ${addPresentationCore} ${createMediaPlayer} ${loadAudioFile(path)} $player.Volume = ${volume}; ${playAudio} ${loop ? loopAudio : stopAudio}`;
const windowStopCommand = () => `${stopPowerShell}`;


//MAC
const macPlayCommand = (path, volume, loop) => `afplay -v ${volume} ${loop ? '-r' : ''} \"${path}\"`;
const macStopCommand = () => `pkill afplay`;

function sleep(time){
    return new Promise((r,x)=>{
        setTimeout(()=>{
            r();
        },time);
    })
}


export class Mp3Player {
    static async play(path, volume = 0.5, loop = false) {
        const volumeAdjustedByOS = process.platform === 'darwin' ? Math.min(2, volume * 2) : volume;

        const playCommand =
            process.platform === 'darwin'
                ? macPlayCommand(path, volumeAdjustedByOS, loop)
                : windowPlayCommand(path, volumeAdjustedByOS, loop);

        try {
            exec(playCommand);
        } catch (err) {
            throw err;
        }
    }

    static async stop() {
        const stopCommand = process.platform === 'darwin' ? macStopCommand() : windowStopCommand();
        try {
            exec(stopCommand);
        } catch (err) {
            throw err;
        }
    }

    static timetostop = 0;
    static async playAutoStop(path){
        this.play(path);
        this.timetostop = Date.now() + 3000;

        while(Date.now() < this.timetostop){
            await sleep(1000); 
        } 
        this.stop();
    }

    static playAutoStopPump(){
        this.timetostop = Date.now() + 2000;
    }
};