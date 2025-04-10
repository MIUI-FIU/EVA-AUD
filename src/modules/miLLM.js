// AU Imports
import { ActionUnitsList, VisemesList } from "../unity/facs/shapeDict";

// FER Imports
import ReactDOMClient from 'react-dom/client';
import React, { useRef } from 'react';
import FaceDetection from '../components/FaceDetection';

// LLM Imports
import ollama from 'ollama'

// TTS Imports
import SpeechManager from "../VISOS/action/verbalizers/SpeechManager";

// Visualization Imports
import { useToast } from '@chakra-ui/react';

// Data Capture vars
let conversation_log = null

// ER vars
const universal_emotions_list = ['surprised', 'disgusted', 'fearful', 'sad', 'angry', 'happy', 'neutral']

// FER vars
let root = null;
let stopVideoRef = null;
let lastEmotionTime;
let topEmotionTuple;

let captureEmotionTrigger = true;
let capturedEmotionsList = [];

let latestFacialEmotionTupleOnSpeak;

// Blinking Animation vars
let blinkInterval
const blinkSpeed = 4000

// LLM vars
let llm_model_name = 'mistral' // ollama run mistral
let llm_iter_relevancy_num = 3
let llm_iter_matching_num = 3
let llm_iter_emotion_num = 3

// NLP vars
const acknowledge_phrases = ['Understood', 'Got it', 'Okay', 'Alright', 'Right']

// STT vars
let recognitionAvailable = false;
let recognition;
let lastTranscript = '';

let processingRequest = false;
let recognitionStop = false;

// TTS vars
let speechManager;

// Visualization vars
// let toast = useToast()

// Intervention vars
let intervention_dict;
let interventionFullStop = false;

let activeListeningTrigger;
//Text Var
let bottomBoxText = "Default text";


// Callback function to handle detected emotions
const handleEmotionDetected = (sortedEmotionsTuples) => {
    // console.log('Detected sortedEmotionsTuples:', sortedEmotionsTuples);

    topEmotionTuple = sortedEmotionsTuples[0]
    lastEmotionTime = topEmotionTuple[2]

    if (captureEmotionTrigger == true) {
        capturedEmotionsList.push(topEmotionTuple)

        // console.log('capturedEmotionsList:', capturedEmotionsList)
    }

    // console.log('Top Emotion Tuple:', topEmotionTuple)
};

function enableFER(animationManager, settings, root) {
    // Create a ref to pass to FaceDetection for stopping video
    stopVideoRef = React.createRef();

    root.render(
        <FaceDetection
            animationManager={animationManager}
            settings={settings}
            onEmotionDetected={handleEmotionDetected}
            stopVideoRef={stopVideoRef} // Pass the stopVideoRef to FaceDetection
        />
    );
}

// Function to continuously check the latest detected emotion
function monitorFER() {
    const checkInterval = 1000; // Check every second

    setInterval(() => {
        if (topEmotionTuple && lastEmotionTime) {
            const currentTime = Date.now();
            const timeSinceLastEmotion = currentTime - lastEmotionTime;

            console.log("Latest Detected Emotion:", topEmotionTuple);
            // console.log(`Time since last detected emotion: ${timeSinceLastEmotion / 1000} seconds`);
        }
    }, checkInterval);
}

function stopFER() {
    if (stopVideoRef && stopVideoRef.current) {
        stopVideoRef.current(); // Call stopVideo from FaceDetection
    }

    if (root) {
        root.unmount();
        root = null;
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function agentSpeak(text, toast, toastNotificationTrigger = false) {
    speechManager.initSynthesizer();
    let synthesize_result = await speechManager.synthesizeSpeech(text);

    const delayTime = synthesize_result.audioDuration / 10000

    bottomBoxText = text;
    updateBottomBoxText();

    if (toastNotificationTrigger)
        toast({
            title: 'eEVA Response',
            description: text,
            status: 'info',
            duration: 0,
            isClosable: false,
        });

    console.log('synthesize_result object:', synthesize_result);
    console.log('synthesize result transcript:', text)
    console.log('synthesize result audioDuration:', synthesize_result.audioDuration);

    console.log('before delay!');

    try {
        await delay(delayTime);
        console.log('after delay!');
    } catch (error) {
        if (error.message === 'Delay aborted') {
            console.log('Delay was aborted');
        } else {
            console.error('Error during delay:', error);
        }
    }
}

function userDrivenDemo() {
    if ('webkitSpeechRecognition' in window) {
        console.log('SpeechRecognition Available!')
        processingRequest = false;

        let transactions = {}

        console.log('recognitionStop:', recognitionStop)

        if (!recognitionStop) {
            recognitionAvailable = true;
            recognitionStop = false

            // Initialize SpeechRecognition object
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            console.log('SPEECH RECOGNITION INTIALIZED!')

            // SpeechRecognition options
            recognition.continuous = true;
            recognition.lang = 'en-US'
            recognition.interimResults = true
            recognition.maxAlternatives = 1

            recognition.onresult = async function (event) {
                console.log('IN RECOGNITION ONRESULT!')
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
                    console.log("Latest Detected Emotion:", topEmotionTuple);

                    if (processTranscript) {
                        let user_prompt = ''

                        if (topEmotionTuple) {
                            let lastEmotionTimeThreshold = 1000

                            let emotionTimePassed = Date.now() - lastEmotionTime

                            // console.log('emotionTimePassed:', emotionTimePassed)

                            let emotionTimeCheck = emotionTimePassed > lastEmotionTimeThreshold

                            // console.log('emotionTimeCheck:', emotionTimeCheck)

                            if (!(emotionTimeCheck))
                                user_prompt += ('User Emotion: ' + topEmotionTuple[0] + '\n')

                        }

                        user_prompt += ('User Prompt: ' + processTranscript + '\n')

                        user_prompt += ('Context: You are a motivational interviewing therapist and are to only answer questions related to this topic. Please provide responses as a sentence to be read by a Text to Speech engine.\n')

                        user_prompt += ('Response: ')

                        console.log('full user prompt:\n', user_prompt)

                        let llm_response = await ollama.chat({
                            model: llm_model_name,
                            messages: [{
                                role: 'user',
                                content: user_prompt
                            }]
                        })

                        console.log('llm response:', llm_response)

                        let response_text = llm_response.message

                        console.log('response_text:', response_text)

                        let response_text_role = response_text.role

                        let response_text_content = response_text.content

                        await agentSpeak(response_text_content)

                        let transaction_text = (user_prompt + response_text_content)

                        console.log('transaction_text:\n' + transaction_text)
                    }

                    processingRequest = false
                }
            };
            recognition.onend = function () {
                if (!recognitionStop) {
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

    if (recognitionAvailable) {
        recognition.start()
        console.log('SPEECH RECOGNITION STARTED!')
    }
}

function loadIntervention() {
    const audit_questionnaire_dict = {
        "name": "AUDIT questionnaire",
        "max_score": 40,
        "introduction": "Let's start the AUDIT questionnaire. This questionnaire is used to determine if this program is worth your time and effort. Let's begin.",

        //This version is from the original AUDIT questionnaire
        // "questions": [
        //     "How often do you have a drink containing alcohol?",
        //     "How many drinks containing alcohol do you have on a typical day when you are drinking?",
        //     "How often do you have four or more drinks on one occasion?",
        //     "How often during the last year have you found that you were not able to stop drinking once you had started?",
        //     "How often during the last year have you failed to do what was normally expected from you because of drinking?",
        //     "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?",
        //     "How often during the last year have you had a feeling of guilt or remorse after drinking?",
        //     "How often during the last year have you been unable to remember what happened the night before because you had been drinking?",
        //     "Have you or someone else been injured as a result of your drinking?",
        //     "Has a relative or friend, or a doctor or other health worker been concerned about your drinking or suggested you cut down?",
        // ],
        // "response_categories": [
        //     ["Never", "Monthly", "Two to four times a month", "Two to three times a week", "Four or more times a week"],
        //     ["1 or 2", "3 or 4", "5 or 6", "7 to 9", "10 or more"], // Modified to add the 0 category
        //     ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
        //     ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
        //     ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
        //     ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
        //     ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
        //     ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
        //     ["No", "Yes, but not in the last year", "Yes, during the last year"],
        //     ["No", "Yes, but not in the last year", "Yes, during the last year"]
        // ],
        // "scoring_categories": [
        //     [0, 1, 2, 3, 4],
        //     [0, 1, 2, 3, 4],
        //     [0, 1, 2, 3, 4, 4],
        //     [0, 1, 2, 3, 4, 4],
        //     [0, 1, 2, 3, 4, 4],
        //     [0, 1, 2, 3, 4, 4],
        //     [0, 1, 2, 3, 4, 4],
        //     [0, 1, 2, 3, 4, 4],
        //     [0, 2, 4],
        //     [0, 2, 4]
        // ]

        // Slight modifications by Chris to work with LLMs.
        "questions": [
            "How often do you have a drink containing alcohol?",
            "How many drinks containing alcohol do you have on a typical day when you are drinking?",
            "How often do you have four or more drinks on one occasion?",
            "How often during the last year have you found that you were not able to stop drinking once you had started?",
            "How often during the last year have you failed to do what was normally expected from you because of drinking?",
            "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?",
            "How often during the last year have you had a feeling of guilt or remorse after drinking?",
            "How often during the last year have you been unable to remember what happened the night before because you had been drinking?",
            "Have you or someone else been injured as a result of your drinking?",
            "Has a relative or friend, or a doctor or other health worker been concerned about your drinking or suggested you cut down?",
        ],
        "response_categories": [
            ["Never", "Once a month", "Two to four times a month", "Two to three times a week", "more than three times a week"], // Modified to "more than three times a week".
            ["zero", "one or two", "three or four", "five or six", "seven to nine", "ten or more"], // Modified to add the 0 category and move to text numbers.
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["No", "Yes, but not in the last year", "Yes, during the last year"],
            ["No", "Yes, but not in the last year", "Yes, during the last year"]
        ],
        "response_categories_match": [
            ["Never", "Once a month", "two times a month", "three times a month", "four times a month", "two times a week", "three times a week", "more than three times a week"],
            ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "more than ten"], // Modified to add the 0 category and move to text numbers.
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["No", "Yes, but not in the last year", "Yes, during the last year"],
            ["No", "Yes, but not in the last year", "Yes, during the last year"]
        ],
        "scoring_categories": [
            [0, 1, 2, 2, 2, 3, 3, 4],
            [0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 2, 4],
            [0, 2, 4]
        ]
    }
    const active_listening_audit_questionnaire = {
        "name": "AUDIT questionnaire",
        "max_score": 40,
        "introduction": "Let's start the AUDIT questionnaire. This questionnaire is used to determine if this program is worth your time and effort. Let's begin.",
        // "introduction": "",
        "questions": [
            "How often do you have a drink containing alcohol?",
            "How many drinks containing alcohol do you have on a typical day when you are drinking?",
            "How often do you have four or more drinks on one occasion?",
            "How often during the last year have you found that you were not able to stop drinking once you had started?",
            "How often during the last year have you failed to do what was normally expected from you because of drinking?",
            "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?",
            "How often during the last year have you had a feeling of guilt or remorse after drinking?",
            "How often during the last year have you been unable to remember what happened the night before because you had been drinking?",
            "Have you or someone else been injured as a result of your drinking?",
            "Has a relative or friend, or a doctor or other health worker been concerned about your drinking or suggested you cut down?",
        ],
        "target_questions": [
            "How often do you have a drink containing alcohol?",
            "How many drinks containing alcohol do you have on a typical day when you are drinking?",
            "How often do you have four or more drinks on one occasion?",
            "How often during the last year have you found that you were not able to stop drinking once you had started?",
            "How often during the last year have you failed to do what was normally expected from you because of drinking?",
            "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?",
            "How often during the last year have you had a feeling of guilt or remorse after drinking?",
            "How often during the last year have you been unable to remember what happened the night before because you had been drinking?",
            "Have you or someone else been injured as a result of your drinking?",
            "Has a relative or friend, or a doctor or other health worker been concerned about your drinking or suggested you cut down?",
        ],
        "response_categories": [
            ["Never", "Once a month", "Two to four times a month", "Two to three times a week", "more than three times a week"], // Modified to "more than three times a week".
            ["zero", "one or two", "three or four", "five or six", "seven to nine", "ten or more"], // Modified to add the 0 category and move to text numbers.
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["No", "Yes, but not in the last year", "Yes, during the last year"],
            ["No", "Yes, but not in the last year", "Yes, during the last year"]
        ],
        "response_categories_match": [
            ["Never", "Once a month", "two times a month", "three times a month", "four times a month", "two times a week", "three times a week", "more than three times a week"],
            ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "more than ten"], // Modified to add the 0 category and move to text numbers.
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["No", "Yes, but not in the last year", "Yes, during the last year"],
            ["No", "Yes, but not in the last year", "Yes, during the last year"]
        ],
        "scoring_categories": [
            [0, 1, 2, 2, 2, 3, 3, 4],
            [0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 2, 4],
            [0, 2, 4]
        ]
    }

    const open_audit_questionnaire_dict = {
        "name": "Open AUDIT questionnaire",
        "max_score": 40,
        "introduction": "Let's start the Open AUDIT questionnaire. This questionnaire is used to determine if this program is worth your time and effort. Let's begin.",
        // "introduction": "",
        "questions": [
            "Can you describe how frequently you typically have a drink containing alcohol?",
            "What would you say is the usual number of alcoholic drinks you have on a day when you choose to drink?",
            "How often do you find yourself drinking four or more drinks on one occasion?",
            "Could you share any experiences from the past year where you started drinking and found it difficult to stop?",
            "In the past year, have there been occasions where drinking affected your ability to meet your usual responsibilities? What was that like?",
            "After a night of heavy drinking, have you ever felt the need to have a drink in the morning to get going? Could you tell me more about those situations?",
            "What has your experience been with feelings of guilt or remorse after drinking over the past year?",
            "Have you had times in the past year where you couldn't recall events from the night before due to drinking? How did that affect you?",
            "Can you recall any situations where either you or someone else was injured as a result of your drinking within the last year?",
            "Have there been any times when a relative, friend, doctor, or other health professional expressed concern about your drinking or suggested you consider cutting down within the last year? What was that experience like for you?",
        ],
        "target_questions": [
            "How often do you have a drink containing alcohol?",
            "How many drinks containing alcohol do you have on a typical day when you are drinking?",
            "How often do you have four or more drinks on one occasion?",
            "How often during the last year have you found that you were not able to stop drinking once you had started?",
            "How often during the last year have you failed to do what was normally expected from you because of drinking?",
            "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?",
            "How often during the last year have you had a feeling of guilt or remorse after drinking?",
            "How often during the last year have you been unable to remember what happened the night before because you had been drinking?",
            "Have you or someone else been injured as a result of your drinking?",
            "Has a relative or friend, or a doctor or other health worker been concerned about your drinking or suggested you cut down?",
        ],
        "response_categories": [
            ["Never", "Once a month", "2 to 4 times a month", "2 to 3 times a week", "more than 3 times a week"], // Modified to "more than three times a week".
            ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "more than 10"], // Modified to add the 0 category and move to text numbers.
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["Never", "Less than monthly", "Monthly", "Weekly", "Daily", "almost daily"],
            ["No", "Yes, but not in the last year", "Yes, during the last year"],
            ["No", "Yes, but not in the last year", "Yes, during the last year"]
        ],
        "scoring_categories": [
            [0, 1, 2, 3, 4],
            [0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 1, 2, 3, 4, 4],
            [0, 2, 4],
            [0, 2, 4]
        ]
    }

    const drinc_questionnaire_dict = {}

    const simple_intervention_config = {
        "agent_greeting": "Hello, my name is eva.",
        "introduction": "Let's go through some questionnaires to help review your drinking.",
        "questionnaires": [audit_questionnaire_dict]
    }

    const test_intervention_config = {
        "agent_greeting": "Hello, my name is eva.",
        "introduction": "Let's go through some questionnaires to help review your drinking.",
        // "introduction": "",
        // "questionnaires": [open_audit_questionnaire_dict]
        "questionnaires": [active_listening_audit_questionnaire]
    }

    const complete_intervention_config = {
        "agent_greeting": "Hello, my name is eva.",
        "introduction": "Let's go through some questionnaires to help review your drinking.",
        "questionnaires": [audit_questionnaire_dict, drinc_questionnaire_dict]
    }

    console.log('activeListeningTrigger:', activeListeningTrigger)

    if (activeListeningTrigger == true) {
        intervention_dict = test_intervention_config
    }
    else {
        intervention_dict = simple_intervention_config
    }

    // intervention_dict = simple_intervention_config
    // intervention_dict = test_intervention_config
    // intervention_dict = complete_intervention_config

    console.log('intervention_dict:', intervention_dict)
}

function captureUserResponse(toast, toastNotificationTrigger = false) {
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

                lastTranscript = ''

                if (toastNotificationTrigger)
                    toast({
                        title: 'eEVA Response',
                        description: 'Started Listening...',
                        status: 'success',
                        duration: 0,
                        isClosable: false,
                    });

                recognition.onresult = async function (event) {
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

                        latestFacialEmotionTupleOnSpeak = null

                        if (topEmotionTuple != undefined) {
                            const currentTime = Date.now();
                            const timeSinceLastEmotion = currentTime - lastEmotionTime;
                            const timeSinceLastEmotionSeconds = timeSinceLastEmotion / 1000

                            console.log('timeSinceLastEmotionSeconds:', timeSinceLastEmotionSeconds)

                            if (timeSinceLastEmotionSeconds <= 1) {
                                console.log('topEmotionTuple:', topEmotionTuple)

                                const currentEmotion = topEmotionTuple[0]

                                console.log('currentEmotion:', currentEmotion)

                                latestFacialEmotionTupleOnSpeak = currentEmotion
                            }
                        }

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

                    if (toastNotificationTrigger)
                        toast({
                            title: 'eEVA Response',
                            description: 'Stopped Listening...',
                            status: 'error',
                            duration: 0,
                            isClosable: false,
                        });

                    if (!lastTranscript) {
                        resolve('')
                    }
                    else {
                        console.log('lastTranscript:', lastTranscript)

                        resolve(lastTranscript); // Resolve the promise when recognition ends
                    }
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

async function captureUserResponseAzure(toast, toastNotificationTrigger = false) {
    try {
        if (toastNotificationTrigger)
            toast({
                title: 'eEVA Response',
                description: 'Started Listening...',
                status: 'success',
                duration: 0,
                isClosable: false,
            });

        const result = await speechManager.recognizeSpeechUntilSilence();
        //Shamim2
        //clearBottomBox()
        bottomBoxText = "";
        updateBottomBoxText();


        if (toastNotificationTrigger)
            toast({
                title: 'eEVA Response',
                description: 'Stopped Listening...',
                status: 'error',
                duration: 0,
                isClosable: false,
            });

        return result
    }
    catch (e) {
        console.log("Error during speech recognition:", e)

        if (toastNotificationTrigger) {
            toast({
                title: "Error",
                description: "Speech recognition failed.",
                status: "error",
                duration: 0,
                isClosable: true,
            });
        }

        throw e
    }
}

function cleanResponse(response) {
    let clean_response = response;

    // Remove punctuation
    clean_response = clean_response.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ")

    // Set to lower case
    clean_response = clean_response.toLowerCase()

    return clean_response
}

async function llmPrompt(llm_prompt, clean_response_trigger = false) {
    let llm_response = await ollama.chat({
        model: llm_model_name,
        messages: [{
            role: 'user',
            content: llm_prompt
        }]
    })

    let llm_response_msg = llm_response.message
    let llm_response_msg_content = llm_response_msg.content

    if (clean_response_trigger == true)
        llm_response_msg_content = cleanResponse(llm_response_msg_content)

    return llm_response_msg_content
}

async function checkUserOKAnsweringQuestion(user_response, question) {
    // let llm_prompt = `Please check if the user is comfortable answering the following question:  \'${question}\' given the following user response: \'${user_response}\'. Respond with yes if the user is comfortable, otherwise respond with no.`

    // let llm_prompt = `Based on the user's response: '${user_response}' to the following question '${question}', assess if the user seems comfortable answering the question. Look for language that might indicate hesitation, discomfort, or reluctance. Respond with 'yes' if the user is confident and open, and 'no' if there are signs they feel hesitant or unwilling.`

    let llm_prompt = `Based on the user's response '${user_response} to the following question '${question}', directly assess if the user is comfortable answering the question.  Respond with 'yes' if the user is open, and 'no' if there are signs they feel hesitant or unwilling.`

    console.log(`llm ok prompt: ${llm_prompt}`)

    let llm_response_msg_content = await llmPrompt(llm_prompt, true)

    llm_response_msg_content = llm_response_msg_content.toLowerCase().trim();

    console.log(`llm ok response: ${llm_response_msg_content}`)

    let is_response_ok = llm_response_msg_content.includes('yes')

    return is_response_ok
}

async function checkResponseRelevancyOnce(user_response, question) {
    // let llm_prompt = `Please check if the following user response: '${user_response}' answers or indirectly implies an answer to the following question: '${question}'. Consider if the response provides a relevant answer, even if it’s not stated directly. Respond with yes or no.`

    let llm_prompt = `Please check if the following user response: '${user_response}' answers or indirectly implies an answer to the question: '${question}. Respond with "yes" if the response implies a relevant answer, even if it's not stated in the exact terms of the question. Respond with "no" only if it does not imply any relevant answer.`

    console.log(`llm relevancy prompt: ${llm_prompt}`)

    let llm_response_msg_content = await llmPrompt(llm_prompt, true)

    llm_response_msg_content = llm_response_msg_content.toLowerCase().trim();

    console.log(`llm relevancy response: ${llm_response_msg_content}`)

    let is_response_relevant = llm_response_msg_content.includes('yes')

    return is_response_relevant
}

async function checkResponseRelevancyMultiple(user_response, question) {
    let response_relevancy_list = []

    for (let i = 0; i < llm_iter_relevancy_num; i++) {
        response_relevancy_list.push(await checkResponseRelevancyOnce(user_response, question))
    }

    let response_relevancy_count = 0
    for (let j = 0; j < response_relevancy_list.length; j++) {
        let current_value = response_relevancy_list[j]

        if (current_value == true) {
            response_relevancy_count += 1
        }
    }

    let threshold = parseInt(Math.floor(response_relevancy_list.length / 2))

    let is_response_relevant = false
    if (response_relevancy_count > threshold) {
        is_response_relevant = true
    }

    return is_response_relevant
}

async function checkResponseRelevancy(user_response, question) {
    // return await checkResponseRelevancyOnce(user_response, question)

    return await checkResponseRelevancyMultiple(user_response, question)
}

function stringifyArray(chosen_array) {
    let array_string = ''

    console.log(`chosen array type: ${typeof (chosen_array)}`)

    for (let i = 0; i < chosen_array.length; i++) {
        let element = chosen_array[i]

        if (i == (chosen_array.length - 1)) {
            array_string += `or ${element}.`
        }
        else {
            array_string += `${element}, `
        }
    }

    // chosen_array.forEach(element => {
    //     array_string += `${element}, `
    // });

    return array_string
}

function stringifyArrayListFormat(chosen_array) {
    let array_string = ''

    chosen_array.forEach(element => {
        array_string += `\n*${element}`
    });

    return array_string
}

function mostFrequentNumber(arr) {
    let frequencyMap = {}; // To store frequency of each number
    let maxCount = 0;      // To store the highest frequency count
    let mostFrequentNum = null; // To store the most frequent number

    // Count the frequency of each number
    for (let num of arr) {
        if (num == null) continue

        frequencyMap[num] = (frequencyMap[num] || 0) + 1;

        // Update most frequent number if current number has a higher count
        if (frequencyMap[num] > maxCount) {
            maxCount = frequencyMap[num];
            mostFrequentNum = num;
        }
    }

    return mostFrequentNum;
}

async function verifyLLMMatchResponse(user_response, valid_user_responses) {
    let valid_user_responses_string = stringifyArrayListFormat(valid_user_responses)

    valid_user_responses_string = valid_user_responses_string.toLowerCase().trim()

    let llm_prompt = `Please check if the following user response: \'${user_response}\' can be directly or indirectly matched to the following valid responses: '${valid_user_responses_string}'. Respond with yes or no.`

    console.log(`llm verify match prompt: ${llm_prompt}`)

    let llm_response_msg_content = await llmPrompt(llm_prompt, true)

    llm_response_msg_content = llm_response_msg_content.toLowerCase().trim();

    console.log(`llm verify match response: ${llm_response_msg_content}`)

    let is_response_match = llm_response_msg_content.includes('yes')

    return is_response_match
}

async function llmMatchResponseOnce(user_response, valid_user_responses) {
    let valid_user_responses_string = stringifyArrayListFormat(valid_user_responses);

    valid_user_responses_string = valid_user_responses_string.toLowerCase().trim();

    let llm_prompt = `Please match the following user response: '${user_response}' to the following valid responses: \n${valid_user_responses_string}\nAlways match to the exact closest valid response. Be direct and succinct.`;

    console.log(`llm match prompt: ${llm_prompt}`);

    let llm_response = await ollama.chat({
        model: llm_model_name,
        messages: [{
            role: 'user',
            content: llm_prompt
        }]
    });

    let llm_response_msg = llm_response.message;
    let llm_response_msg_content = llm_response_msg.content;

    llm_response_msg_content = llm_response_msg_content.toLowerCase().trim();

    console.log(`llm match response: ${llm_response_msg_content}`);

    let match_index = null

    for (let i = 0; i < valid_user_responses.length; i++) {
        let element = valid_user_responses[i].toLowerCase().trim()
        if (llm_response_msg_content === element) {
            console.log('EXACT MATCH!')

            console.log('llm_response_msg_content:', llm_response_msg_content)
            console.log('element:', element)

            match_index = i
            break
        }
        else if (llm_response_msg_content.includes(element)) {
            console.log('SUBSTRING MATCH!')

            console.log('llm_response_msg_content:', llm_response_msg_content)
            console.log('element:', element)

            match_index = i
            break
        }
    }

    console.log('match_index:', match_index);

    return match_index;
}

async function llmMatchResponseMultiple(user_response, valid_user_responses) {
    let match_index_list = []
    for (let i = 0; i < llm_iter_matching_num; i++) {
        match_index_list.push(await llmMatchResponseOnce(user_response, valid_user_responses))
    }

    console.log('match_index_list:', match_index_list)
    let match_index = mostFrequentNumber(match_index_list)

    return match_index
}

async function llmMatchResponse(user_response, valid_user_responses) {
    let match_index = null

    let match_count = 0
    while (match_index == null && match_count < 2) {
        // match_index = await llmMatchResponseOnce(user_response, valid_user_responses)

        match_index = await llmMatchResponseMultiple(user_response, valid_user_responses)

        match_count += 1
    }

    return match_index
}

async function generateReflectiveListeningResponse(user_response, current_question, response_match) {
    let llm_prompt = `Given the following relevant user response, '${user_response}' to '${current_question}', please provide a reflective listening response that acknowledges their response to the closest response match equivalent of ${response_match} and guides them to confirm your understanding of the user response.`

    console.log('llm reflective listening response:', llm_prompt)

    let llm_response_msg_content = await llmPrompt(llm_prompt)

    llm_response_msg_content = llm_response_msg_content.toLowerCase().trim();

    console.log(`llm followup response: ${llm_response_msg_content}`)

    let reflective_listening_response = llm_response_msg_content

    return reflective_listening_response
}

async function llmConfirmResponse(user_response, current_statement) {
    let llm_prompt = `Given the following user response, '${user_response}' to following agent response:'${current_statement}', check if the user is directly or indirectly responding with a form of 'yes'. Respond with 'yes' if they are and 'no' if they do not. Be direct and succinct by giving a 1 word response.`

    console.log(`llm confirm prompt: ${llm_prompt}`)

    let llm_response_msg_content = await llmPrompt(llm_prompt, true)

    llm_response_msg_content = llm_response_msg_content.toLowerCase().trim();

    console.log(`llm cofirm response: ${llm_response_msg_content}`)

    let is_response_confirmed = llm_response_msg_content.includes('yes')

    return is_response_confirmed
}

async function generateFollowUpQuestion(user_response, current_question, target_question) {
    let llm_prompt = `Given the following user response, '${user_response}' to '${current_question}', please provide a follow-up question that acknowledges their response and guides them to answer '${target_question}'.`

    console.log(`llm followup prompt: ${llm_prompt}`)

    let llm_response_msg_content = await llmPrompt(llm_prompt)

    llm_response_msg_content = llm_response_msg_content.toLowerCase().trim();

    console.log(`llm followup response: ${llm_response_msg_content}`)

    let followup_question = llm_response_msg_content

    return followup_question
}

async function llmTextEmotionRecognitionOnce(text) {
    let universal_emotions_string = stringifyArrayListFormat(universal_emotions_list)

    universal_emotions_string = universal_emotions_string.toLowerCase().trim()

    let llm_prompt = `Please match from the following text: \'${text}\' to one of the following emotions:\n${universal_emotions_string}\n`

    console.log(`llm emotion prompt: ${llm_prompt}`)

    let llm_response_msg_content = await llmPrompt(llm_prompt, true)

    llm_response_msg_content = llm_response_msg_content.toLowerCase().trim();

    console.log(`llm emotion response: ${llm_response_msg_content}`)

    let match_index = null

    for (let i = 0; i < universal_emotions_list.length; i++) {
        let element = universal_emotions_list[i].toLowerCase().trim()

        // console.log('element:', element)

        if (llm_response_msg_content.includes(element)) {
            console.log('MATCH!')

            console.log('llm_response_msg_content:', llm_response_msg_content)
            console.log('element:', element)

            match_index = i
            break
        }
    }

    console.log('match_index:', match_index)

    return match_index
}

async function llmTextEmotionRecognitionMultiple(text) {
    let match_index_list = []
    for (let i = 0; i < llm_iter_emotion_num; i++) {
        match_index_list.push(await llmTextEmotionRecognitionOnce(text))
    }

    console.log('match_index_list:', match_index_list)
    let match_index = mostFrequentNumber(match_index_list)

    return match_index
}

async function llmTextEmotionRecognition(text) {
    let match_index = null

    let match_count = 0
    while (match_index == null && match_count < 2) {
        // match_index = await llmTextEmotionRecognitionOnce(text)

        match_index = await llmTextEmotionRecognitionMultiple(text)

        match_count += 1
    }

    return match_index
}

function generateLogID() {
    return crypto.randomUUID()
}

function convertToDateTimeString(timestamp) {
    return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

function initDataCapture() {
    conversation_log = {
        "id": generateLogID(),
        "datetime": convertToDateTimeString(Date.now()),
        "user_data": {},
        "transcript": {
            'introduction': '',
            'questionnaires': [],
        }
    }

    console.log('init conversation_log:', JSON.stringify(conversation_log, null, 2))
}

async function activeListeningAgentDrivenIntervention(toast, toastNotificationTrigger = false) {
    loadIntervention()
    initDataCapture()
    createBottomBox()
    let agent_greeting = intervention_dict['agent_greeting']
    //changed-correct
    await agentSpeak(agent_greeting, toast, false)
    //changed-correct
    await agentSpeak(intervention_dict['introduction'], toast, false)

    conversation_log['transcript']['introduction'] = `${agent_greeting} ${intervention_dict['introduction']}`

    let questionnaires = intervention_dict['questionnaires']

    let current_questionnaire_dict = {}

    for (let i = 0; i < questionnaires.length; i++) {
        if (interventionFullStop) break

        let current_questionnaire = questionnaires[i]

        let questionnaire_name = current_questionnaire['name']
        console.log('current_questionnaire:', questionnaire_name)

        current_questionnaire_dict['name'] = questionnaire_name
        current_questionnaire_dict['transactions'] = {}

        let max_questionnaire_score = current_questionnaire['max_score']

        let introduction = current_questionnaire['introduction']
        //changed-correct
        await agentSpeak(introduction, toast, false)

        let questions = current_questionnaire['questions']
        let target_questions = current_questionnaire['target_questions']
        let valid_user_responses = current_questionnaire['response_categories']
        let valid_match_user_responses = current_questionnaire['response_categories_match']
        let scoring_categories = current_questionnaire['scoring_categories']

        console.log('questions:', questions)
        console.log('scoring_categories:', scoring_categories)

        let questionnaire_score = 0

        current_questionnaire_dict['total_questionnaire_score'] = questionnaire_score


        for (let j = 0; j < questions.length; j++) {
            if (interventionFullStop) break

            let transaction_pair_count = 0

            let current_question = questions[j]
            let current_target_question = target_questions[j]
            let current_valid_user_responses = valid_user_responses[j]
            let current_valid_match_user_responses = valid_match_user_responses[j]
            let current_scoring_categories = scoring_categories[j]

            current_questionnaire_dict['transactions'][`Q${j}`] = {}

            current_questionnaire_dict['transactions'][`Q${j}`]['start_question'] = current_question

            current_questionnaire_dict['transactions'][`Q${j}`]['target_question'] = current_target_question

            current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'] = {}

            current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'] = {}

            current_questionnaire_dict['transactions'][`Q${j}`]['responses'] = {}

            let current_question_question = current_question

            let current_question_options = stringifyArray(current_valid_user_responses).toLowerCase().trim()

            current_question = `${current_question_question} ${current_question_options}`

            // current_question += (' ' + stringifyArray(current_valid_user_responses).toLowerCase().trim())

            //changed-correct
            await agentSpeak(current_question_question, toast, false)

            await agentSpeak(current_question_options, toast, false)

            current_questionnaire_dict['transactions'][`Q${j}`]['responses'][`${transaction_pair_count}: agent`] = current_question // 0th pair count, in this case, will always be the question being asked.
            current_questionnaire_dict['transactions'][`Q${j}`]['responses'][`${transaction_pair_count}: user`] = ""

            current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: agent`] = ""
            current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: user`] = ""

            current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'][`${transaction_pair_count}: agent`] = ""
            current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'][`${transaction_pair_count}: user`] = ""

            current_questionnaire_dict['transactions'][`Q${j}`]['user_valid_responses'] = current_valid_user_responses // 0th pair count, in this case, will always be the question being asked.
            current_questionnaire_dict['transactions'][`Q${j}`]['user_valid_match_responses'] = current_valid_match_user_responses

            if (interventionFullStop) break

            let is_user_ok_answering_question = false
            let is_response_relevant = false
            let is_response_relevant_target = false
            let is_response_match = false
            let likert_matched_response_index = null
            let repeat_count = 0
            let max_repeat_count = 2

            while (!is_response_relevant || (likert_matched_response_index == null)) {
                if (interventionFullStop) break

                let user_response = ''

                while (!user_response) {
                    if (interventionFullStop) break

                    captureEmotionTrigger = true
                    //changed-correct
                    // user_response = await captureUserResponse(toast, true)
                    user_response = await captureUserResponseAzure(toast, false)

                    let user_response_timestamp = user_response.timestamp
                    console.log('user_response_timestamp:', user_response_timestamp)

                    captureEmotionTrigger = false
                    console.log('before - capturedEmotionsList:', capturedEmotionsList)

                    if (capturedEmotionsList.length > 0) {
                        latestFacialEmotionTupleOnSpeak = getLatestFacialEmotionTuple(user_response_timestamp)
                        console.log('latestFacialEmotionTupleOnSpeak:', latestFacialEmotionTupleOnSpeak)
                    }

                    capturedEmotionsList = []

                    console.log('after - capturedEmotionsList:', capturedEmotionsList)

                    user_response = user_response.text

                    console.log('user_response:', user_response)

                    if (interventionFullStop) break

                    if (!user_response) {
                        console.log('USER RESPONSE NOT PROVIDED!')

                        console.log('repeat_count - 1:', repeat_count)

                        if (repeat_count >= max_repeat_count) {
                            repeat_count = 0

                            // Allow user to move on to the next question.
                            // await agentSpeak("Let's move on to the next question.", toast, true)
                            // break

                            // Terminate intervention due to exhausted attempts
                            //changed-correct
                            await agentSpeak("It seems you've used all your attempts to answer the current questions. Unfortunately, all questions must be answered as part of the intervention procedure to provide a valid evaluation. When you're ready to answer all the questions in the intervention, feel free to restart this module. Thank you for your time and participation.", toast, false)
                            stop()
                            return
                        }
                        else {
                            repeat_count += 1
                            //changed-correct
                            let speak_text = "It seems I wasn't able to hear what you said. Let me repeat the question."
                            await agentSpeak(speak_text, toast, false)

                            await agentSpeak(current_question_question, toast, false)

                            await agentSpeak(current_question_options, toast, false)
                        }
                    }

                    if (interventionFullStop) break
                }

                if (!user_response) {
                    break
                }

                bottomBoxText = 'Processing response. Please wait...';
                updateBottomBoxText();

                // console.log(`current_questionnaire_dict - 1: ${JSON.stringify(current_questionnaire_dict, null, 2)}`)

                await delay(500);

                if (toastNotificationTrigger) {
                    toast({
                        title: 'eEVA Response',
                        description: 'Processing response. Please wait...',
                        status: 'warning',
                        duration: 0,
                        isClosable: false,
                    });
                }

                if (interventionFullStop) break

                let cleaned_user_response = cleanResponse(user_response)
                console.log('cleaned_user_response:', cleaned_user_response)

                current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: agent`] = ""
                current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: user`] = ""

                current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'][`${transaction_pair_count}: agent`] = ""
                current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'][`${transaction_pair_count}: user`] = ""

                current_questionnaire_dict['transactions'][`Q${j}`]['responses'][`${transaction_pair_count}: agent`] = current_question
                current_questionnaire_dict['transactions'][`Q${j}`]['responses'][`${transaction_pair_count}: user`] = cleaned_user_response

                // let is_user_answering_question = await verifyLLMMatchResponse(user_response, current_valid_user_responses)

                // console.log('is_user_answering_question:', is_user_answering_question)

                // if(!is_user_answering_question){

                //     is_user_ok_answering_question = await checkUserOKAnsweringQuestion(cleaned_user_response, current_question)

                //     console.log('is_user_ok_answering_question:', is_user_ok_answering_question)

                //     if(!is_user_ok_answering_question){
                //         await agentSpeak(`I understand if you prefer not to answer the current question right now. Let's move on to the next question.`)

                //         likert_matched_response_index = await llmMatchResponse(cleaned_user_response, current_valid_user_responses)

                //         console.log('likert_matched_response_index:', likert_matched_response_index)

                //         if (interventionFullStop) break

                //         break
                //     }
                // }

                if (interventionFullStop) break

                is_response_relevant = await checkResponseRelevancy(cleaned_user_response, current_question)

                console.log("is_response_relevant:", is_response_relevant)

                if (interventionFullStop) break

                // This does a verification to make sure that the user is ok answering the current question.
                // Addendum: No longer needed needed under the assumption that the user is ok with answering all questions of the study.
                // if (!is_response_relevant){
                //     is_user_ok_answering_question = await checkUserOKAnsweringQuestion(cleaned_user_response, current_question)

                //     console.log('is_user_ok_answering_question:', is_user_ok_answering_question)

                //     if(!is_user_ok_answering_question){
                //         await agentSpeak(`I understand if you prefer not to answer the current question right now. Let's move on to the next question.`, toast, true)

                //         likert_matched_response_index = await llmMatchResponse(cleaned_user_response, current_valid_user_responses)

                //         console.log('likert_matched_response_index:', likert_matched_response_index)

                //         if (interventionFullStop) break

                //         break
                //     }
                // }

                is_response_relevant_target = await checkResponseRelevancy(cleaned_user_response, current_target_question)

                console.log("is_response_relevant_target:", is_response_relevant_target)

                if (interventionFullStop) break

                let reflective_listening_trigger = (j % 2 == 0) // Reflective listening on every odd question.

                if (is_response_relevant && is_response_relevant_target) {
                    likert_matched_response_index = await llmMatchResponse(cleaned_user_response, current_valid_match_user_responses)
                    console.log('likert_matched_response_index:', likert_matched_response_index)

                    let response_match = current_valid_match_user_responses[likert_matched_response_index]

                    if (interventionFullStop) break

                    let agent_matched_text_emotion_response_index = await llmTextEmotionRecognition(current_question)
                    let user_matched_text_emotion_response_index = await llmTextEmotionRecognition(cleaned_user_response)

                    let agent_matched_text_emotion = universal_emotions_list[agent_matched_text_emotion_response_index]
                    let user_matched_text_emotion = universal_emotions_list[user_matched_text_emotion_response_index]

                    console.log(`agent_matched_text_emotion_${j}:`, agent_matched_text_emotion)
                    console.log(`user_matched_text_emotion:_${j}:`, user_matched_text_emotion)

                    current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: agent`] = agent_matched_text_emotion
                    current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: user`] = user_matched_text_emotion

                    current_questionnaire_dict['transactions'][`Q${j}`]['responses'][`${transaction_pair_count}: agent`] = current_question
                    current_questionnaire_dict['transactions'][`Q${j}`]['responses'][`${transaction_pair_count}: user`] = cleaned_user_response

                    if (latestFacialEmotionTupleOnSpeak) {
                        current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'][`${transaction_pair_count}: user`] = latestFacialEmotionTupleOnSpeak[0]
                    }

                    transaction_pair_count += 1

                    if (interventionFullStop) break

                    if (likert_matched_response_index != null) {
                        if (interventionFullStop) break

                        if (reflective_listening_trigger) {
                            // Reaffirm user response through a reflection.
                            let reflective_listening_response = await generateReflectiveListeningResponse(cleaned_user_response, current_question, response_match)
                            //changed-correct
                            await agentSpeak(reflective_listening_response, toast, false)

                            let confirmation_response = ''
                            let is_response_confirmed = false

                            if (interventionFullStop) break

                            while (!confirmation_response) {
                                if (interventionFullStop) break
                                //changed-correct
                                confirmation_response = await captureUserResponseAzure(toast, false)

                                if (toastNotificationTrigger) {
                                    toast({
                                        title: 'eEVA Response',
                                        description: 'Processing response. Please wait...',
                                        status: 'warning',
                                        duration: 0,
                                        isClosable: false,
                                    });
                                }

                                confirmation_response = cleanResponse(confirmation_response.text)

                                if (interventionFullStop) break

                                let agent_matched_text_emotion_response_index = await llmTextEmotionRecognition(current_question)
                                let user_matched_text_emotion_response_index = await llmTextEmotionRecognition(cleaned_user_response)

                                let agent_matched_text_emotion = universal_emotions_list[agent_matched_text_emotion_response_index]
                                let user_matched_text_emotion = universal_emotions_list[user_matched_text_emotion_response_index]

                                console.log(`agent_matched_text_emotion_${j}:`, agent_matched_text_emotion)
                                console.log(`user_matched_text_emotion:_${j}:`, user_matched_text_emotion)

                                current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: agent`] = agent_matched_text_emotion
                                current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: user`] = user_matched_text_emotion

                                current_questionnaire_dict['transactions'][`Q${j}`]['responses'][`${transaction_pair_count}: agent`] = reflective_listening_response
                                current_questionnaire_dict['transactions'][`Q${j}`]['responses'][`${transaction_pair_count}: user`] = confirmation_response

                                transaction_pair_count += 1

                                if (interventionFullStop) break

                                if (!confirmation_response) {
                                    console.log('CONFIRMATION RESPONSE NOT PROVIDED!')

                                    console.log('repeat_count - 2:', repeat_count)

                                    if (repeat_count >= max_repeat_count) {
                                        repeat_count = 0

                                        // Allow user to move on to the next question.
                                        // await agentSpeak("Let's move on to the next question.", toast, true)
                                        // break

                                        // Terminate intervention due to exhausted attempts
                                        //changed-correct
                                        await agentSpeak("It seems you've used all your attempts to answer the current questions. Unfortunately, all questions must be answered as part of the intervention procedure to provide a valid evaluation. When you're ready to answer all the questions in the intervention, feel free to restart this module. Thank you for your time and participation.", toast, false)
                                        stop()
                                        return
                                    }
                                    else {
                                        repeat_count += 1
                                        //changed-correct
                                        let speak_text = "It seems I wasn't able to hear what you said. Let me repeat the question."
                                        await agentSpeak(speak_text, toast, false)
            
                                        await agentSpeak(current_question_question, toast, false)
            
                                        await agentSpeak(current_question_options, toast, false)
                                    }
                                }
                            }

                            if (!confirmation_response) break

                            console.log('confirmation_response:', confirmation_response)

                            is_response_confirmed = await llmConfirmResponse(confirmation_response, reflective_listening_response)

                            console.log('is_response_confirmed:', is_response_confirmed)

                            let rand_i = Math.floor(Math.random() * acknowledge_phrases.length)
                            let random_acknowledgement = acknowledge_phrases[rand_i]

                            if (!is_response_confirmed) {
                                //changed-correct
                                await agentSpeak(`${random_acknowledgement}. Let me repeat the question.`, toast, false)
                                await agentSpeak(current_question, toast, false)

                                current_questionnaire_dict['transactions'][`Q${j}`]['responses'][`${transaction_pair_count}: agent`] = reflective_listening_response

                                // Reset
                                is_response_relevant = false
                                likert_matched_response_index = null

                                continue
                            }
                            else {
                                // await agentSpeak(`${random_acknowledgement}. Let's move on to the next question.`, toast, true)

                                headNodAffirmation()

                                await delay(3000)
                            }
                        }
                    }

                    // let agent_matched_text_emotion_response_index = await llmTextEmotionRecognition(current_question)
                    // let user_matched_text_emotion_response_index = await llmTextEmotionRecognition(cleaned_user_response)

                    // let agent_matched_text_emotion = universal_emotions_list[agent_matched_text_emotion_response_index]
                    // let user_matched_text_emotion = universal_emotions_list[user_matched_text_emotion_response_index]

                    // console.log(`agent_matched_text_emotion_${j}:`, agent_matched_text_emotion)
                    // console.log(`user_matched_text_emotion:_${j}:`, user_matched_text_emotion)

                    // current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: agent`] = agent_matched_text_emotion
                    // current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: user`] = user_matched_text_emotion

                    // if (latestFacialEmotionTupleOnSpeak){
                    //     current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'][`${transaction_pair_count}: user`] = latestFacialEmotionTupleOnSpeak[0]
                    // }

                    // likert_matched_response_index = await llmMatchResponse(cleaned_user_response, current_valid_user_responses)

                    // DEBUG
                    // likert_matched_response_index = null

                    // console.log('likert_matched_response_index:', likert_matched_response_index)

                    if (interventionFullStop) break

                    if (likert_matched_response_index != null) {
                        let response_score = current_scoring_categories[likert_matched_response_index]

                        console.log('response_score:', response_score)

                        current_questionnaire_dict['transactions'][`Q${j}`]['match_index'] = likert_matched_response_index
                        current_questionnaire_dict['transactions'][`Q${j}`]['response_match'] = response_match
                        current_questionnaire_dict['transactions'][`Q${j}`]['response_score'] = response_score

                        // console.log(`current_questionnaire_dict - 2: ${JSON.stringify(current_questionnaire_dict, null, 2)}`)

                        if (conversation_log['transcript']['questionnaires'][i] == undefined)
                            conversation_log['transcript']['questionnaires'].push(current_questionnaire_dict)
                        else
                            conversation_log['transcript']['questionnaires'][i] = current_questionnaire_dict

                        questionnaire_score += response_score
                        current_questionnaire_dict['total_questionnaire_score'] = questionnaire_score

                        console.log(`conversation_log: ${JSON.stringify(conversation_log, null, 2)}`)
                    }

                    // console.log(`current_questionnaire_dict - 1: ${JSON.stringify(current_questionnaire_dict, null, 2)}`)
                }

                transaction_pair_count += 1

                if (likert_matched_response_index == null) {
                    console.log('RESPONSE IS CANNOT BE MATCHED!')
                    console.log('CONTINUE WITH FOLLOWUP!')

                    let followup_question = await generateFollowUpQuestion(cleaned_user_response, current_question, current_target_question)

                    let followup_first_time = true

                    if (interventionFullStop) break

                    while (!is_response_relevant || (likert_matched_response_index == null)) {
                        if (followup_first_time) {
                            //changed-correct
                            await agentSpeak(followup_question, toast, false)
                            followup_first_time = false

                            current_question = followup_question
                        }
                        else {
                            //changed-correct
                            await agentSpeak(current_target_question, toast, false)

                            current_question = current_target_question
                        }

                        if (interventionFullStop) break

                        current_questionnaire_dict['transactions'][`Q${j}`]['responses'][`${transaction_pair_count}: agent`] = current_question

                        user_response = ''

                        while (!user_response) {
                            if (interventionFullStop) break

                            captureEmotionTrigger = true

                            // user_response = await captureUserResponse(toast, true)
                            //changed-correct
                            user_response = await captureUserResponseAzure(toast, false)

                            let user_response_timestamp = user_response.timestamp
                            console.log('user_response_timestamp:', user_response_timestamp)

                            captureEmotionTrigger = false
                            console.log('before - capturedEmotionsList:', capturedEmotionsList)

                            if (capturedEmotionsList.length > 0) {
                                latestFacialEmotionTupleOnSpeak = getLatestFacialEmotionTuple(user_response_timestamp)
                                console.log('latestFacialEmotionTupleOnSpeak:', latestFacialEmotionTupleOnSpeak)
                            }

                            capturedEmotionsList = []

                            console.log('after - capturedEmotionsList:', capturedEmotionsList)

                            user_response = user_response.text

                            console.log('user_response:', user_response)

                            if (interventionFullStop) break

                            if (!user_response) {
                                console.log('USER RESPONSE NOT PROVIDED!')

                                console.log('repeat_count - 2:', repeat_count)

                                if (repeat_count >= max_repeat_count) {
                                    repeat_count = 0

                                    // Allow user to move on to the next question.
                                    // await agentSpeak("Let's move on to the next question.", toast, true)
                                    // break

                                    // Terminate intervention due to exhausted attempts
                                    //changed-correct
                                    await agentSpeak("It seems you've used all your attempts to answer the current questions. Unfortunately, all questions must be answered as part of the intervention procedure to provide a valid evaluation. When you're ready to answer all the questions in the intervention, feel free to restart this module. Thank you for your time and participation.", toast, false)
                                    stop()
                                    return
                                }
                                else {
                                    repeat_count += 1
                                    //changed-correct
                                    let speak_text = "It seems I wasn't able to hear what you said. Let me repeat the question."
                                    await agentSpeak(speak_text, toast, false)
        
                                    await agentSpeak(current_question_question, toast, false)
        
                                    await agentSpeak(current_question_options, toast, false)
                                }
                            }

                            if (interventionFullStop) break
                        }

                        if (!user_response) {
                            break
                        }

                        // console.log(`current_questionnaire_dict - 1: ${JSON.stringify(current_questionnaire_dict, null, 2)}`)

                        await delay(500);

                        if (toastNotificationTrigger) {
                            toast({
                                title: 'eEVA Response',
                                description: 'Processing response. Please wait...',
                                status: 'warning',
                                duration: 0,
                                isClosable: false,
                            });
                        }

                        if (interventionFullStop) break

                        cleaned_user_response = cleanResponse(user_response)
                        console.log('cleaned_user_response:', cleaned_user_response)

                        current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: agent`] = ""
                        current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: user`] = ""

                        current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'][`${transaction_pair_count}: agent`] = ""
                        current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'][`${transaction_pair_count}: user`] = ""

                        current_questionnaire_dict['transactions'][`Q${j}`]['responses'][`${transaction_pair_count}: user`] = cleaned_user_response

                        // is_user_ok_answering_question = await checkUserOKAnsweringQuestion(cleaned_user_response, current_question)

                        // console.log('is_user_ok_answering_question:', is_user_ok_answering_question)

                        // if(!is_user_ok_answering_question){
                        //     await agentSpeak(`I understand if you prefer not to answer the current question. Let's move on to the next question.`)

                        //     break
                        // }

                        if (interventionFullStop) break

                        is_response_relevant = await checkResponseRelevancy(cleaned_user_response, current_question)

                        console.log("is_response_relevant:", is_response_relevant)

                        is_response_relevant_target = await checkResponseRelevancy(cleaned_user_response, current_target_question)

                        console.log("is_response_relevant_target:", is_response_relevant_target)

                        if (interventionFullStop) break

                        if (is_response_relevant || is_response_relevant_target) {
                            let agent_matched_text_emotion_response_index = await llmTextEmotionRecognition(current_question)
                            let user_matched_text_emotion_response_index = await llmTextEmotionRecognition(cleaned_user_response)

                            let agent_matched_text_emotion = universal_emotions_list[agent_matched_text_emotion_response_index]
                            let user_matched_text_emotion = universal_emotions_list[user_matched_text_emotion_response_index]

                            console.log(`agent_matched_text_emotion_${j}:`, agent_matched_text_emotion)
                            console.log(`user_matched_text_emotion:_${j}:`, user_matched_text_emotion)

                            current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: agent`] = agent_matched_text_emotion
                            current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: user`] = user_matched_text_emotion

                            if (latestFacialEmotionTupleOnSpeak) {
                                current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'][`${transaction_pair_count}: user`] = latestFacialEmotionTupleOnSpeak[0]
                            }


                            likert_matched_response_index = await llmMatchResponse(cleaned_user_response, current_valid_user_responses)

                            // DEBUG
                            // likert_matched_response_index = null

                            console.log('likert_match_response_index:', likert_matched_response_index)

                            if (interventionFullStop) break

                            if (likert_matched_response_index != null) {
                                let response_score = current_scoring_categories[likert_matched_response_index]

                                console.log('response_score:', response_score)

                                current_questionnaire_dict['transactions'][`Q${j}`]['match_index'] = likert_matched_response_index
                                current_questionnaire_dict['transactions'][`Q${j}`]['response_match'] = current_valid_user_responses[likert_matched_response_index]
                                current_questionnaire_dict['transactions'][`Q${j}`]['response_score'] = response_score

                                // console.log(`current_questionnaire_dict - 2: ${JSON.stringify(current_questionnaire_dict, null, 2)}`)

                                if (conversation_log['transcript']['questionnaires'][i] == undefined)
                                    conversation_log['transcript']['questionnaires'].push(current_questionnaire_dict)
                                else
                                    conversation_log['transcript']['questionnaires'][i] = current_questionnaire_dict

                                questionnaire_score += response_score
                                current_questionnaire_dict['total_questionnaire_score'] = questionnaire_score

                                console.log(`conversation_log: ${JSON.stringify(conversation_log, null, 2)}`)
                            }
                        }
                        if (likert_matched_response_index == null) {
                            console.log('RESPONSE IS NOT RELEVANT!')
                            console.log('is_response_relevant:', is_response_relevant)

                            console.log('repeat_count - 3:', repeat_count)

                            if (repeat_count >= max_repeat_count) {
                                repeat_count = 0

                                // Allow user to move on to the next question.
                                // await agentSpeak("Let's move on to the next question.", toast, true)
                                // break

                                // Terminate intervention due to exhausted attempts
                                //changed-correct
                                await agentSpeak("It seems you've used all your attempts to answer the current questions. Unfortunately, all questions must be answered as part of the intervention procedure to provide a valid evaluation. When you're ready to answer all the questions in the intervention, feel free to restart this module. Thank you for your time and participation.", toast, false)
                                stop()
                                return
                            }
                            else {
                                repeat_count += 1
                                //changed-correct
                                let speak_text = "May you please rephrase and elaborate your response? Let me repeat the question."

                                await agentSpeak(speak_text, toast, false)
        
                                await agentSpeak(current_question_question, toast, false)
        
                                await agentSpeak(current_question_options, toast, false)
                            }
                        }
                    }
                    break
                }
            }
            // transaction_pair_count += 1
        }
        //All questions for the current questionnaire have been answered here.
        if (!interventionFullStop) {
            //changed-correct
            await agentSpeak(`It appears you've answered all the questions from the ${questionnaire_name}. Let me evaluate your score.`, toast, false)
            //changed-correct
            await agentSpeak(`You've score a ${questionnaire_score} out of ${max_questionnaire_score}.`, toast, false)

            if (questionnaire_name == 'AUDIT questionnaire') {
                console.log('Evaluating AUDIT questionnaire score...')
                console.log('questionnaire_score:', questionnaire_score)
                switch (true) {
                    case questionnaire_score >= 0 && questionnaire_score <= 7:
                        //changed-correct
                        await agentSpeak('This means you fall under risk level 1 and are to be provided some alcohol education.', toast, false);
                        break;
                    case questionnaire_score >= 8 && questionnaire_score <= 15:
                        //changed-correct
                        await agentSpeak('This means you fall under risk level 2 and are to be provided some simple advice.', toast, false);
                        break;
                    case questionnaire_score >= 16 && questionnaire_score <= 19:
                        //changed-correct
                        await agentSpeak('This means you fall under risk level 3 and are to be provided some simple advice plus brief counseling and continued monitoring.', toast, false);
                        break;
                    case questionnaire_score >= 20:
                        //changed-correct
                        await agentSpeak('This means you fall under risk level 4 and are to be referred to a specialist for diagnostic evaluation and treatment.', toast, false);
                        break;
                }
            }
        }
    }
    //changed-correct
    await agentSpeak(`Ending intervention procedure.`, toast, false)
    bottomBoxText = ""
    updateBottomBoxText()
}

function getLatestFacialEmotionTuple(speech_response_timestamp) {
    let closestEmotion = null;
    let closestTimestampDiff = Infinity;  // Initialize with a large number to find the minimum difference

    // Loop through the captured emotions list
    for (let i = 0; i < capturedEmotionsList.length; i++) {
        const current_emotion_tuple = capturedEmotionsList[i];
        const current_timestamp = current_emotion_tuple[2]; // Assuming timestamp is at index 2

        // Calculate the absolute difference between the current emotion timestamp and the speech response timestamp
        const timestampDiff = Math.abs(current_timestamp - speech_response_timestamp);

        // Check if this emotion timestamp is closer than the previous closest
        if (timestampDiff < closestTimestampDiff) {
            closestTimestampDiff = timestampDiff;
            closestEmotion = current_emotion_tuple;
        }
    }

    return closestEmotion;
}

async function agentDrivenIntervention(toast, toastNotificationTrigger = false) {
    loadIntervention()
    initDataCapture()
    createBottomBox()

    let agent_greeting = intervention_dict['agent_greeting']
    //changed-correct
    await agentSpeak(intervention_dict['agent_greeting'], toast, false)

    // console.log('introduction:', intervention_dict['introduction'])
    //changed-correct
    await agentSpeak(intervention_dict['introduction'], toast, false)
   
    conversation_log['transcript']['introduction'] = `${agent_greeting} ${intervention_dict['introduction']}`

    let questionnaires = intervention_dict['questionnaires']

    let current_questionnaire_dict = {}

    for (let i = 0; i < questionnaires.length; i++) {
        if (interventionFullStop) break

        let current_questionnaire = questionnaires[i]

        let questionnaire_name = current_questionnaire['name']
        console.log('current_questionnaire:', questionnaire_name)

        current_questionnaire_dict['name'] = questionnaire_name
        current_questionnaire_dict['transactions'] = {}

        let max_questionnaire_score = current_questionnaire['max_score']

        let introduction = current_questionnaire['introduction']
        //changed-correct
        await agentSpeak(introduction, toast, false)
       
        let questions = current_questionnaire['questions']
        let valid_user_responses = current_questionnaire['response_categories']
        let valid_match_user_responses = current_questionnaire['response_categories_match']
        let scoring_categories = current_questionnaire['scoring_categories']

        console.log('questions:', questions)
        console.log('valid_user_responses', valid_user_responses)
        console.log('valid_match_user_responses:', valid_match_user_responses)
        console.log('scoring_categories:', scoring_categories)

        let questionnaire_score = 0

        current_questionnaire_dict['total_questionnaire_score'] = questionnaire_score

        for (let j = 0; j < questions.length; j++) {
            if (interventionFullStop) break

            let transaction_pair_count = 0

            let current_question = questions[j]
            let current_valid_user_responses = valid_user_responses[j]
            let current_valid_match_user_responses = valid_match_user_responses[j]
            let current_scoring_categories = scoring_categories[j]

            current_questionnaire_dict['transactions'][`Q${j}`] = {}

            current_questionnaire_dict['transactions'][`Q${j}`]['question'] = current_question

            current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'] = {}

            current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'] = {}

            current_questionnaire_dict['transactions'][`Q${j}`]['responses'] = {}

            let current_question_question = current_question

            let current_question_options = stringifyArray(current_valid_user_responses).toLowerCase().trim()

            current_question = `${current_question_question} ${current_question_options}`

            // current_question += (' ' + stringifyArray(current_valid_user_responses).toLowerCase().trim())

            //changed-correct
            await agentSpeak(current_question_question, toast, false)

            await agentSpeak(current_question_options, toast, false)

            current_questionnaire_dict['transactions'][`Q${j}`]['responses'][`${transaction_pair_count}: agent`] = current_question // 0th pair count, in this case, will always be the question being asked.
            current_questionnaire_dict['transactions'][`Q${j}`]['responses'][`${transaction_pair_count}: user`] = ""

            current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: agent`] = ""
            current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: user`] = ""

            current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'][`${transaction_pair_count}: agent`] = ""
            current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'][`${transaction_pair_count}: user`] = ""

            current_questionnaire_dict['transactions'][`Q${j}`]['user_valid_responses'] = current_valid_user_responses // 0th pair count, in this case, will always be the question being asked.
            current_questionnaire_dict['transactions'][`Q${j}`]['user_valid_match_responses'] = current_valid_match_user_responses

            let is_response_relevant = false
            let likert_matched_response_index = null
            let repeat_count = 0
            let max_repeat_count = 2

            while (!is_response_relevant || (likert_matched_response_index == null)) {
                if (interventionFullStop) break

                let user_response = ''

                while (!user_response) {
                    if (interventionFullStop) break

                    captureEmotionTrigger = true

                    // user_response = await captureUserResponse(toast, true)
                    //changed-correct
                    user_response = await captureUserResponseAzure(toast, false)

                    let user_response_timestamp = user_response.timestamp
                    console.log('user_response_timestamp:', user_response_timestamp)

                    captureEmotionTrigger = false
                    console.log('before - capturedEmotionsList:', capturedEmotionsList)

                    if (capturedEmotionsList.length > 0) {
                        latestFacialEmotionTupleOnSpeak = getLatestFacialEmotionTuple(user_response_timestamp)
                        console.log('latestFacialEmotionTupleOnSpeak:', latestFacialEmotionTupleOnSpeak)
                    }

                    capturedEmotionsList = []

                    console.log('after - capturedEmotionsList:', capturedEmotionsList)

                    user_response = user_response.text

                    console.log('user_response:', user_response)

                    if (interventionFullStop) break

                    if (!user_response) {
                        console.log('USER RESPONSE NOT PROVIDED!')
                        console.log('user_response:', user_response)

                        if (repeat_count >= max_repeat_count) {
                            repeat_count = 0

                            // Allow user to move on to the next question.
                            // await agentSpeak("Let's move on to the next question.", toast, true)
                            // break

                            // Terminate intervention due to exhausted attempts
                            //changed-correct
                            let speak_text = "It seems you've used all your attempts to answer the current questions. Unfortunately, all questions must be answered as part of the intervention procedure to provide a valid evaluation. When you're ready to answer all the questions in the intervention, feel free to restart this module. Thank you for your time and participation."
                            await agentSpeak(speak_text, toast, false)

                            stop()
                            return
                        }
                        else {
                            repeat_count += 1
                            //changed-correct

                            let speak_text = "It seems I wasn't able to hear what you said. Let me repeat the question."
                            await agentSpeak(speak_text, toast, false)

                            await agentSpeak(current_question_question, toast, false)

                            await agentSpeak(current_question_options, toast, false)
                        }
                    }

                    if (interventionFullStop) break
                }

                if (!user_response) {
                    break
                }

                // console.log(`current_questionnaire_dict - 1: ${JSON.stringify(current_questionnaire_dict, null, 2)}`)

                await delay(500);

                bottomBoxText = 'Processing response. Please wait...';
                updateBottomBoxText();

                if (toastNotificationTrigger) {
                    toast({
                        title: 'eEVA Response',
                        description: 'Processing response. Please wait...',
                        status: 'warning',
                        duration: 5000,
                        isClosable: false,
                    });
                }

                if (interventionFullStop) break

                let cleaned_user_response = cleanResponse(user_response)
                console.log('cleaned_user_response:', cleaned_user_response)

                current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: agent`] = ""
                current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: user`] = ""

                current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'][`${transaction_pair_count}: agent`] = ""
                current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'][`${transaction_pair_count}: user`] = ""

                current_questionnaire_dict['transactions'][`Q${j}`]['responses'][`${transaction_pair_count}: agent`] = current_question
                current_questionnaire_dict['transactions'][`Q${j}`]['responses'][`${transaction_pair_count}: user`] = cleaned_user_response

                is_response_relevant = await checkResponseRelevancy(cleaned_user_response, current_question)

                console.log("is_response_relevant:", is_response_relevant)

                if (interventionFullStop) break

                let acknowledgement_trigger = (j % 2 == 0) // Reflective listening on every odd question.

                if (is_response_relevant) {
                    // console.log('cleaned_user_response:', cleaned_user_response)
                    console.log('current_valid_match_user_responses', current_valid_match_user_responses)

                    likert_matched_response_index = await llmMatchResponse(cleaned_user_response, current_valid_match_user_responses)
                    console.log('likert_matched_response_index:', likert_matched_response_index)

                    let response_match = current_valid_match_user_responses[likert_matched_response_index]

                    if (interventionFullStop) break

                    let agent_matched_text_emotion_response_index = await llmTextEmotionRecognition(current_question)
                    let user_matched_text_emotion_response_index = await llmTextEmotionRecognition(cleaned_user_response)

                    let agent_matched_text_emotion = universal_emotions_list[agent_matched_text_emotion_response_index]
                    let user_matched_text_emotion = universal_emotions_list[user_matched_text_emotion_response_index]

                    console.log(`agent_matched_text_emotion_${j}:`, agent_matched_text_emotion)
                    console.log(`user_matched_text_emotion:_${j}:`, user_matched_text_emotion)

                    current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: agent`] = agent_matched_text_emotion
                    current_questionnaire_dict['transactions'][`Q${j}`]['text_emotions'][`${transaction_pair_count}: user`] = user_matched_text_emotion

                    if (latestFacialEmotionTupleOnSpeak) {
                        current_questionnaire_dict['transactions'][`Q${j}`]['facial_emotions'][`${transaction_pair_count}: user`] = latestFacialEmotionTupleOnSpeak[0]
                    }

                    transaction_pair_count += 1

                    if (interventionFullStop) break

                    if (likert_matched_response_index != null) {
                        if (interventionFullStop) break

                        // console.log('acknowledgment_trigger:', acknowledgement_trigger)

                        let rand_i = Math.floor(Math.random() * acknowledge_phrases.length)
                        let random_acknowledgement = acknowledge_phrases[rand_i]

                        if (acknowledgement_trigger) {
                            //changed-correct
                            await agentSpeak(`${random_acknowledgement}. Let's move on to the next question.`, toast, false)
                        }

                        let response_score = current_scoring_categories[likert_matched_response_index]

                        console.log('response_score:', response_score)

                        current_questionnaire_dict['transactions'][`Q${j}`]['match_index'] = likert_matched_response_index
                        current_questionnaire_dict['transactions'][`Q${j}`]['response_match'] = response_match
                        current_questionnaire_dict['transactions'][`Q${j}`]['response_score'] = response_score

                        // console.log(`current_questionnaire_dict - 2: ${JSON.stringify(current_questionnaire_dict, null, 2)}`)

                        if (conversation_log['transcript']['questionnaires'][i] == undefined)
                            conversation_log['transcript']['questionnaires'].push(current_questionnaire_dict)
                        else
                            conversation_log['transcript']['questionnaires'][i] = current_questionnaire_dict

                        questionnaire_score += response_score
                        current_questionnaire_dict['total_questionnaire_score'] = questionnaire_score

                        console.log(`conversation_log: ${JSON.stringify(conversation_log, null, 2)}`)
                    }
                    else {
                        console.log('LIKERT_MATCHED_RESPONSE_INDEX NOT PRODUCED!')
                        console.log('likert_matched_response_index:', likert_matched_response_index)

                        if (repeat_count >= max_repeat_count) {
                            repeat_count = 0

                            // Allow user to move on to the next question.
                            // await agentSpeak("Let's move on to the next question.", toast, true)
                            // break

                            // Terminate intervention due to exhausted attempts
                            //changed-correct
                            let speak_text = "It seems you've used all your attempts to answer the current questions. Unfortunately, all questions must be answered as part of the intervention procedure to provide a valid evaluation. When you're ready to answer all the questions in the intervention, feel free to restart this module. Thank you for your time and participation."

                            await agentSpeak(speak_text, toast, false)

                            stop()
                            return
                        }
                        else {
                            repeat_count += 1
                            //changed-correct
                            let speak_text = "May you please rephrase and elaborate your response? Let me repeat the question."

                            await agentSpeak(speak_text, toast, false)

                            await agentSpeak(current_question_question, toast, false)

                            await agentSpeak(current_question_options, toast, false)
                        }
                    }
                }
                else {
                    console.log('RESPONSE IS NOT RELEVANT!')
                    console.log('is_response_relevant:', is_response_relevant)

                    if (repeat_count >= max_repeat_count) {
                        repeat_count = 0

                        // Allow user to move on to the next question.
                        // await agentSpeak("Let's move on to the next question.", toast, true)
                        // break

                        // Terminate intervention due to exhausted attempts
                        //changed-correct
                        let speak_text = "It seems you've used all your attempts to answer the current questions. Unfortunately, all questions must be answered as part of the intervention procedure to provide a valid evaluation. When you're ready to answer all the questions in the intervention, feel free to restart this module. Thank you for your time and participation."

                        await agentSpeak(speak_text, toast, false)

                        stop()
                        return
                    }
                    else {
                        repeat_count += 1
                        //changed-correct
                        let speak_text = "May you please rephrase and elaborate your response? Let me repeat the question."

                        await agentSpeak(speak_text, toast, false)

                        await agentSpeak(current_question_question, toast, false)

                        await agentSpeak(current_question_options, toast, false)
                    }
                }

                if (interventionFullStop) break
            }
        }

        if (!interventionFullStop) {
            //changed-correct
            await agentSpeak(`It appears you've answered all the questions from the ${questionnaire_name}. Let me evaluate your score.`, toast, false)
            //changed-correct
            await agentSpeak(`You've score a ${questionnaire_score} out of ${max_questionnaire_score}.`, toast, false)

            if (questionnaire_name == 'AUDIT questionnaire') {
                console.log('Evaluating AUDIT questionnaire score...')
                console.log('questionnaire_score:', questionnaire_score)
                switch (true) {
                    case questionnaire_score >= 0 && questionnaire_score <= 7:
                        //changed-correct
                        await agentSpeak('This means you fall under risk level 1 and are to be provided some alcohol education.', toast, false);
                        break;
                    case questionnaire_score >= 8 && questionnaire_score <= 15:
                        await agentSpeak('This means you fall under risk level 2 and are to be provided some simple advice.', toast, false);
                        break;
                    case questionnaire_score >= 16 && questionnaire_score <= 19:
                        //changed-correct
                        await agentSpeak('This means you fall under risk level 3 and are to be provided some simple advice plus brief counseling and continued monitoring.', toast, false);
                        break;
                    case questionnaire_score >= 20:
                        //changed-correct
                        await agentSpeak('This means you fall under risk level 4 and are to be referred to a specialist for diagnostic evaluation and treatment.', toast, false);
                        break;
                }
            }
        }
    }
    if (!interventionFullStop) {
        //changed-correct
        await agentSpeak(`It seems we've covered all the questionnaires.`, toast, false)
    }
    //changed-correct
    await agentSpeak(`Ending intervention procedure.`, toast, false)
    bottomBoxText = ""
    updateBottomBoxText()
}

async function startProcedure(toast) {
    console.log('IN START PROCEDURE!')
    console.log('activeListeningTrigger:', activeListeningTrigger)

    interventionFullStop = false

    // Use this to demo the tech stack.
    // userDrivenDemo()

    await delay(3000)

    if (activeListeningTrigger == true) {
        console.log('RUNNING ACTIVE LISTENING AGENT DRIVEN INTERVENTION!!!')

        toast({
            title: 'eEVA Procedure',
            description: 'RUNNING ACTIVE LISTENING AGENT DRIVEN INTERVENTION!!!',
            status: 'success',
            duration: 0,
            isClosable: false,
        });
        //changed-correct
        activeListeningAgentDrivenIntervention(toast, false)
    }
    else {
        console.log('RUNNING AGENT DRIVEN INTERVENTION!!!')

        toast({
            title: 'eEVA Procedure',
            description: 'RUNNING AGENT DRIVEN INTERVENTION!!!',
            status: 'success',
            duration: 0,
            isClosable: false,
        });
        //changed-correct
        agentDrivenIntervention(toast, false)
    }
}

function saveJSON(json_dict) {
    // Sample JSON object
    const data = json_dict

    // Convert JSON object to string
    const jsonData = JSON.stringify(data);

    // Create a Blob object from the JSON string
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a link element
    const link = document.createElement('a');

    // Set the download attribute with the desired file name
    link.download = 'data.json';

    // Create an object URL for the Blob
    link.href = window.URL.createObjectURL(blob);

    // Programmatically click the link to trigger the download
    link.click();
}

function initAzure(animationManager, settings) {
    // Azure Key
    console.log('azure key object:', settings.azure_api_key)
    console.log('azure key object type:', typeof settings.azure_api_key)
    console.log('azure key default:', settings.azure_api_key.default)

    // Initialize SpeechManager object
    if (settings.azure_api_key && typeof settings.azure_api_key == 'string') {
        speechManager = new SpeechManager(animationManager, settings.azure_api_key, 'eastus')
    }
    else {
        speechManager = new SpeechManager(animationManager, settings.azure_api_key.default, 'eastus')
    }
}

function setFace(au_data) {
    // Extrapolated from AnimationManager.js
    au_data.forEach(({ id, intensity, duration, explanation = "" }) => {
        animationManager.scheduleChange(id, intensity * 90, duration, 0, explanation);
    });
}

function setHeadToFaceUser() {
    let au_data = [
        {
            "id": "51",
            "intensity": 0.12222222222222222,
            "duration": 750,
            "explanation": ""
        },
        {
            "id": "53",
            "intensity": 0.06666666666666667,
            "duration": 750,
            "explanation": ""
        },
        {
            "id": "55",
            "intensity": 0.16666666666666666,
            "duration": 750,
            "explanation": ""
        }
    ]

    setFace(au_data = au_data)
}

function neutralFace(skipList = [], smoothTime = 0.5) {
    // animationManager.setFaceToNeutral()

    console.log('skipList:', skipList)

    // Set all AUs to neutral positions.
    ActionUnitsList.forEach((AU) => {
        console.log('current AU.id:', AU.id)
        if (skipList.includes(AU.id)) {
            console.log('skipping AU.id:', AU.id)
            return
        }
        //   animationManager.scheduleChange(AU.id, 0, 750, 0, "");
        animationManager.applyAUChange(AU.id, 0, 0, "", smoothTime, "")
    });
    // Set all visemes to neutral positions.
    VisemesList.forEach((viseme) => {
        animationManager.scheduleVisemeChange(viseme.id, 0, 750);
    });

    setHeadToFaceUser()
}

async function headNodAffirmation() {
    neutralFace(["45", "51", "53", "55"])

    await (delay(1000))

    animationManager.applyAUChange("54", 15, 0, "", 2, "") //headDownAffirmation

    await (delay(1000))

    neutralFace(["45", "51", "53", "55"], 3)
}

function startBlinking(animationManager) {
    // Clear any existing interval to avoid overlapping blinks
    if (blinkInterval) {
        clearInterval(blinkInterval);
    }

    // Set up the blink interval
    blinkInterval = setInterval(() => {
        // Close eyes
        animationManager.scheduleChange("45", 200, 100, 0); // Close eyes
        // Open eyes after 200ms delay (after the close animation)
        setTimeout(() => animationManager.scheduleChange("45", 0, 100, 0), 600); // Open300 eyes
    }, blinkSpeed + 400);
}

async function start(animationManager, settings, containerRef) {
    console.clear()

    console.log('Calling start!')

    neutralFace(["45", "51", "53", "55"])

    if (blinkInterval) {
        clearInterval(blinkInterval);
    }

    if (!containerRef || !containerRef.current) {
        console.error('Invalid container reference');
        return;
    }

    if (!root) {
        root = ReactDOMClient.createRoot(containerRef.current);
    }

    recognitionStop = false

    console.log('settings:', settings)

    activeListeningTrigger = settings.active_listening_trigger;

    // Debug of latest FER detection.
    // monitorFER()

    initAzure(animationManager, settings)

    const MyComponent = () => {
        const toast = useToast()

        enableFER(animationManager, settings, root)
        startBlinking(animationManager)
        startProcedure(toast)
    }

    root.render(<MyComponent />);
}

function stop(animationManager, settings, containerRef) {
    console.log('Calling stop!')

    stopFER(animationManager, settings, containerRef)

    bottomBoxText = ""
    updateBottomBoxText()

    if (blinkInterval) {
        clearInterval(blinkInterval);
    }

    if (recognitionAvailable) {
        recognitionStop = true
        recognition.stop()
        console.log("speech recognition stopped!")
    }

    interventionFullStop = true
}

export { start, stop }

//Shamim implemented
function createBottomBox() {
    if (!document.getElementById("bottomBox")) {
        const box = document.createElement("div");
        box.id = "bottomBox";
        box.style.position = "fixed";
        box.style.bottom = "20px"; // Adjust distance from the bottom
        box.style.left = "50%"; // Center horizontally
        box.style.transform = "translateX(-50%)"; // Center horizontally
        box.style.width = "80%"; // Adjust width
        box.style.backgroundColor = "#333";
        box.style.color = "#fff";
        box.style.padding = "8px";
        box.style.textAlign = "center";
        box.style.zIndex = "1000";
        box.style.fontSize = "18px";
        box.style.borderRadius = "8px"; // Optional: Rounded corners
        document.body.appendChild(box);
    }
}

function updateBottomBoxText() {
    const box = document.getElementById("bottomBox");
    if (box) {
        if (bottomBoxText.trim() === "") {
            box.innerText = ""; // Clear the text but keep the box visible
            box.style.opacity = "0.5"; // Dim the box to indicate no active content
        } else {
            box.innerText = bottomBoxText; // Update the text from the global variable
            box.style.opacity = "1"; // Restore full opacity
        }
    }
}
