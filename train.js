import { createChart, updateChart } from "./scatterplot.js"

let nn

function loadData(){
    Papa.parse("./data/Pokemon.csv", {
        download:true,
        header:true, 
        dynamicTyping:true,
        complete: results => checkData(results.data)
    })
}

function checkData(data) {
    data.sort(() => (Math.random() - 0.5))
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

const chartdata = trainData.map(pokemon => ({
        x: pokemon.Type1,
        x: pokemon.Type2,
        x: pokemon.Attack,
        x: pokemon.Defense,
        y: pokemon.Name,
}))

console.log(chartdata)

createChart(chartdata, "Type1", "Type2", "Attack", "Defense", "Name")
neuralNetwork(trainData, testData);
}

function neuralNetwork(trainData, testData) {

    nn = ml5.neuralNetwork({ task: 'regression', debug: true })

    for (let pokemon of trainData) {
        nn.addData({Type1: pokemon.Type1, Type2: pokemon.Type2, Attack: pokemon.Attack, Defense: pokemon.Defense}, {Name: pokemon.Name})
    }

    nn.normalizeData()
    nn.train({ epochs: 10 }, () => finishedTraining(nn, testData))
}

async function finishedTraining(nn, testData){
    console.log("Finished training!")

    
    makePrediction(nn, testData);
    
}

function save(){
    nn.save()
}

async function makePrediction(nn, testData) {
    const pokemonTest = {Type1: testData[0].Type1, Type2: testData[0].Type2, Attack: testData[0].Attack, Defense: testData[0].Defense}
    const results = await nn.predict(pokemonTest);
    console.log(`De naam of de pokemon is: ${results[0].Name}`)

    let predictions = []
    for (let i = 0; i < testData.length; i += 1) {
        const prediction = await nn.predict({Type1: testData[i].Type1, Type2: testData[i].Type2, Attack: testData[i].Attack, Defense: testData[i].Defense})
        prediction.push({x: testData[i].Type1, x: testData[i].Type2,  x: testData[i].Attack,  x: testData[i].Defense, y: prediction[0].Name})
    }

    updateChart("Predictions", predictions)
    
}


// load data
loadData();
