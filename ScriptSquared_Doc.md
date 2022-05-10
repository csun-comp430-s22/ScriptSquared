ScriptSquared
=============

Documentation for a compiler created by Emmanuel Bruce Loh, Erick Sanchez, Gevork Manukyan, and Jack Kouyoumdjian

ScriptSquared is an object-oriented language that is meant to imitate Java and implemented in and compiled to JavaScript.

---
**Table of contents**

---
## Language Design

### What is this language

ScriptSquared is statically-typed object-oriented language with traditional classes, inheritance, subtyping, and access modifiers.

There is

- **No** type inference
- Objects + Methods with class-based inheritance, not based in JS classes
- Subtyping
- Access Modifiers
### Why this language

This language was made as a learning exercise to develop an understanding of how compilers work in the context of a object-oriented language. We want to take the "script" out of JavaScript. In our attempt to try to mimic the syntax of Java and some of the class features. We choose JavaScript as our target and implementation language due to it being the second-most familiar language in our group and its ease of use. ***HUBRIS***. This was a way for us to express our frustration with the prolific use of Java at CSUN.

### Why this design

We wanted to use JS to make this language happen and to make this an actual learning experience we had to choose features that where in someway anti-JS. JS refuses to have types so we made them the only option. JS has funky class design, we made it very traditional.

Many normal features such as loops and arrays were not included as they did not pertain to the non-trivial features we were trying to implement. Though we did maintain trivial features such as math and comparison operators.


## Features

## Known Limitations

## What we would do differently

## Abstract syntax
