import { createChart, updateChart } from "./scatterplot.js"

function loadData() {
    Papa.parse("./data/Pokemon.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => checkData(results.data)
    })
}

function checkData(data) {
    data.sort(() => (Math.random() - 0.5))
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    const chartdata = trainData.map(pokemon => ({
        x: pokemon.type1,
        y: pokemon.type2,
        z: pokemon.Attack,
        w: pokemon.Defense,
        label: pokemon.Name,
    }))

    console.log(chartdata)

    createChart(chartdata, "Type 1", "Type 2", "Attack", "Defense", "Name")
    neuralNetwork(trainData, testData);
}

async function neuralNetwork(trainData, testData) {
    const nn = ml5.neuralNetwork({ task: 'regression', debug: true })

    for (let pokemon of trainData) {
        nn.addData(
            { type1: pokemon.type1, type2: pokemon.type2, Attack: pokemon.Attack, Defense: pokemon.Defense },
            { Name: pokemon.Name }
        )
    }

    nn.normalizeData()
    nn.train({ epochs: 10 }, () => finishedTraining(nn, testData))

    async function finishedTraining(nn, testData) {
        console.log("Finished training!")

        await nn.save()
        makePrediction(nn, testData)
    }

    async function makePrediction(nn, testData) {
        const pokemonTest = {
            type1: testData[0].type1,
            type2: testData[0].type2,
            Attack: testData[0].Attack,
            Defense: testData[0].Defense
        }
        const results = await nn.predict(pokemonTest)
        console.log(`The name of the pokemon is: ${results[0].Name}`)

        let predictions = []
        for (let i = 0; i < testData.length; i += 1) {
            const prediction = await nn.predict({
                type1: testData[i].type1,
                type2: testData[i].type2,
                Attack: testData[i].Attack,
                Defense: testData[i].Defense
            })
            predictions.push({
                x: testData[i].type1,
                y: testData[i].type2,
                z: testData[i].Attack,
                w: testData[i].Defense,
                label: prediction[0].Name
            })
        }

        updateChart("Predictions", predictions)
    }
}

// load data
loadData();
