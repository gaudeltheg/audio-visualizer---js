document.addEventListener("DOMContentLoaded", function () {
    let audioContext;
    let analyser;
    let dataArray;
    let canvasContext;

    const audioElement = document.getElementById("audio");
    const visualizerCanvas = document.getElementById("visualizer");
    const playButton = document.getElementById("playButton");

    const createAudioContext = () => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        canvasContext = visualizerCanvas.getContext("2d");
        visualizerCanvas.width = visualizerCanvas.offsetWidth;
        visualizerCanvas.height = visualizerCanvas.offsetHeight;

        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
    };

    const drawVisualizer = () => {
        analyser.getByteFrequencyData(dataArray);
    
        canvasContext.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    
        const barWidth = ((visualizerCanvas.width / dataArray.length) * 2.5) * 0.8; // 80% of the original bar width for spacing
        const barSpacing = barWidth * 0.2; // Space between all bars
        const mirroredBarSpacing = barSpacing; // Space between mirrored bars
        let x = visualizerCanvas.width / 2;
    
        for (let i = 0; i < dataArray.length / 2; i++) {
            const barHeight = dataArray[i] / 2; // Divide by 2 to make the visualizer start from the middle of the canvas
    
            // Change the color of the bars based on their height
            const red = barHeight + (25 * (i / dataArray.length));
            const green = 250 * (i / dataArray.length);
            const blue = 50;
    
            canvasContext.fillStyle = `rgb(${red},${green},${blue}`;
    
            const barX = x + (i * (barWidth + barSpacing));
            const barY = (visualizerCanvas.height - barHeight) / 2;
            const cornerRadius = 7; // Adjust the corner radius as needed
    
            // Draw a rectangle with blunt corners
            canvasContext.beginPath();
            canvasContext.moveTo(barX + cornerRadius, barY);
            canvasContext.lineTo(barX + barWidth - cornerRadius, barY);
            canvasContext.quadraticCurveTo(barX + barWidth, barY, barX + barWidth, barY + cornerRadius);
            canvasContext.lineTo(barX + barWidth, barY + barHeight - cornerRadius);
            canvasContext.quadraticCurveTo(barX + barWidth, barY + barHeight, barX + barWidth - cornerRadius, barY + barHeight);
            canvasContext.lineTo(barX + cornerRadius, barY + barHeight);
            canvasContext.quadraticCurveTo(barX, barY + barHeight, barX, barY + barHeight - cornerRadius);
            canvasContext.lineTo(barX, barY + cornerRadius);
            canvasContext.quadraticCurveTo(barX, barY, barX + cornerRadius, barY);
            canvasContext.closePath();
            canvasContext.fill();
    
            // Mirror the bars on the left side
            const mirroredX = x - (i * (barWidth + barSpacing));
            canvasContext.beginPath();
            canvasContext.moveTo(mirroredX - cornerRadius, barY);
            canvasContext.lineTo(mirroredX - barWidth + cornerRadius, barY);
            canvasContext.quadraticCurveTo(mirroredX - barWidth, barY, mirroredX - barWidth, barY + cornerRadius);
            canvasContext.lineTo(mirroredX - barWidth, barY + barHeight - cornerRadius);
            canvasContext.quadraticCurveTo(mirroredX - barWidth, barY + barHeight, mirroredX - barWidth + cornerRadius, barY + barHeight);
            canvasContext.lineTo(mirroredX - cornerRadius, barY + barHeight);
            canvasContext.quadraticCurveTo(mirroredX, barY + barHeight, mirroredX, barY + barHeight - cornerRadius);
            canvasContext.lineTo(mirroredX, barY + cornerRadius);
            canvasContext.quadraticCurveTo(mirroredX, barY, mirroredX - cornerRadius, barY);
            canvasContext.closePath();
            canvasContext.fill();
        }
    
        requestAnimationFrame(drawVisualizer);
    };
    

    // Call createAudioContext and drawVisualizer immediately
    createAudioContext();
    drawVisualizer();

    playButton.addEventListener("click", () => {
        if (audioContext && audioContext.state === "suspended") {
            audioContext.resume().then(() => {
                audioElement.play();
                playButton.textContent = "Pause";
            });
        } else if (!audioContext) {
            createAudioContext();
            audioElement.play();
            playButton.textContent = "Pause";
        } else if (audioElement.paused) {
            audioElement.play();
            playButton.textContent = "Pause";
        } else {
            audioElement.pause();
            playButton.textContent = "Play";
        }
    });
});
