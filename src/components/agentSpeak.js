export async function fetchVoices(){
    const voicesUrl = "https://new-emotion.cis.fiu.edu/HapGL/HapGLService.svc/getVoices";

    try {
        const response = await fetch(voicesUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // console.log("Speech Info:", data);
        return data
    } catch (error) {
        console.error("Error fetching TTS:", error);
    }

}

export async function fetchTTS(text){
    const speakUrl = "https://new-emotion.cis.fiu.edu/HapGL/HapGLService.svc/speak";
    const params = new URLSearchParams({ text: text, voice: "RS Julie" });

    try {
        const response = await fetch(`${speakUrl}?${params}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // console.log("Speech Info:", data);
        return data
    } catch (error) {
        console.error("Error fetching TTS:", error);
    }
}

// export async function playAudioFromBase64(audioDataBase64) {
//     try {
//         const audioDataBuffer = Uint8Array.from(atob(audioDataBase64), char => char.charCodeAt(0)).buffer;

//         // Step 4: Use the Web Audio API to play the audio
//         const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//         const audioBuffer = await audioContext.decodeAudioData(audioDataBuffer);

//         const source = audioContext.createBufferSource();
//         source.buffer = audioBuffer;
//         source.connect(audioContext.destination);
//         source.start();

//         console.log("Audio playback started.");

//     } catch (error) {
//         console.error("Error while processing or playing audio:", error);
//     }
// }

export async function playAudioFromBase64(audioDataBase64) {
    return new Promise(async (resolve, reject) => {
        try {
            const audioDataBuffer = Uint8Array.from(atob(audioDataBase64), char => char.charCodeAt(0)).buffer;

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const audioBuffer = await audioContext.decodeAudioData(audioDataBuffer);

            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);

            source.onended = () => {
                console.log("Audio playback finished.");
                resolve();
            };

            source.start();
            console.log("Audio playback started.");
        } catch (error) {
            console.error("Error while processing or playing audio:", error);
            reject(error);
        }
    });
}

export function scheduleVisemeApplication(animationManager, visemeId, audioOffset) {
    // const offsetInMilliseconds = audioOffset / 10000;
    
    const offsetInMilliseconds = audioOffset * 1.38
    setTimeout(() => {
        console.log('[visemeId, offsetInMilliseconds]:', [visemeId, offsetInMilliseconds])
        applyVisemeToCharacter(animationManager, visemeId);
    }, offsetInMilliseconds);
}

function applyVisemeToCharacter(animationManager, visemeId) {
    const facsLib = animationManager.facsLib;
    // console.log('audioInterrupt:', this.audioInterrupt)

    // console.log('viseme_id:', visemeId)
    if (visemeId === 0) {
        facsLib.setNeutralViseme(0.0);
    } else {
        visemeId -= 1;
        facsLib.setTargetViseme(visemeId, 70, 0);
    }

    facsLib.updateEngine();
}

export async function agentSpeak(speakText) {
    const voices = await fetchVoices();
    console.log('Fetched voices:', voices);

    const ttsData = await fetchTTS(speakText)
    console.log('Fetched TTS data:', ttsData)

    const data = JSON.parse(ttsData)

    const audioDataBase64 = data["audioStream"]
    // playAudioFromBase64(audioDataBase64)

    const visemeData = data['visemes']

    const visemeList = visemeData.map(v => v.number);

    const visemeOffsets = visemeData.map(v => v.audioPosition)

    for (let i = 0; i < visemeData.length; i++) {
        scheduleVisemeApplication(animationManager, visemeList[i], visemeOffsets[i])
    }

    await playAudioFromBase64(audioDataBase64)
}
