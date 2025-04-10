let face_interrupt = false;

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

function setFace(au_data){
    // Extrapolated from AnimationManager.js
    au_data.forEach(({ id, intensity, duration, explanation = "" }) => {
        animationManager.scheduleChange(id, intensity * 90, duration, 0, explanation);
    });
}

function neutralFace(){
    animationManager.setFaceToNeutral()
}

function happyFace(){
    let au_data = [
        {
          "id": "6",
          "intensity": 1.1111111111111112,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "12",
          "intensity": 1.1111111111111112,
          "duration": 750,
          "explanation": ""
        }
    ]

    setFace(au_data=au_data)
}

function contemptFace(){
    let au_data = [
        {
          "id": "12L",
          "intensity": 0.8333333333333334,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "14L",
          "intensity": 0.8333333333333334,
          "duration": 750,
          "explanation": ""
        }
      ]

    setFace(au_data=au_data)
}

function fearFace(){
    
    let au_data = [
        {
          "id": "1",
          "intensity": 1.1111111111111112,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "2",
          "intensity": 1.1111111111111112,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "4",
          "intensity": 1.1111111111111112,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "5",
          "intensity": 1.1111111111111112,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "20",
          "intensity": 1,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "25",
          "intensity": 0.5555555555555556,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "26",
          "intensity": 0.5555555555555556,
          "duration": 750,
          "explanation": ""
        }
    ]

    setFace(au_data=au_data)
}

function shameFace(){
    let au_data = [
        {
          "id": "4",
          "intensity": 1.1111111111111112,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "12",
          "intensity": 0.2,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "24",
          "intensity": 0.6666666666666666,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "54",
          "intensity": 0.28888888888888886,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "64",
          "intensity": 0.3111111111111111,
          "duration": 750,
          "explanation": ""
        }
    ]

    setFace(au_data=au_data)
}

function sadnessFace(){
    let au_data = [
        {
          "id": "1",
          "intensity": 1.1111111111111112,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "4",
          "intensity": 1.1111111111111112,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "6",
          "intensity": 1.1111111111111112,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "11",
          "intensity": 0.1111111111111111,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "15",
          "intensity": 0.6333333333333333,
          "duration": 750,
          "explanation": ""
        }
    ]

    setFace(au_data=au_data)
}

function furiousFace(){
    let au_data = [
        {
          "id": "4",
          "intensity": 1.1111111111111112,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "5",
          "intensity": 1.1111111111111112,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "7",
          "intensity": 1.1111111111111112,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "10",
          "intensity": 0.4666666666666667,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "17",
          "intensity": 0.5555555555555556,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "23",
          "intensity": 0.5555555555555556,
          "duration": 750,
          "explanation": ""
        },
        {
          "id": "24",
          "intensity": 0.3333333333333333,
          "duration": 750,
          "explanation": ""
        }
    ]

    setFace(au_data=au_data)
}

async function cycleFaces(face_list, settings) {
    for (const face of face_list) {
        if (face_interrupt){
            break;
        }
        face()             
        await sleep(3000)
        neutralFace()
    }

    if(settings.looping && !face_interrupt){
        cycleFaces(face_list=face_list, settings=settings)
    }
  }

async function start(_, settings) {
    face_interrupt = false;

    let face_list = [
        happyFace,
        contemptFace,
        fearFace,
        shameFace,
        sadnessFace,
        furiousFace,
    ]

    cycleFaces(face_list=face_list, settings=settings)
}
function stop() {
    face_interrupt = true;

    neutralFace()
}

export { start, stop };