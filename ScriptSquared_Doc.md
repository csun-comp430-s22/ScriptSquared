# ScriptSquared

Documentation for a compiler created by Emmanuel Bruce Loh, Erick Sanchez, Gevork Manukyan, and Jack Kouyoumdjian

ScriptSquared is an object-oriented language that is meant to imitate Java and implemented in and compiled to JavaScript.

---

- [ScriptSquared](#scriptsquared)
  - [Language Design](#language-design)
    - [What is this language](#what-is-this-language)
    - [Why this language](#why-this-language)
    - [Why this design](#why-this-design)
  - [Features !!!!!GONNA NEED HELP WITH THIS](#features-gonna-need-help-with-this)
  - [Known Limitations](#known-limitations)
    - [The Nitty (The idiosyncrasies)](#the-nitty-the-idiosyncrasies)
    - [The Gritty (Actual oversights or shortcomings)](#the-gritty-actual-oversights-or-shortcomings)
    - [The things that cannot be done](#the-things-that-cannot-be-done)
  - [What we would do differently](#what-we-would-do-differently)
  - [Compellation instruction](#compellation-instruction)
  - [Abstract syntax](#abstract-syntax)

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

- We restricted a few basic features like arrays as they did not pertain to the non-trivial features we were trying to implement. Though we did maintain trivial features such as math and comparison operators to maintain enough function to maintain usability.
- When construction on the parser began we made many changes to the way we handled expressions. Mainly we implemented a right recursive hierarchy that is shown below in Abstract Syntax.
- There are places we made conscious decisions to distance from Java syntax. We approached class declaration in manner more similar to C because we wanted to simplify the type checking processes. Variable declaration was also altered to make parsing simpler.

!!!We also altered the way that we handled variable declaration from our initial proposal. This was to simplify class recognition in the type checker phase

---

## Features !!!!!GONNA NEED HELP WITH THIS

***Sample "Hello World"***

```text
thyEntryPoint {
  hey: string = "Hello World";
  print(hey);
}
```

- Variables can be initialized with or without assignment

***Sample class inheritance***

```
class animal {
    protec name: string = "empty";

    construc(nameCon: string) {
        name = nameCon;
    }

    public string getName() {
        return name;
    }

    public string returnType() {
        return "animal";
    }
}

class dog super animal {
    private weight: int = 0;
    private height: int = 0;

    construc(name: string, weightCon: int, heightCon: int) {
        super(name);
        weight = weightCon;
        height = heightCon;
    }

    protec int getWeight () {
        return weight;
    }

    protec int getHeight () {
        return height;
    }

    public int getCuteness () {
        return 100;
    }

    public string returnType() {
        return "dog";
    }
}

class GermanShepard super dog {
    private color: string = "blank";

    construc(name: string, colorCon: string, weight: int, height: int) {
        super(name, weight, height);

        color = colorCon;
    }

    public string getColor() {
        return color;
    }

    public int area() {
        return this.getWeight() + this.getHeight(); 
    }

    public string returnType() {
        return "German Shepard";
    }
}

thyEntryPoint {
    pupper: GermanShepard = new GermanShepard("Billy", "Black", 150, 24);
    pupper.getName();
    pupper.getCuteness();
    pupper.getColor();
    pupper.area();

    woofy: dog = new GermanShepard("Steve", "Red", 50, 5);
    pupper.getName();
    pupper.getCuteness();

    doggo: animal = new GermanShepard("Bob", "Blue", 125, 16);
    doggo.getName();


    pupper.returnType(); // GermanShepard
    woofy.returnType();  // dog
    doggo.returnType();  // animal
}
```

## Known Limitations

### The Nitty (The idiosyncrasies)

Classes

- All classes must be declared before or after 'thyEntryPoint'. This is down to how the compiler finds and stores the class and functions list
- The data members of a class cannot be accessed directly. Instead the classes must be programmed with getters and setter to interact with the data members
  - This applies to the use of `this` in a constructor. If a data member needs a value assigned `this.val = val` will not work instead it can either be `val = valIn` or `this.setVal(val);`.
- Classes require a constructor even if it will not be used
- There is no keyword for overriding inherited functions. The inherited functions can still be overridden if the child has a function with the exact same name. This also applies to instanced variables.
- When a data member is declared within a class it must be instantiated at declaration.
- If a variable of type class is assigned a value that is a subclass, the variable will only have the methods of the class used for the declaratoin and not assignment

Functions

- Functions cannot be created outside of a class

ThyEntryPoint

- Must be declared at the top or the bottom of the code, not in between class declarations.
- Can still recognize the classes outside of thyEntryPoint

### The Gritty (Actual oversights or shortcomings)

Classes

- Within the constructor if the input parameter is named the same as an internal data member that input parameter will get mixed up with the internal data member. So `val = val;` would be `valInput = valInput` and this will not change the state of the data member.

Functions

- There is no requirement that return be in a function even if it has a non-void type.
  - If you were to assign the result of let's say a function that should return an integer to a integer variable but the that int function does not have a return the program would wander into undefined behavior.

Types

- Types cannot be casted to a different type so what you see is what you get.

### The things that cannot be done

- No arrays built in! There could be an attempt at it by making an array by stringing together a custom node class.
- No string manipulation. A string can be overwritten but it is a static thing.
- No constants so all variables are mutable

---

## What we would do differently

The code

- Created a heiraicahal abstract syntax from the very beginning. It would have made the parser so much easier to approach
- CLASSES. We worked on finding classes and method names in the tokenization step. That was not that great of an idea and if we could have done it again we probably would have followed the advice we got later and instead treated variables, class names, and methods as identifiers and then later assigned them to there appropriate classifications.
- In terms of syntax we initially stuck close to Java but that limited us in our approach on parsing. If we could do it again we would change the syntax so the spirit of excessive OOP would be there but the code would be more straight forward to parse and consistent.
- Functions would be something the we wished we could have made work outside of classes. Oddly enough the limitations of excessive OOP make our approach consistent but it feels like a short coming.
- BETTER ERROR MESSAGES. This is something that will follow us to our early graves. The amount of stress due to vague or incomplete error messaging made finding bugs or breaks in our logic. If we could do it again we would have made highly detailed error messages from the very beginning.

The process

- With hindsight we should have made tighter deadlines on smaller components to stay on track and manage time better. There where a few mad scrambles to get components finished when our expected workflow hit a road block on a particularly difficult aspect of the compiler.
- We should have been more iterative in our process. We usually locked in an idea and tried running it until we couldn't get past a problem that was rooted in the design. If we continuously thought about our design and the way that it was going to interact we would have saved ourselves a lot of trouble.

---

## Compellation instruction

The compiler requires Node.js to run the code.

## Abstract syntax

```text
var is a variable
s is a string
i is a integer
b is a boolean
methodname is the name of a method
classname is the name of the class

type ::=
  int | string | boolean | void | classname

primary_exp ::=
  i | s | b | var | ‘(‘ exp ‘)’ | new classname(exp*) | this

method_exp ::=
  primary_exp ( ‘.’ methodname ‘(‘ exp* ‘)’ )\*

multiplitive_op ::=
  * | /

multiplitive_exp ::=
  method_exp (multiplitive_op method_exp )*

additive_op ::=
  + | -

additive_exp ::=
  multiplitive_exp (additive_op multiplitive_exp)*

comparison_op ::=
  ‘>’ | ‘<’ | ‘>=’ | ‘<=’ | ‘==’ | ‘!=’

comparison_exp ::=
  additive_exp | additive_exp comparison_op  additive_exp

exp ::=
  comparison_exp

vardec ::=
  var: type

stmt ::=
  var = exp; | vardec = exp; | { stmt* } | return exp; | return; | if (exp) stmt else stmt | while (exp) stmt | break; | print(exp); | exp.methodname(exp\*);

access ::=
  public | private | protec

methoddec ::=
  access type methodname(vardec*) stmt

instancedec ::=
  access vardec = exp;

***classdec ::=***


class classname super classname {
   instancedec*
   construc(vardec*) { super(exp*); stmt* } 
   methoddec*
}
|
class classname {
   instancedec*;
   construc(vardec*) stmt
   methoddec*
}


program ::= classdec* thyEntryPoint stmt | thyEntryPoint stmt classdec*
```
