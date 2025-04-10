import SpeechManager from "../VISOS/action/verbalizers/SpeechManager";
import TextToGptReconciler from "../VISOS/cognition/TextToGptReconciler";

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

function captureUserResponse() {
    return new Promise((resolve) => {
        if ('webkitSpeechRecognition' in window) {
            console.log('SpeechRecognition available!');
            processingRequest = false;

            console.log('recognitionStop:', recognitionStop)

            if (!recognitionStop) {
                recognitionAvailable = true;
                recognitionStop = false;

                // Initialize SpeechRecognition object
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognition = new SpeechRecognition();

                recognition.continuous = false;
                recognition.lang = 'en-US';
                recognition.interimResults = true;
                recognition.maxAlternatives = 1;

                let silenceTimer;

                recognition.onresult = async function(event) {
                    let transcript = '';
                    let isFinal = false;

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            isFinal = true;
                        }
                    }

                    console.log('processingRequest:', processingRequest);

                    // Process only final results to avoid duplicates
                    if (isFinal && transcript !== lastTranscript && !processingRequest) {
                        lastTranscript = transcript;
                        processingRequest = true;

                        // Process transcript
                        let processTranscript = transcript.toLowerCase().trim();
                        console.log('Recognized Speech:', processTranscript);

                        // Stop the timer and recognition when a final result is detected
                        clearTimeout(silenceTimer);
                        recognition.stop();

                        // Call a function to handle the processed response
                        processingRequest = false;
                        resolve(transcript); // Resolve the promise to indicate processing is complete
                    } else {
                        // Reset silence timer if interim results are detected
                        clearTimeout(silenceTimer);
                        silenceTimer = setTimeout(() => {
                            console.log('No speech detected, stopping recognition.');
                            recognition.stop(); // Stop recognition after a period of silence
                            resolve(transcript); // Resolve the promise to continue
                        }, 2000); // Adjust the timeout duration as needed
                    }
                };

                recognition.onend = () => {
                    console.log('Speech recognition ended.');
                    resolve(lastTranscript); // Resolve the promise when recognition ends
                };

                recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    clearTimeout(silenceTimer);
                    resolve(lastTranscript); // Resolve even on error
                };
            }
        } else {
            console.error('SpeechRecognition not available in this browser!');
            resolve(); // Resolve if not available
        }

        if (recognitionAvailable) {
            recognition.start();
            console.log("Speech recognition started!");
        }
    });
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
        return text
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

async function start(animationManager, settings){
    recognitionStop = false;

    // Initialize SpeechManager object
    if (settings.azure_api_key && typeof settings.azure_api_key == 'string'){
        speechManager = new SpeechManager(animationManager, settings.azure_api_key, 'eastus')
    }
    else{
        speechManager = new SpeechManager(animationManager, settings.azure_api_key.default, 'eastus')
    }

    // Initialize TextToGptReconciler object
    if (settings.openai_api_key && typeof settings.openai_api_key == 'string'){
        gptManager = new TextToGptReconciler(settings.openai_api_key)
    }
    else{
        gptManager = new TextToGptReconciler(settings.openai_api_key.default)
    }

    let questions = {
        "1": "Do you like attending FIU?",
        "2": "Where are you originally from?",
        "3": "Do you like living in South Florida?",
        "4": "Where would you like to go for you next vacation?",
        "5": "Do you enjoy speaking with me?",
        "6": "Would you speak with me again?"
    }

    console.log(`questions: ${questions}`)

    let num_questions = Object.keys(questions).length

    slightSmileFace()

    await agentSpeak(`Hello, my name is eva. I will ask you ${num_questions} questions. Feel free to answer as you feel appropriate!`)

    neutralFace()

    let transactions = {}

    for(let i = 1; i <= num_questions; i++){
        console.log(`current question: ${i}`)

        let current_transaction = {}

        let agent_question = await agentSpeak(questions[i])
        current_transaction['agent_question'] = agent_question
        console.log('agent_question:', agent_question)

        let user_response = await captureUserResponse()
        current_transaction['user_response'] = user_response
        console.log('user_response:', user_response)

        let agent_instruction = `You are a helpful agent providing simple one sentence responses to user replies to your questions. Do not ask follow-up questions.\nAgent Questions: ${agent_question}\nUser Response:${user_response}`

        let agent_response = await processSpeech(agent_instruction, gptManager)
        current_transaction['agent_response'] = agent_response
        console.log('agent_response:', agent_response)

        transactions[i] = current_transaction
    }

    await agentSpeak(`It appears I've asked all my questions.`)
    await agentSpeak("If you'd like to review this conversation, a transcript is available in the inspector.")
    await agentSpeak('Thanks for answering all my questions!')

    slightSmileFace()
    wink()
    await delay(1000)
    neutralFace()

    let json_string = JSON.stringify(transactions, null, 2)

    console.log(`Transaction History:\n${json_string}`)
}

function stop(){
    console.log('Calling stop!')
    
    recognitionStop = true
    console.log('recognitionStop:', recognitionStop)
    
    if (recognitionAvailable){
        recognition.stop()    
        console.log("speech recognition stopped!")
    }

    console.log('Reached end stop!')
}

export { start, stop }