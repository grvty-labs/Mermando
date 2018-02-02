**Mermando** <img src="https://www.amnh.org/var/ezflow_site/storage/images/media/amnh/images/explore/ology-images/biodiversity/bio-benefits/necklace/2568782-4-eng-US/necklace.png" width="46">
==============
[![License: MIT][license-shield]][license] ![Status][status-shield] ![Projects connected][projects-shield]

The reason behind this project is the necessity to standarize the use of components inside GRVTY. Notice that this is a work in progress and will receive multiple changes, but don't worry, we will try to maintain the breaking-changes as minimized as possible.


What's in the box?! :gift:
-------------------

#### :zap: Input-Atoms
These fellas have an internal standard to gather the values without any kind of external logic, meaning that you only pass a value and will receive a value, no more `event.target.value`, file async reading nor `checked === 'on'`. In-and-out, like it should have been since the first HTML standard was designed. Future: Validations for required and patterns, so you don't have to rely on the browser\*.

What will you find in the `Inputs` folder?
*   Input (for textareas, text, number, tags, colors, datetime-pickers, etc)
*   InputsWrap
*   FileInput
*   CheckboxInput
*   SelectInput
*   RadioInput
*   RadioGroup

\* I am looking at you, Safari...

#### :high_brightness: Lightboxes

*   Lightbox
*   TabbedLightbox (work in progress)


#### :pushpin: Pages


#### :ticket: Navbars


#### :scroll: Sections
Will have some breaking changes, consider this as the leprosy.

#### :bookmark: Sidebars

#### :last_quarter_moon: Progress bars
Hang in there cowboy. Coming soon.

#### :tada: Toastrs
Coming soon to the nearest theater in town.


<img src="https://www.javatpoint.com/images/javascript/javascript_logo.png" width="32"> Javascript
------------------------

Mermando requires a configuration file to be importable for it to run\*, the way it is being imported is like this: `import Config from 'Config';`. All the configurations are required and do not have fallbacks\*\*

You need to be able to import a json file as "Config". In a `webpack.config.js` we do this by declaring the file inside the `externals` key. The configuration file is mere json from which the names of the icons will be pulled. The icons are used just like FontAwesome uses them\*\*\*, you just need the prefix and the classNames to be used for each case.

Mermando has been tested with FontAwesome and with custom icon fonts created with [IcoMoon][icomoon-link].

\* See the `config-example.json` in the project-root so you can create your own.

\*\* Someday a fix will come our way, but this is not a priority.

\*\*\* Mermando displays the icons inside `<span/>` tags, while FontAwesome uses `<i/>` tags in their examples.

<img src="https://cdn.worldvectorlogo.com/logos/react.svg" width="32"> React
-----
We try to use as much as possible the `PureComponent`s to minimize the impact in memory and rendering. If something is not re-rendering, you might need to tweak the props you are passing to the components\* or write your own components.

\* This is an ugly quickfix for some cases: Replace `prop={value}` for `prop={value || ''}` or `prop={value || null}`. Not that this can impact severily in your memory, so be careful.

<img src="https://camo.githubusercontent.com/2ec260a9d4d3dcc109be800af0b29a8471ad5967/687474703a2f2f706f73746373732e6769746875622e696f2f706f73746373732f6c6f676f2e737667" width="32"> PostCSS
------------
PostCSS is just so wonderful, we would marry the guy who is developing it\*. Mermando is almost fully-configurable, you just need to declare a set of variables\*\* and import the files you need. All the current variables are required (if you import its related file) and do not have fallbacks\*\*\*.

#### Values are important

| Value | Description |
| ----- | ----------- |
| EMs | This is the default unit type. THis will allow to be able to scale every component by just changing the `font-size` of its surrounding parent |
| Pixels | Can only be used for `border`s, `box-shadow`s, `outline`s, navbars, sidebars, lines and ribbons |
| REMs | Used only for elements with `position: fixed`, these are modals, pages, lightboxes, toastrs, etc. |


\* if @ai was a woman, this would be a true statement.

\*\* See the `settings-example.pcss` in the project-root so you can create your own.

\*\*\* The fallbacks will never be included, because it creates duplicate css rules, which can make a really heavy file.


The future looks quite bright ... :sunny:
-----------------------------

These are some **pending changes** for Mermando:

*   Avatar-input atom
*   Image preview in file input, add name under the image
*   Image preview in file input, add zoom when clicked
*   Find a simple and fast way to validate multiple inputs when a form is submitted to display errors
*   Remove "autocomplete" from forms.
*   Make the top title, tabs and line fixed to the browser (as an option).
*   Breadcrumbs design for pages
*   Loading progress bars
*   Fork the datetime-picker open-source project to fix the flickering, improve memory usage and minimize the rendering time.
*   Merge the input atoms in a single component, so you can import that component without knowing the differences between all input components.


Hurt me plenty :feelsgood:
--------------------------------
These are some **issues** in Mermando:
*   Pages atom does not respect the position in Safari for iPad
*   CSS Grid, minmax is not supported for Safari
*   The 'required' icon for inputs is broken in Safari and Edge
*   Topbar is misplaced for Edge
*   The contextual and dropdown menus do not work as expected in Safari for iPad


Why is it taking so long?! :clock1130:
---------------------------
Here in GRVTY we aim for excellence, we are not a workshop. Right now we are developing this project by integrating it with other current projects, meaning that we cannot have breaking changes, everything must be optimized and be maintainable.

This might seem a simple package right now, but we are aiming to make an entire toolkit, if there is something you don't like or you need, please let us know or make a pull-request to this project. We love open-source and we love when quality goes up so, if you are reading this far, we love you too.

**Made for you, with :heart: from**
-------------------------------

[![StackShare][stack-shield]][stack-tech]
[![GRVTY][logo]](http://grvty.digital)



[icomoon-link]: http://icomoon.io/

[logo]: http://grvty.digital/images/logos/repos-logo-1.png?raw=true "GRVTY"
[license]: https://github.com/grvty-labs/Conversations/LICENSE.md
[license-shield]: https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square&colorA=808080&colorB=D8B024
[status-shield]: https://img.shields.io/badge/Status-53%25-yellow.svg?style=flat-square&colorA=808080&colorB=F48041
[projects-shield]: https://img.shields.io/badge/Projects-2%20connected-yellow.svg?style=flat-square&colorA=808080&colorB=9B9B9B
[stack-tech]: http://stackshare.io/grvty/grvty
[stack-shield]: https://img.shields.io/badge/-Technology-blue.svg?style=flat-square&colorA=808080&colorB=3636e2&logoWidth=72&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAEgAAAAOCAYAAACM7Fo2AAAABGdBTUEAALGPC%2FxhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA%2FwD%2FAP%2BgvaeTAAAAB3RJTUUH4QINDwEHFUUK5QAAA%2BRJREFUSMfdlk1oXUUUx39z73t5mZeU2KhEN6LiZ0vdtCsXxaIgFGxoqK4qKP1aKES7qAWDXVd0oYuqkIogVhGVVkGrpGos6CJIIO%2B%2BplIMFpG22Da2gSSN973jYs4k4%2B19XwiCHrjcmfMxZ%2BZ%2FPmYMDUgS64eGZpQixEBsMGvm%2Bb9R7uGlWgZjQASQCFnWNgiybGeog5OatQvN%2FMSBr7p%2BIUX6kaNj1D7k%2BfVSnRdyfHp9o%2FJaZs0sr0OARCI1fgI4B9wKXAK6gB7gPNALHAciIlPPySCjXz2HLzSnKGPnbfyeW9k3OqvQnv%2FGAAFIYv0i9wJbgd%2BAGoaBeo1fanXuLvYXXkkv%2FylRbCTKLzEP0FZgCzALvA1MZcDbDGzCZcYi8IHqANwGPAe8E%2FCeAgaAg8AqYAQoAX9oAG8GPgK%2BBDYATwOjwKTa3wE8D3wKjOUEozlJtYwkFklsrP89kthtkthhSexQOmWHU%2Bm9%2FcKELXwx3s341za7hAc%2BBo4q0N8A0zreovKS%2Fg8p%2FyTws44fVVkfMK%2BgAfQD14B3dT6ga0%2Bq3VkgAXYE%2Br8CPwHdyjsBLAF36jws7zYAmr7FA%2BS%2FPknsgVrFDslMecePx7t3r7sn2rlvZ4GNG6LIXJ%2BHvic8q5t%2BJJBtAm7QcVH%2Fb%2BHK1680DYwHNq9qhCNcyQuwPuNrtfL3B3x%2F8PUqexF4UseDQRA7J6mWkUppJYuqdnB%2Bwu4S6dn%2B0IPxy4B0FVnTIALe6bdAJeC%2FBnwMfAg8HPBHgSsBQKeA7wL5A3qobcAnCiCq733fpDojGfA9gAdUXgMO%2FyNwlkFKLFItszhpjUgfcsa%2B9NkbpcfKlouAGMPRFgCNAacD%2Fgu4viDAroDvS2wMmMCl%2F%2BbMAb8HZoAFYDiQeVD7WcmS0C4EsgJcxmUbtHrC0Kr2TMTslTqLvXrT3lUaff29dN%2F8AjdGEakIg8AQLv3DaHjHR3BN%2FnGdHwSqOl4KY6H%2FBFiLK6%2FPMwcYxTXXOVwGgsuG7Bp5zdY34bO423eWDm6ydsgDeZ8xzBnn7Jo6SADfpfMiclj1KsAFXAYIsCejM6fjQZU%2Fo%2FOwxywB7%2Bs8zvj0GTSSsQt1vwLONNnrddRWDa7qga4ipClHgPvFAVTERXBAATyh64VRMcAx3C0T4cprL67sTgK%2Fq95VXGlN4frLjAZgipXH3gKuNx1ToEMfqN55XN87p7xshswCP%2FD3vtiU2kHRp%2Bc64E3daGgX46K%2FnZVGK8H6eQ%2FFdvzl7bWjR96%2FTc36lQeiEcW4lPdXbyGznud5KpCf3XGLfRRayGM6vLnaqsM2QeokS%2F4z9Be%2BeznLuXK5hgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wMi0xM1QxNTowMTowNy0wNTowMI64DDUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDItMTNUMTU6MDE6MDctMDU6MDD%2F5bSJAAAAAElFTkSuQmCC
