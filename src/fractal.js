"use strict";

const Complex = require("./complex");
const Jimp = require("jimp");
const fs = require("fs");

// These fractals use a function defined by the user.
// The function uses the operations supported by the Complex class, such as addition, multiplication and square root etc.
// Details on the format of the function can be found in the documentation.
class Fractal{
    constructor(config){
        this.config = config;

        // Construct the function from the configuration. Complex is also passed as a variable, so that it can be accessed from within the function.
        this.func = new Function("z", "c", "Complex", this.config.func);
    }
    async generateImage(){
        let outputFileName = this.config.filename;

        // Make sure the filename ends with .png, since it is a png file we are saving.
        if(!outputFileName.endsWith(".png")){
            outputFileName += ".png";
        }
        
        // Make sure the file doesn't already exist. If it does exist, save it instead as "filename (1).png" or "filename (2).png" etc.
        let fileNameI = 1;
        if(fs.existsSync(outputFileName)){
            outputFileName = outputFileName.slice(0, -4) + ` (${fileNameI++}).png`;

            while(fs.existsSync(outputFileName)){
                if(fileNameI > 9){
                    throw new Error("Multiple files already exist with the specified filename!");
                }
                outputFileName = outputFileName.slice(0, -8) + ` (${fileNameI++}).png`;
            }
        }

        // Generate the fractal.
        const fractalData = this.generateFractalData();

        // Convert each pixel of the fractal to a nice-looking color.
        this.fractalToImageData(fractalData);

        // Create and save the image.
        new Jimp(this.config.width, this.config.height, (err, image) => {
            if(err) throw err;
            for(let x = 0; x < this.config.width; x++){
                for(let y = 0; y < this.config.height; y++){
                    image.setPixelColor(fractalData[x + y * this.config.width], x, y);
                }
            }
            image.write(outputFileName, (err) => {
                if(err) throw err;
            });
        });
    }

    // Transforms the fractal data to image data that can be used to create an image.
    // Important: This is done in-place!
    fractalToImageData(fractalData){
        for(let x = 0; x < this.config.width; x++){
            for(let y = 0; y < this.config.height; y++){
                const index = x + y * this.config.width;

                // These steps are to make the image look colorful.
                const totalColor = Math.round(255 * 3 * fractalData[index]);
                let red, green, blue;
                if(totalColor > 255 * 2){
                    red = totalColor - 255 * 2;
                    green = 255;
                    blue = 255;
                }
                else if(totalColor > 255){
                    red = 0;
                    green = totalColor - 255;
                    blue = 255;
                }
                else{
                    red = 0;
                    green = 0;
                    blue = totalColor;
                }
                const alpha = 255;

                // Set the color in RGBA format.
                fractalData[index] = Jimp.rgbaToInt(red, green, blue, alpha);
            }
        }
    }

    // Generates fractal data.
    // Each element in the result array will correspond to a pixel and have a value between 0 and 1.
    // If an element is included in the fractal's set, it will have a value of 0.
    generateFractalData(){
        const fractalData = new Array(this.config.width * this.config.height);

        if(this.config.vary === "z"){
            const z = new Complex();
            for(let x = 0; x < this.config.width; x++){
                for(let y = 0; y < this.config.height; y++){
                    // c will be set to zero, essentially making it equivalent to writing "0" in the func.
                    const c = new Complex();

                    // Set z values depending on pixel position and minimum/maximum z values.
                    z.a = this.config.amin + (this.config.amax - this.config.amin) / this.config.width * x;
                    z.b = this.config.bmin + (this.config.bmax - this.config.bmin) / this.config.height * y;
                    
                    // c never varies, so only z needs to be checked.
                    fractalData[x + y * this.config.width] = this.check(z, c);
                }
            }

            return fractalData;
        }
        else if (this.config.vary === "c"){
            const c = new Complex();
            for(let x = 0; x < this.config.width; x++){
                for(let y = 0; y < this.config.height; y++){

                    // Set c values depending on pixel position and minimum/maximum z values.
                    c.a = this.config.amin + (this.config.amax - this.config.amin) / this.config.width * x;
                    c.b = this.config.bmin + (this.config.bmax - this.config.bmin) / this.config.height * y;

                    // The initial value for z will always be 0 when c is varied.
                    const z = new Complex();
                    
                    fractalData[x + y * this.config.width] = this.check(z, c);
                }
            }

            return fractalData;
        }
        else throw new Error('Either z or c should be varied. Check your configuration so that vary is equal to "z" or "c".');
    }

    // Checks a single point, if and when that point escapes.
    // Returns a number between 0 and 1.
    // Returns 0 if the point doesn't escape within the maximum number of iterations.
    check(startZ, c){
        let z = Complex.getComplex(startZ);
        if(c){
            c = Complex.getComplex(c);
        }

        // Iterate the function on z, until that point escapes or until maximum iterations are reached.
        let iterations = 0;
        while(iterations < this.config.maxiterations){

            // Has z escaped? If so, return a value between 0 and 1, depending on how many iterations it took to escape.
            if(z.abs().a >= this.config.escaperadius){
                return iterations / this.config.maxiterations;
            }

            // Perform the mathematical function on z. Complex is also passed, so it can be accessed.
            z = this.func(z, c, Complex);

            iterations++;
        }

        // Maximum iterations are reached, the point did not escape and is therefore included in the fractal's set. Return 0.
        return 0;
    }
}

module.exports = Fractal;