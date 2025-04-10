const modulesConfig = {
  // Default modules
  // modules: [
  //   {
  //     name: "Blink",
  //     description: "This app controls the blinking speed of the avatar.",
  //     path: "blink",
  //     settings: {
  //       speed: {
  //         name: "speed",
  //         type: "number",
  //         default: 2000,
  //         min: 500,
  //         max: 5000,
  //         description: "Speed of blinking in milliseconds",
  //       },
  //     },
  //   },
  //   {
  //     name: "Close Eyes",
  //     description: "This app controls the blinking speed of the avatar.",
  //     path: "myApp",
  //   },
  //   {
  //     name: "Chat",
  //     description: "This app handles voice chat using GPT and voice synthesis.",
  //     path: "chat",
  //     settings: {
  //       apiKey: {
  //         name: "apiKey",
  //         type: "text",
  //         default: "fdasf",
  //         description: "API key for the chat application",
  //       },
  //       triggerPhrases: {
  //         name: "triggerPhrases",
  //         type: "text",
  //         default: "Hey GPT",
  //         description: "Trigger phrases to activate chat",
  //       },
  //     },
  //   },
  //   {
  //     name: "Face Detection",
  //     description: "This app enables face detection using the webcam.",
  //     path: "faceDetectionApp",
  //   },
  //   {
  //     name: "French Vocabulary Quiz",  // Add the new quiz module here
  //     description: "A quiz that asks questions in French and expects answers in English.",
  //     path: "frenchVocabularyQuiz",  // The path to the module
  //   },
  //   // Add other apps as necessary
  // ],
  modules: [
    // {
    //   name: "EmotionCycle",
    //   description: "This module cycles through common FACS emotions.",
    //   path: "emotionCycle",
    //   settings:{
    //     looping: true,
    //   }
    // },
    // {
    //   name:"eEVASimpleDialog",
    //   description: "This module does agent initiated QA with an LLM based on provided questions.",
    //   path: "evaSimpleDialog",
    //   settings: {
    //     azure_api_key: {
    //       name: 'Azure API Key',
    //       type: 'password',
    //       default: '',
    //       description: 'Azure API Key'
    //     },
    //     openai_api_key: {
    //       name: 'OpenAI API Key',
    //       type: 'password',
    //       default: '',
    //       description: 'OpenAI API Key'
    //     },
    //   }
    // },
    // {
    //   name: "eEVALLM",
    //   description: "This module does free-form QA with an LLM for a number of turns.",
    //   path: "evaLLM",
    //   settings: {
    //     num_prompts: 5,
    //     azure_api_key: {
    //       name: 'Azure API Key',
    //       type: 'password',
    //       default: '',
    //       description: 'Azure API Key'
    //     },
    //     openai_api_key: {
    //       name: 'OpenAI API Key',
    //       type: 'password',
    //       default: '',
    //       description: 'OpenAI API Key'
    //     },
    //   }
    // },
    // {
    //   name: "Face Detection",
    //   description: "This app enables face detection using the webcam.",
    //   path: "faceDetectionApp",
    // },
    {
      name: "MI LLM",
      description: "This app performs active listening utilizing within the context of an MI intervention.",
      path: "miLLM",
      settings: {
        azure_api_key: {
          name: 'Azure API Key',
          type: 'password',
          default: '',
          description: 'Azure API Key'
        },
        active_listening_trigger: {
          name: 'Active Listening Trigger',
          type: 'boolean',
          default: 'false',
          description: 'Active Listening Trigger'
        }
      }
    },
  ]
};

export default modulesConfig;