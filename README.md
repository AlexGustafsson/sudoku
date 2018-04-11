Sudoku
======
A sudoku implementation using modern techniques such as modern EcmaScript, Poi (Webpack, Babel etc.) and Vue. [Check it out live](https://dist-dxhvxidzdn.now.sh).

<p align="center">
  <img alt="Demo" src="https://github.com/AlexGustafsson/sudoku/raw/master/assets/demo.gif">
<p>

# Quickstart
<a name="quickstart"></a>

```
# Clone the repository
git clone https://github.com/AlexGustafsson/sudoku

# Enter the directory
cd sudoku

# Install dependencies and launch development server
npm install
npm start

# You can now go to http://localhost:4000
```

# Table of contents

[Quickstart](#quickstart)<br/>
[Features](#features)<br />
[Algorithms](#algorithms)<br />
[Technology](#technology)<br />
[Disclaimer](#disclaimer)

# Features
<a name="features"></a>

_Note: these images are somewhat outdated and will be updated shortly. Features will also be mentioned more concretely._

![Demo](https://github.com/AlexGustafsson/sudoku/raw/master/assets/demo.png)

![Demo](https://github.com/AlexGustafsson/sudoku/raw/master/assets/demo2.png)

# Algorithms
<a name="algorithms"></a>

### Grid generation

The algorithm to generate a complete grid.

<p align="center">
  <img alt="Terminology" src="https://github.com/AlexGustafsson/sudoku/raw/master/assets/terminology.png">
<p>

* Let the __grid__ consist of __subgrids__ of __cells__. Each __subgrid__ contains 9 __cells__. Each __cell__ has a coordinate __{x, y}__ (such as __{0 ≤ x ≤ 9, 0 ≤ y ≤ 9}__).
* For each __cell__ in the __grid__.
  * Let __neighbors__ be all __cells__ that either intersect the horizontal crossing line (__{0 ≤ x ≤ 8, y}__), the vertical crossing line (__{x, 0 ≤ y ≤ 8}__) or are part of the same subgrid.
  * Let possible numbers be numbers that have not yet been tried for the __cell__ and are not included in the __neighbors__.
  * If there are possible numbers:
    * Pick a random possible number and assign it to the __cell__. Mark the number as tested for the __cell__.
    * Move to the next __cell__.
  * If there are no possible __neighbors__.
    * Go back to the previous __cell__.
    * Remove all tried numbers for any future __cells__.
    * Go to step 2.1 again.

# Technology
<a name="technology"></a>

### Poi
> Poi is a zero-config bundler built on the top of webpack. By using the buzz word zero-config, it does not mean that there's no config, instead we pre-configurared many things for you. To prevent Poi from becoming too bloated to use, we also introduced some kind of plugin system to make extra features opt-in.

Visit Poi [here](https://github.com/egoist/poi).

### Vue
> Vue (pronounced /vjuː/, like view) is a progressive framework for building user interfaces. It is designed from the ground up to be incrementally adoptable, and can easily scale between a library and a framework depending on different use cases. It consists of an approachable core library that focuses on the view layer only, and an ecosystem of supporting libraries that helps you tackle complexity in large Single-Page Applications.

Visit Vue [here](https://github.com/vuejs/vue).

# Disclaimer
<a name="disclaimer"></a>

_Although the project is very capable, it is not built with production in mind. Therefore there might be complications when trying to use the engine for large-scale projects meant for the public. The project was developed to easily use "play" Sudoku and as such it might not promote best practices nor be performant._
