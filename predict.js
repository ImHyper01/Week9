const predictButton = document.getElementById('predictBtn').addEventListener("click", function() {makePrediction()});
const yearsExperienceInput = document.getElementById('YearsExperience');
const resultField =document.getElementById('result');

const nn = ml5.neuralNetwork({ task: 'regression', debug: true })
nn.load('./model/model.json', modelLoaded)

function modelLoaded() {
    console.log("Model loaded!")
}

async function makePrediction() {
    const predictionValues = {
        YearsExperience: parseInt(yearsExperienceInput.value),
    }

    const results = await nn.predict(predictionValues);
    console.log(`Het salaris is ${results[0].Salary}`)

    currencyTransformer(results[0].Salary);

}

function currencyTransformer(result) {
    const fmt = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
    resultField.innerHTML = "Het salaris is " + fmt.format(result);
}


