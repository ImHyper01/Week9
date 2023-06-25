const predictButton = document.getElementById('predictBtn').addEventListener("click", function() {makePrediction()});
const typeOneInput = document.getElementById('type1');
const typeTwoInput = document.getElementById('type2');
const attackInput = document.getElementById('Attack');
const defenseInput =document.getElementById('Defense');

const nn = ml5.neuralNetwork({ task: 'regression', debug: true })
nn.load('./model/model.json', modelLoaded)

function modelLoaded() {
    console.log("Model loaded!")
}

async function makePrediction() {
    const predictionValues = {
        typeOne: parseInt(typeOneInput.value, 10),
        typeTwo: parseInt(typeTwoInput.value, 10),
        Attack: parseInt(attackInput.value, 10),
        Defense: parseInt(defenseInput.value, 10)
    }

    const results = await nn.predict(predictionValues);
    console.log(`De pokemon is ${results[0].Name}`)

    
}