import { createChart, updateChart } from "./scatterplot.js"

let nn

function loadData(){
    Papa.parse("./data/salaryDataset.csv", {
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

const chartdata = trainData.map(years => ({
      x: years.YearsExperience,
      y: years.Salary
}))

console.log(chartdata)

createChart(chartdata, "YearsExperience", "Salary")

neuralNetwork(trainData, testData);
}

function neuralNetwork(trainData, testData) {

    nn = ml5.neuralNetwork({ task: 'regression', debug: true })

    for (let years of trainData) {
        nn.addData({YearsExperience: years.YearsExperience}, {Salary: years.Salary})
    }

    nn.normalizeData()
    nn.train({ epochs: 10 }, () => finishedTraining(nn, testData))
}

function finishedTraining(nn, testData){
    console.log("Finished training!")

    makePrediction(nn, testData);
    nn.save()
   
}

async function makePrediction(nn, testData) {
    const salaryTest = {YearsExperience: testData[0].YearsExperience}
    const results = await nn.predict(salaryTest);
    console.log(`Het aantal salaris is ${results[0].Salary}`)

    let predictions = []
    for (let i = 0; i < testData.length; i += 1) {
        const prediction = await nn.predict({})
        prediction.push({x: testData[0].YearsExperience, y: prediction[0].Salary})
    }

    updateChart("Predictions", predictions)
    
}



// load data
loadData();
