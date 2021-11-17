"use strict";

// Complex number class for numbers in the form: z = a + bi.
class Complex{
    // Constructs a complex number in the form: z = a + bi
    constructor(a = 0, b = 0){
        this.a = Number(a);
        this.b = Number(b);

        // If a or b is undefined
        if((!this.a && this.a !== 0) || (!this.b && this.b !== 0)){
            throw new Error(`Failed to construct a Complex object from values ${a} and ${b}!`);
        }
    }

    // Commonly used numbers.
    static ZERO = new Complex(0, 0);
    static ONE = new Complex(1, 0);
    static I = new Complex(0, 1);
    static PI = new Complex(Math.PI, 0);

    // Converts x into a Complex, unless x is already a Complex. Throws an Error if failed.
    static getComplex(x){
        if(x instanceof Complex){
            return x;
        }
        else if(typeof(x) === "number"){
            return new Complex(x, 0);
        }
        else if(typeof(x) === "string") {
            // Remove whitespace from x.
            x = x.replace(/ /g, '');

            // Split x by + sign.
            const split = x.split("+");

            // If the number is fully real or imaginary.
            if(split.length === 1){
                // If the number is fully imaginary.
                if(x.endsWith("i")){
                    let parsed;

                    // For single i's, such as for z = 2 + i.
                    if(x.length === 1){
                        parsed = 1;
                    }
                    else{
                        parsed = Number(x.slice(0, -1));
                    }

                    if(parsed || parsed === 0){
                        return new Complex(0, parsed);
                    }
                }
                // Else the number is fully real.
                else{
                    const parsed = Number(x);
                    if(parsed || parsed === 0){
                        return new Complex(parsed, 0);
                    }
                }
            }
            else if(split.length === 2 && split[1].endsWith("i")){
                const parsed1 = Number(split[0]);
                let parsed2;

                // For single i's, such as for z = 2 + i.
                if(split[1].length === 1){
                    parsed2 = 1;
                }
                else{
                    parsed2 = Number(split[1].slice(0, -1));
                }
                
                if((parsed1 || parsed1 === 0) && (parsed2 || parsed2 === 0)){
                    return new Complex(parsed1, parsed2);
                }
            }
        }
        throw new Error(`${x} could not be converted into a Complex object.`)
    }

    // toString override
    toString(){
        return `${this.a} + ${this.b}i`;
    }
    
    // The following member functions return new Complex objects, and are NOT done in-place.
    // If you don't want to construct a new object each time one of these functions is called,
    // because you need very optimized performance, consider rewriting some or all of these functions to be performed in-place.

    // Absolute value of this.
    abs(){
        return new Complex(Math.sqrt(this.a * this.a + this.b * this.b), 0);
    }

    // Sine and cosine.
    sin(){
        return new Complex(Math.sin(this.a) * Math.cosh(this.b), Math.cos(this.a) * Math.sinh(this.b));
    }
    cos(){
        return new Complex(Math.cos(this.a) * Math.cosh(this.b), -Math.sin(this.a) * Math.sinh(this.b));
    }
    
    // Basic mathematical operations.
    add(z){
        z = Complex.getComplex(z);
        return new Complex(this.a + z.a, this.b + z.b);
    }
    subtract(z){
        z = Complex.getComplex(z);
        return new Complex(this.a - z.a, this.b - z.b);
    }
    negative(){
        return new Complex(-this.a, -this.b);
    }
    multiply(z){
        z = Complex.getComplex(z);
        return new Complex(this.a * z.a - this.b * z.b, this.a * z.b + this.b * z.a);
    }
    divide(z){
        z = Complex.getComplex(z);
        const denominator = z.a * z.a + z.b * z.b;
        return new Complex((this.a * z.a + this.b * z.b) / denominator, (this.b * z.a + this.a * z.b) / denominator);
    }
    sqrt(){
        const abs = this.abs();
        const signB = this.b < 0 ? -1 : 1;
        return new Complex(Math.sqrt(0.5 * (abs + this.a)), signB * Math.sqrt(0.5 * (abs - this.a)))
    }
    square(){
        return new Complex(this.a * this.a - this.b * this.b, 2 * this.a * this.b);
    }

    // Is this equal to z?
    equals(z){
        z = Complex.getComplex(z);
        return this.a === z.a && this.b === z.b;
    }
}

module.exports = Complex;