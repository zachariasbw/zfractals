# zFractals
#### Created by zachariasbw

zFractals is used to create images of fractals, such as Julia sets and the Mandelbrot set.

## Usage
Configure zFractals as you choose, then run the zfractals.js script using node:
```cmd
node zfractals.js
```
Help can be invoked using the ```--help``` option.
```cmd
node zfractals.js --help
```

## How it works
zFractals outputs an image using several configuration settings as input. These configuration settings are described in the section titled **Configuration**. This section will cover how the fractal works.

A fractal is constructed based on a function. That function is iterated many times on a variable z. If, within a certain number of iterations, that variable gets too large, it has "escaped", and it is colored depending on how long it took to escape. If it does not "escape", it is colored black.

For Julia sets and the Mandelbrot set, that function is ```f(z) = z^2 + c```.

There is however a huge distinction to be made between Julia sets and the Mandelbrot set. That distinction is in which variable is varied. For Julia sets, that variable is *z*. For the Mandelbrot set, that variable is *c*. If *c* is varied, such as for the Mandelbrot set, *z* will initially be 0 before the first iteration of the function at each point.

## Configuration
Edit the config.json file to change the configuration or input any configuration variables as options in the terminal as such:

```cmd
node zfractals.js --height 200 --width 200 --vary "z"
```
All configuration settings need to be set either in the config.json file or as options passed in the terminal. If both are set, the terminal option will take precedence.

### List of configuration settings:

- func **(type: string)**
    - The function to be used to generate the fractal. The variables _z_ and _c_ may be used. Example: ```return z.square().add(c)``` (For the mandelbrot fractal.)
- vary **(choose either "z" or "c")**
    - The variable to vary throughout the fractal generation. The other variable will always be set to zero, initially at each point.
- amin **(type: number)**
    - The minimum value for the real part of the range of the varied variable _z_ or _c_. This corresponds to the leftmost x coordinate when viewed as an image.
- bmin **(type: number)**
    - The minimum value for the imaginary part of the range of the varied variable _z_ or _c_. This corresponds to the bottommost y coordinate when viewed as an image.
- amax **(type: number)**
    - The maximum value for the real part of the range of the varied variable _z_ or _c_. This corresponds to the rightmost x coordinate when viewed as an image.
- bmax **(type: number)**
    - The maximum value for the imaginary part of the range of the varied variable _z_ or _c_. This corresponds to the topmost y coordinate when viewed as an image.
- maxiterations **(type: number)**
    - The maximum number of iterations to run for each point. After these iterations, if the point has not escaped, it is included in the set.
- escaperadius **(type: number)**
    - The radius from the origin **(0, 0)**, that a point has to reach in order to escape.
- height **(type: number)**
    - The height in pixels of the generated image.
- width **(type: number)**
    - The width in pixels of the generated image.
- filename **(type: string)**
    - The file name of the generated image.

## The *func* configuration setting
The *func* configuration setting is written as a string that will be interpreted into a Javascript function. The interpreted function will be passed two arguments: *z* and *c*. These both arguments are *Complex* objects. The *Complex* class supports the following operations:
- add - Addition (requires one argument)
- sub - Subtraction (requires one argument)
- multiply - Multiplication (requires one argument)
- divide - Division (requires one argument)
- square - Square
- sqrt - Square root
- abs - Absolute value
- sin - Sine
- cos - Cosine
- equals - Equality check (returns a boolean)

The *func* is expected to return a Complex object. As such, using the built-in Complex operations is most practical.

## Examples
### Mandelbrot set
![Mandelbrot set](/example_output/test.png)
**config.json**
```json
{
    "func": "return z.square().add(c)",
    "vary": "c",
    "amin": -2,
    "bmin": -2,
    "amax": 2,
    "bmax": 2,
    "maxiterations": 50,
    "escaperadius": 1000,
    "height": 1000,
    "width": 1000,
    "filename": "example_output/test"
}
```

### Julia set (c = 0.4 + 0.5i)
![Julia set (c = 0.4 + 0.5i)](/example_output/test2.png)
**config.json**
```json
{
    "func": "return z.square().add('0.4+0.5i')",
    "vary": "z",
    "amin": -2,
    "bmin": -2,
    "amax": 2,
    "bmax": 2,
    "maxiterations": 50,
    "escaperadius": 1000,
    "height": 1000,
    "width": 1000,
    "filename": "example_output/test2"
}
```

### Burning ship
![Burning ship fractal](/example_output/test3.png)
**config.json**
```json
{
    "func": "return new Complex(Math.abs(z.a), Math.abs(z.b)).square().add(c)",
    "vary": "c",
    "amin": -2,
    "bmin": -2,
    "amax": 2,
    "bmax": 2,
    "maxiterations": 80,
    "escaperadius": 1000,
    "height": 3000,
    "width": 3000,
    "filename": "example_output/test3"
}
```

## License
[APACHE LICENSE 2.0](https://www.apache.org/licenses/LICENSE-2.0)