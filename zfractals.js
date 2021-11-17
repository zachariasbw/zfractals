"use strict";

const yargs = require("yargs");
const { hideBin } = require('yargs/helpers');
const config = require("./config.json");
const Fractal = require("./src/fractal");

async function start(){
    function getFromConfig(option){
        if(config[option]){
            return config[option];
        }
        throw new Error(`"${option}" is not defined in config or command line options!`);
    }
    const argv = yargs(hideBin(process.argv))
        .options({
            "func": {
                "type": "string",
                "describe": "The function to be used to generate the fractal. The variables z and c may be used. Example: return z.square().add(c) (For the mandelbrot fractal.)",
                "default": () => getFromConfig("func")
            },
            "vary":{
                "type": "string",
                "describe": 'The variable to vary. Should be "z" or "c".',
                "default": () => getFromConfig("vary")
            },
            "amin": {
                "type": "number",
                "describe": "The minimum value for the real part of the range of the varied variable z or c. This corresponds to the leftmost x coordinate when viewed as an image.",
                "default": () => getFromConfig("amin")
            },
            "bmin": {
                "type": "number",
                "describe": "The minimum value for the imaginary part of the range of the varied variable z or c. This corresponds to the bottommost y coordinate when viewed as an image.",
                "default": () => getFromConfig("bmin")
            },
            "amax": {
                "type": "number",
                "describe": "The maximum value for the real part of the range of the varied variable z or c. This corresponds to the rightmost x coordinate when viewed as an image.",
                "default": () => getFromConfig("amax")
            },
            "bmax": {
                "type": "number",
                "describe": "The maximum value for the imaginary part of the range of the varied variable z or c. This corresponds to the topmost y coordinate when viewed as an image.",
                "default": () => getFromConfig("bmax")
            },
            "maxiterations": {
                "type": "number",
                "describe": "The maximum number of iterations to run for each point. After these iterations, if the point has not escaped, it is included in the set.",
                "default": () => getFromConfig("maxiterations")
            },
            "escaperadius": {
                "type": "number",
                "describe": "The radius from the origin (0, 0), that a point has to reach in order to escape.",
                "default": () => getFromConfig("escaperadius")
            },
            "height": {
                "type": "number",
                "describe": "The height in pixels of the generated image.",
                "default": () => getFromConfig("height")
            },
            "width": {
                "type": "number",
                "describe": "The width in pixels of the generated image.",
                "default": () => getFromConfig("width")
            },
            "filename": {
                "type": "string",
                "describe": "The file name of the generated image.",
                "default": () => getFromConfig("filename")
            }
        })
        .help()
        .argv;

    const fractal = new Fractal(argv);
    
    const startTime = Date.now();

    await fractal.generateImage();

    const duration = (Date.now() - startTime) / 1000;

    console.log(`Done! (${duration} s)`);
}

start();