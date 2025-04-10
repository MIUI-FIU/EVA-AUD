// This module does STT -> QA (LLM) -> TTS.
import SpeechManager from "../VISOS/action/verbalizers/SpeechManager";
import TextToGptReconciler from "../VISOS/cognition/TextToGptReconciler";

// This doesn't work requires CLI access which is not available on github pages.
// import ollama from 'ollama'

let recognitionAvailable = false;
let recognition;
let lastTranscript = '';

let gptManager;

let speechManager;

let processingRequest = false;
let recognitionStop = false;

let numTransactions;

function setFace(au_data){
    // Extrapolated from AnimationManager.js
    au_data.forEach(({ id, intensity, duration, explanation = "" }) => {
        animationManager.scheduleChange(id, intensity * 90, duration, 0, explanation);
    });
}

function slightSmileFace(){
    let au_data = [
        {
          "id": "6",
          "intensity": 0.4,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "12",
          "intensity": 0.5,
          "duration": 750,
          "explanation": ""
        }
      ]

    setFace(au_data=au_data)
}

function wink(){
    let au_data = [
        {
            "id": "46L",
            "intensity": 0.9,
            "duration": 300,
            "explanation": ""
        }
    ]

    setFace(au_data=au_data)
}

function neutralFace(){
    animationManager.setFaceToNeutral()
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function agentSpeak(text) {
    speechManager.initSynthesizer();
    let synthesize_result = await speechManager.synthesizeSpeech(text);

    console.log('synthesize_result object:', synthesize_result);
    console.log('synthesize result transcript:', text)
    console.log('synthesize result audioDuration:', synthesize_result.audioDuration);

    console.log('before delay!');

    try {
        await delay(synthesize_result.audioDuration / 10000);
        console.log('after delay!');
    } catch (error) {
        if (error.message === 'Delay aborted') {
            console.log('Delay was aborted');
        } else {
            console.error('Error during delay:', error);
        }
    }
}

async function processSpeech(transcript, gptManager){
    let gptResponse = ''

    try{
        gptResponse = await gptManager.processText(transcript)
        
        // gptResponse = transcript

        console.log('gptResponse: ', gptResponse)
    }
    catch (e){
        console.error('Error processing GPT response:', e)
    }
    try{
        if(gptResponse){
            await agentSpeak(gptResponse)
            numTransactions += 1
        }

        return gptResponse
    }
    catch (e) {
        console.error('Error processing TTS response:', e)
    }
}

async function start(animationManager, settings) {
    console.log('Calling start!')

    console.log('openai key object:', settings.openai_api_key)
    console.log('azure key object:', settings.azure_api_key)

    console.log('openai key object type:', typeof settings.openai_api_key)
    console.log('azure key object type:', typeof settings.azure_api_key)

    console.log('openai key default:', settings.openai_api_key.default)
    console.log('azure key default:', settings.azure_api_key.default)

    numTransactions = 1

    // Initialize SpeechManager object
    if (settings.azure_api_key && typeof settings.azure_api_key == 'string'){
        speechManager = new SpeechManager(animationManager, settings.azure_api_key, 'eastus')
    }
    else{
        speechManager = new SpeechManager(animationManager, settings.azure_api_key.default, 'eastus')
    }

    slightSmileFace()

    await agentSpeak(`Hello, my name is eva. I am powered by ChatGPT. I am programmed to provide a response to ${settings.num_prompts} questions. Feel free to ask away!`)

    neutralFace()

    console.log('recognitionStop:', recognitionStop)

    if ('webkitSpeechRecognition' in window) {
        console.log('SpeechRecognition available!')
        processingRequest = false

        let transactions = {}


        if(!recognitionStop){
            recognitionAvailable = true
            recognitionStop = false;
        
            // Initialize SpeechRecognition object
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();

            // Initialize TextToGptReconciler object
            if (settings.openai_api_key && typeof settings.openai_api_key == 'string'){
                gptManager = new TextToGptReconciler(settings.openai_api_key)
            }
            else{
                gptManager = new TextToGptReconciler(settings.openai_api_key.default)
            }

            recognition.continuous = true;
            recognition.lang = 'en-US'
            recognition.interimResults = true
            recognition.maxAlternatives = 1
        
            recognition.onresult = async function(event) {
                let transcript = '';
                let isFinal = false;

                let current_transaction = {}
        
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        isFinal = true;
                    }
                }

                console.log('processingRequest:', processingRequest)
        
                // Process only final results to avoid duplicates
                if (isFinal && transcript !== lastTranscript && !processingRequest) {
                    lastTranscript = transcript;
                    processingRequest = true;

                    // Process transcript
                    let processTranscript = transcript.toLowerCase().trim();

                    console.log('Recognized Speech:', processTranscript)

                    // const response = await ollama.chat({
                    //     model: 'phi3',
                    //     messages: [{role: 'user', content: transcript}]
                    // })

                    // console.log("llama response:", response)

                    if (processTranscript){

                        console.log('openai key:', settings.openai_api_key)
                        console.log('azure key:', settings.azure_api_key)

                        current_transaction["user_prompt"] = processTranscript

                        let agentResponse = ''
                        agentResponse = await processSpeech(processTranscript, gptManager)

                        current_transaction['agent_response'] = agentResponse

                        // console.log('returned speechResponse:', speechResponse)

                        console.log('finished request!')
                        console.log('numTransactions:', numTransactions)
                        console.log('settings.num_prompts:', settings.num_prompts)

                        transactions[numTransactions-1] = current_transaction

                        processingRequest = false

                        console.log('processingRequest:', processingRequest)
                        
                        if (numTransactions > settings.num_prompts){
                            processingRequest = true;
                            await agentSpeak(`It appears I've answered my ${settings.num_prompts} questions.`)
                            await agentSpeak("If you'd like to review this conversation, a transcript is available in the inspector.")
                            await agentSpeak('Talk to you later!')

                            slightSmileFace()
                            wink()
                            await delay(1000)
                            neutralFace()

                            let json_string = JSON.stringify(transactions, null, 2)

                            console.log(`Transaction History:\n${json_string}`)

                            recognitionStop = true
                            recognition.stop()
                        }
                    }
                }
            };
            recognition.onend = function() {
                if (!recognitionStop){
                    console.log('Speech recognition restarting...');
                    if (recognitionAvailable) {
                        recognition.start();  // Restart recognition
                        console.log('Speech recognition restarted!');
                    }
                }
            };
        }
    }
    else {
        console.error('SpeechRecognition not available in this browser!')
    }

    if (recognitionAvailable == true) {
        recognition.start()
        console.log("speech recognition started!")
    }
}

function stop() {
    console.log('Calling stop!')
    
    recognitionStop = true
    console.log('recognitionStop:', recognitionStop)

    // Interrupt Speech (TBD)
    // speechManager.player.pause()
    // speechManager.audioInterrupt = true
    // setWaitCondition(speechManager.audioInterrupt)
    
    if (recognitionAvailable){
        recognition.stop()    
        console.log("speech recognition stopped!")
    }

    console.log('Reached end stop!')
}

export { start, stop }