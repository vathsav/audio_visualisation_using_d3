var context = new (window.AudioContext || window.webkitAudioContext)();
var audioFile = document.getElementById('audio-file');
var source = context.createMediaElementSource(audioFile);
var analyser = context.createAnalyser();

source.connect(analyser);
source.connect(context.destination);

// Boolean flag to check if audio is being played
var isPlaying = false;

var frequencyData = new Uint8Array(200);

var width = $(".post").width();
var height = 600;

var svgVisualisation = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");

var buttonGroup = svgVisualisation.append("g").attr("transform", "translate(" + ((width / 2) - 15) + "," + 290 + ")").attr("width", 30)
    .attr("height", 30);

$("#play-audio").click(function () {
    if (!isPlaying) {
        d3.select("#image-play-pause")
            .attr("xlink:href", "../img/audio_frequencies_using_d3/pause.png");
        document.getElementById('audio-file').play();
        isPlaying = !isPlaying;
    }
});

buttonGroup.append("svg:image")
    .attr("id", "image-play-pause")
    .attr("xlink:href", "../img/audio_frequencies_using_d3/play.png")
    .attr("width", 30)
    .attr("height", 30);

buttonGroup.on("click", function () {
    if (isPlaying) {
        d3.select("#image-play-pause")
            .attr("xlink:href", "../img/audio_frequencies_using_d3/play.png");
        document.getElementById('audio-file').pause();
    } else {
        d3.select("#image-play-pause")
            .attr("xlink:href", "../img/audio_frequencies_using_d3/pause.png");
        document.getElementById('audio-file').play()
    }

    isPlaying = !isPlaying;
});

function drawPaths(audioFrequencies) {
    // Number of frequencies
    var total = audioFrequencies[0].length;

    // Ensure only one instance of the paths
    d3.selectAll(".happy_path").remove();

    audioFrequencies.forEach(function (frequency) {
        var pathOne = [];
        var pathTwo = [];
        var pathThree = [];
        var pathFour = [];
        var pathFive = [];

        // Lazy inefficient code to make 5 closed paths
        svgVisualisation.selectAll(".nodes")
            .data(frequency, function (value, index) {
                pathOne.push([
                    width / 2 * (1 - (parseFloat(Math.max(value, 0)) / 500) * 1.01 * Math.sin(index * 2 * Math.PI / total)),
                    width / 2 * (1 - (parseFloat(Math.max(value, 0)) / 500) * 1.01 * Math.cos(index * 2 * Math.PI / total))
                ]);

                pathTwo.push([
                    width / 2 * (1 - (parseFloat(Math.max(value, 0)) / 500) * 1.25 * Math.sin(index * 2 * Math.PI / total)),
                    width / 2 * (1 - (parseFloat(Math.max(value, 0)) / 500) * 1.25 * Math.cos(index * 2 * Math.PI / total))
                ]);

                pathThree.push([
                    width / 2 * (1 - (parseFloat(Math.max(value, 0)) / 500) * 1.5 * Math.sin(index * 2 * Math.PI / total)),
                    width / 2 * (1 - (parseFloat(Math.max(value, 0)) / 500) * 1.5 * Math.cos(index * 2 * Math.PI / total))
                ]);

                pathFour.push([
                    width / 2 * (1 - (parseFloat(Math.max(value, 0)) / 500) * 1.75 * Math.sin(index * 2 * Math.PI / total)),
                    width / 2 * (1 - (parseFloat(Math.max(value, 0)) / 500) * 1.75 * Math.cos(index * 2 * Math.PI / total))
                ]);

                pathFive.push([
                    (width / 2 * (1 - (parseFloat(Math.max(value, 0)) / 500) * 2 * Math.sin(index * 2 * Math.PI / total))),
                    (width / 2 * (1 - (parseFloat(Math.max(value, 0)) / 500) * 2 * Math.cos(index * 2 * Math.PI / total)))
                ]);
            });

        pathOne.push(pathOne[0]);
        pathTwo.push(pathTwo[0]);
        pathThree.push(pathThree[0]);
        pathFour.push(pathFour[0]);
        pathFive.push(pathFive[0]);

        var lineFunctionCurvy = d3.line()
            .x(function (d) {
                return d[0];
            })
            .y(function (d) {
                return d[1] - 70;
            })
            .curve(d3.curveBasis);

        svgVisualisation.append("path")
            .attr("d", lineFunctionCurvy(pathFive))
            .attr("stroke", "#424242");

        svgVisualisation.append("path")
            .attr("d", lineFunctionCurvy(pathOne))
            .attr("stroke", "#EC407A");

        svgVisualisation.append("path")
            .attr("d", lineFunctionCurvy(pathTwo))
            .attr("stroke", "#D4E157");

        svgVisualisation.append("path")
            .attr("d", lineFunctionCurvy(pathThree))
            .attr("stroke", "#FF7043");

        svgVisualisation.append("path")
            .attr("d", lineFunctionCurvy(pathFour))
            .attr("stroke", "#26C6DA");

        d3.selectAll("path")
            .attr("class", "happy_path")
            .attr("stroke-width", 3)
            .attr("fill", "none");
    });
}

function renderChart() {
    requestAnimationFrame(renderChart);
    analyser.getByteFrequencyData(frequencyData);

    var finalData = [];

    // Pick only one in four frequencies (don't need that many for the circles)
    frequencyData.forEach(function (value, index) {
        if (index % 4 === 0) {
            if (value < 65) frequencyData[index] = value + 65;
            finalData.push(frequencyData[index]);
        }
    });

    drawPaths([finalData]);
}

renderChart();