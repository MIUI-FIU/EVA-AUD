import { AudioConfig, PropertyId, ResultReason, SpeakerAudioDestination, SpeechConfig, SpeechRecognizer, SpeechSynthesizer } from "microsoft-cognitiveservices-speech-sdk";

class SpeechManager {
    constructor(animationManager, apiKey, region) {
        this.animationManager = animationManager;
        this.apiKey = apiKey,
        this.region = region,
        this.queue = [];
        this.isSpeaking = false;
        this.audioInterrupt = false;

        this.speechConfig = SpeechConfig.fromSubscription(this.apiKey, this.region)

        // Initialize synthesizer
        this.initSynthesizer();
    }

    recognizeSpeechUntilSilence() {
        return new Promise((resolve, reject) => {
            const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
            const recognizer = new SpeechRecognizer(this.speechConfig, audioConfig);
    
            let recognizedText = '';
            let silenceTimer = null;
            const silenceThreshold = 3000; // Silence threshold in milliseconds (3 seconds)
            let finalRecognitionTimestamp = null; // To store the timestamp of the final recognition event
            
            // Start the silence timer immediately
            silenceTimer = setTimeout(() => {
                console.log('Silence detected (before recognition), stopping recognition...');
                recognizer.stopContinuousRecognitionAsync(() => {
                    resolve({
                        text: recognizedText.trim(), 
                        timestamp: finalRecognitionTimestamp
                    }); // Resolve with any recognized text (may be empty if no recognition)
                });
            }, silenceThreshold);
    
            // Handle partial results
            recognizer.recognizing = (s, e) => {
                console.log('Recognizing event triggered');
                console.log(`Partial result: ${e.result.text}`);
                
                // If there's speech, reset the silence timer
                clearTimeout(silenceTimer);
                silenceTimer = setTimeout(() => {
                    console.log('Silence detected during recognition, stopping...');
                    recognizer.stopContinuousRecognitionAsync(() => {
                        resolve({
                            text: recognizedText.trim(),
                            timestamp: finalRecognitionTimestamp
                        }); // Resolve with the recognized text and timestamp
                    });
                }, silenceThreshold);
            };
    
            // Handle final recognition results
            recognizer.recognized = (s, e) => {
                console.log('Recognized event triggered');
                if (e.result.reason === ResultReason.RecognizedSpeech) {
                    console.log(`Final result: ${e.result.text}`);
                    recognizedText += e.result.text + ' ';
                    finalRecognitionTimestamp = Date.now(); // Capture the timestamp of the final result
                } else if (e.result.reason === ResultReason.NoMatch) {
                    console.log('No match found.');
                }
            };
    
            // Handle cancellation events (e.g., when the recognition is interrupted)
            recognizer.canceled = (s, e) => {
                console.error('Canceled event triggered');
                console.error(`Recognition canceled: ${e.reason}`);
                recognizer.stopContinuousRecognitionAsync(() => {
                    reject(new Error(`Recognition canceled: ${e.reason}`));
                });
            };
    
            // Handle session stopped event (e.g., when recognition ends)
            recognizer.sessionStopped = (s, e) => {
                console.log('Session stopped due to silence');
                recognizer.stopContinuousRecognitionAsync(() => {
                    resolve({
                        text: recognizedText.trim(), 
                        timestamp: finalRecognitionTimestamp
                    }); // Return the accumulated text and final timestamp
                });
            };
    
            console.log('Starting continuous recognition...');
            recognizer.startContinuousRecognitionAsync(
                () => console.log('Recognition started successfully'),
                (err) => {
                    console.error('Error starting recognition:', err);
                    reject(err);
                }
            );
        });
    }
    
    initSynthesizer() {
        this.speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

        const player = new SpeakerAudioDestination();;
        const audioConfig = AudioConfig.fromSpeakerOutput(player);

        this.synthesizer = new SpeechSynthesizer(this.speechConfig, audioConfig);

        this.synthesizer.visemeReceived = (s, e) => {
            this.scheduleVisemeApplication(e.visemeId, e.audioOffset);
        };
    }

    enqueueText(text) {
        this.queue.push(text);
        if (!this.isSpeaking) {
            this.processQueue();
        }
    }

    processQueue() {
        if (this.queue.length === 0) {
            this.isSpeaking = false;
            return;
        }

        this.isSpeaking = true;
        const text = this.queue.shift();
        this.synthesizeSpeech(text).then(() => this.processQueue());
    }

    synthesizeSpeech(text) {
        return new Promise((resolve, reject) => {
            this.synthesizer.speakTextAsync(text,
                result => {
                    console.log("Speech synthesis completed.");
                    resolve(result);
                },
                error => {
                    console.log("Error during speech synthesis, restarting");
                    reject(error);
                });
        });
    }

    scheduleVisemeApplication(visemeId, audioOffset) {
        const offsetInMilliseconds = audioOffset / 10000;
        setTimeout(() => {
            this.applyVisemeToCharacter(visemeId);
        }, offsetInMilliseconds);
    }

    applyVisemeToCharacter(visemeId) {
        const facsLib = this.animationManager.facsLib;
        // console.log('audioInterrupt:', this.audioInterrupt)
        if (!this.audioInterrupt){
            if (visemeId === 0) {
                facsLib.setNeutralViseme(0.0);
            } else {
                visemeId -= 1;
                facsLib.setTargetViseme(visemeId, 70, 0);
            }
        }
        else{
            this.animationManager.setFaceToNeutral()
            facsLib.setNeutralViseme()
        }

        facsLib.updateEngine();
    }

    stopSpeech() {
        // Dispose of the current synthesizer to stop speech
        this.synthesizer.close();

        // Clear the queue and reset the speaking state
        this.queue = [];
        this.isSpeaking = false;

        // Reinitialize the synthesizer for future use
        this.initSynthesizer();

        console.log("Speech synthesis stopped.");
    }

    interruptSpeech(text) {
        // Dispose of the current synthesizer to stop speech
        this.synthesizer.close();

        // Clear the queue, reset the speaking state, and reinitialize the synthesizer
        this.queue = [];
        this.isSpeaking = false;
        this.initSynthesizer();

        if (text) {
            this.enqueueText(text); // Enqueue and play the new text
        }

        console.log("Speech synthesis interrupted.");
    }
}

export default SpeechManager;
