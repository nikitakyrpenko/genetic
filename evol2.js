function Toolbox() {
    this.genIndv = function() {};
    this.getFitness = function() {};
    this.mutate = function() {};
    this.goalFitness = Toolbox.fitnessMax;
    this.mutAmount = function(){};
    this.len = 0;
};

Toolbox.fitnessMax = 1;
Toolbox.fitnessMin = -1;

function GeneticAlgorithm(toolbox, popSize, mutProb, breedFunction, verbose = false) {

    checkConstructorVars(toolbox, popSize, mutProb, breedFunction);

    function checkConstructorVars(toolbox, popsize, mutProb, breedFunction) {
        if(toolbox === undefined) {
            throw 'Toolbox must be defined';
        }

        if(popSize === undefined) {
            throw 'Population size must be defined';
        }

        if (popSize <= 2) {
            throw 'Population size must be greater than 2. Current size: ' + popSize;
        }

        if(mutProb === undefined) {
            throw 'Mutability probability must be defined';
        }

        if(breedFunction === undefined) {
            throw 'Breed function must be defined';
        }
    };

    

    this.evolve = function(generations) {
        let population = this.generatePopulation(popSize, toolbox.len);
        population = this.getFitness(population, toolbox.getFitness);

        for(let i =0; i < popSize; i++){
             console.log("INDIVID"+ population[i].individual);
             console.log("FITNESS IS "+population[i].fitness);
        }
       let mutationInd = toolbox.mutAmount;
        console.log("NEUTRAL "+mutationInd.neutral);
        console.log("PATOHENIC "+mutationInd.patohenic);

        

        for (var i = 0; i < generations; i++) {
//            population = this.getFitness(population, toolbox.getFitness);
//            population = this.sortByFitness(population, toolbox.getFitness, toolbox.goalFitness);

            if (verbose) printUpdate(population, i);
            population = breed(population, toolbox.mutate, mutProb, breedFunction, mutationInd);
        }
//        population = this.sortByFitness(population, toolbox.getFitness, toolbox.goalFitness);
//        if (verbose) printUpdate(population, generations);

        let results = getResults(population, generations);
        return results;
    };


    // Generate a population with the given individual 
    // generation strategy and population size
    this.generatePopulation = function(popSize, l) {
        let pop = [];
        for (var i = 0; i < popSize; i++) {
            let generInd = generateIndividual(l);
            let indv = { individual: generInd}
            pop.push(indv);
        }
        return pop;
    };

    this.getFitness = function(population, getFitness) {
        for (var i = 0; i < population.length; i++){
            let indv = population[i];
            indv.fitness = getFitness(indv.individual);
            population[i] = indv;
        }
        return population;
    }

    // Sort the population array
    this.sortByFitness = function(population, getFitness, goalFitness) {
        population.sort(function(a, b) {
            return (b.fitness - a.fitness) * goalFitness;
        });
        return population;
    };

    // breed population and apply mutation if probability met
    function breed(population, mutate, mutProb, breedFunction, mutationInd) {

        // Select best individuals and remove bottom half of population
//        let breeders = Math.round(population.length / 2);
         let newPopulation = [];

        // Select parents
        while (newPopulation.length != population.length) {
            let parentAIndex = Math.floor(Math.random() * population.length);
            let parentBIndex = Math.floor(Math.random() * population.length);

            while (parentAIndex == parentBIndex) {
                parentBIndex = Math.floor(Math.random() * population.length);
            }

//            let parentA = population[parentAIndex].individual;
//            let parentB = population[parentBIndex].individual;
//            
//            let parentAfit = population[parentAIndex].fitness;
//            let parentBfit = population[parentBIndex].fitness;
//            console.log(parentBfit+ "fitness!!!!!");
            let parentA = population[parentAIndex];
            let parentB = population[parentBIndex];
            // Create newborn
            let newborn = breedFunction(parentA, parentB);

            // Mutate newborn & change fitness value of individual
            if (Math.random() <= mutProb) {
                newborn = mutate(newborn);
                //now newborn is:
                //[object Object] {
                //  fitness: 10,
                //  individual: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
                //  mutatedIndex: 10
                //}
//check if mutation is neutral etc.
            
            if(mutationInd.neutral.includes(newborn.mutatedIndex)){
                newborn.fitness = newborn.fitness;
            }else if(mutationInd.patohenic.includes(newborn.mutatedIndex)){
                newborn.fitness = newborn.fitness - (newborn.individual.length - 10);
            }else{
                newborn.fitness = 0.1;
            }
                console.log(newborn);
            }
//            console.log(newborn);
            newPopulation.push({ individual: newborn.individual, fitness: newborn.fitness });
        }
        return newPopulation;
    };

    function getResults(population, generations) {
        let results = {
            generations: generations,
            population: []
        };
        for (var i = 0; i < population.length; i++) {
            let indv = population[i];
            results.population.push(indv);
        }
        return results;
    };

    function printUpdate(population, generation) {
        let fittestScore = population[0].fitness;
        let sum = 0;
        for (var i = 0; i < population.length; i++) {
            sum += population[i].fitness;
        }
        let average = sum / population.length;
        console.log("Generation:", generation, "Fittest:", fittestScore, "Average:", average);
    };
};

function Algorithms() {};

Algorithms.crossBreed = function(parentA, parentB) {
    // Select cutOff point and create newborn
    let cutOff = Math.floor(Math.random() * parentA.length);
    let newborn = parentA.slice(0, cutOff + 1);
    let parentBChrom = parentB.slice(cutOff + 1, parentB.length);

    for (var i = 0; i < parentBChrom.length; i++) {
        newborn.push(parentBChrom[i]);
    }
//    console.log(newborn);
    return newborn;
}

function tournament2 (parentA, parentB){
    let newborn = 0;
    parentA.fitness > parentB.fitness ? newborn = parentA : newborn = parentB;
    return newborn;
}


//function fitnessDefining(){
//    
//}


//ME CODE


// Create parameters
var popSize = 100;
var mutProb = 0.0004870242;
var generations = 1000;
var breedFunction = tournament2;
var l = 100; 


var toolbox = new Toolbox();
toolbox.genIndv = generateIndividual(l);
toolbox.getFitness = getFitness;
toolbox.goalFitness = Toolbox.fitnessMax;
toolbox.mutate = mutate;
toolbox.mutAmount = mutationAmount(l);
toolbox.len = l;


//-----------------------------------


function mutationAmount (l){
    
        let result = {
            neutral: [],
            patohenic:[]
        };
        let amount = 0.053 * l;
        for(let i =0; i< amount; i++){
            result.neutral.push(i);
        }
        let amount2 = 0.3577*l;
        let limit = amount2 + result.neutral.length;
        while(result.neutral.length < limit){
            randNum = Math.floor(Math.random() * l);
            if(result.neutral.indexOf(randNum) == -1){
                result.neutral.push(randNum);
            }
        }
        
        let patohenicAmount =  0.0232*l;
       let limit2 = limit + patohenicAmount;
        while(result.patohenic.length < patohenicAmount){
            randNum = Math.floor(Math.random() * l);
            if(result.neutral.indexOf(randNum) == -1 && result.patohenic.indexOf(randNum) == -1 ){
                result.patohenic.push(randNum);
            }
        }
  return result;

        
};


function generateIndividual(l) {
	let array = [];
	for(var i = 0; i < l; i++){
            array.push(Math.round(Math.random()));
    }
	return array;
};

function getFitness(indv) {
	let fitness = 0;
	for(var i = 0; i < indv.length; i++) {
		fitness += indv[i] == 1 ? 0 : 1;
	}
	return fitness;
}

function mutate(indv) {
    let result = {
        mutatedIndex: 0,
        individual: indv.individual,
        fitness: indv.fitness
    }
	result.mutatedIndex = Math.floor(Math.random() * indv.individual.length);
//    if(mutAm.neutral.indexOf(mutatedIndex) != -1){
//        popul.fitness = popul.fitness;
//        else if(mutAm.patohenic.indexOf(mutatedIndex) != -1){
//            popul.fitness = popul.fitness-(10-);
//        }
//    }
	indv[result.mutatedIndex] == 1 ? result.individual[result.mutatedIndex] = 0 : result.individual[result.mutatedIndex] = 1;
	return result;
}



// Create genetic algorithm and evolve individuals
var gen = new GeneticAlgorithm(toolbox, popSize, mutProb, breedFunction, true);
console.log("Simple Array Example:", gen.evolve(generations));
//console.log()