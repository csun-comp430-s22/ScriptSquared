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

- We restricted a few basic features like arrays as they did not pertain to the non-trivial features we were trying to implement. Though we did maintain trivial features such as math and comparison operators to maintain enough function to maintain usability.
- When construction on the parser began we made many changes to the way we handled expressions. Mainly we implemented a right recursive hierarchy that is shown below in Abstract Syntax.
- There are places we made conscious decisions to distance from Java syntax. We approached class declaration in manner more similar to C because we wanted to simplify the type checking processes. Variable declaration was also altered to make parsing simpler.

!!!We also altered the way that we handled variable declaration from our initial proposal. This was to simplify class recognition in the type checker phase

---

## Features

***Sample "Hello World"***

```text
thyEntryPoint {
  hey: string = "Hello World";
  print(s);
}
```

- Variables can be initialized with or without assignment

***Sample class inheritance***

```text
class base {
  construct() {}

  public int baseMethod(x: int, y: int) {
    return x + y;
  }

}

class child super base {
  private name: string;

  construc(name: string) {
    super();
    this.name = name;
  }

// Overwrites previous base
  protec boolean baseMethod() {
    return this.name;
  }
}

class childChild super child {
  private word: string = "BIG";
  public talkinWord: string;

  construc(talkinWord: string) {
    super("yeet");
    this.talkinWord = talkinWord;
  }

  public string speak() {
    test: string = this.baseMethod();
    print(test);
    return this.talkinWord;
  }
}

class unrelated super base {
  construc() {
    super();
  }

}

thyEntryPoint{

  tim: child = new child("Tim");
  james: childChild = new childChild("AHK!");
  something: unrealated = new unrelated();

  print(tim.baseMethod()); // outputs "Tim"
  print(james.speak()); // outputs "yeetAHK!"
  print(something.baseMethod(1, 2)); // outputs 3
}

```

## Known Limitations

- classes and variables have to be declared before they are use
- class must have a constructor
- classes must be declared outside of thyentry point

## What we would do differently

## Abstract syntax

var is a variable
s is a string
i is a integer
b is a boolean
methodname is the name of a method
classname is the name of the class

type ::=
: int | string | boolean | void | classname

primary_exp ::=
: i | s | b | var | ‘(‘ exp ‘)’ | new classname(exp*) | this

method_exp ::=
: primary_exp ( ‘.’ methodname ‘(‘ exp* ‘)’ )\*

multiplitive_op ::=
: * | /

multiplitive_exp ::=
: method_exp (multiplitive_op method_exp )*

additive_op ::=
: + | -

additive_exp ::=
: multiplitive_exp (additive_op multiplitive_exp)*

comparison_op ::=
: ‘>’ | ‘<’ | ‘>=’ | ‘<=’ | ‘==’ | ‘!=’

comparison_exp ::=
: additive_exp | additive_exp comparison_op  additive_exp

exp ::=
: comparison_exp

vardec ::=
: var: type

stmt ::=
: var = exp; | vardec = exp; | { stmt* } | return exp; | return; | if (exp) stmt else stmt | while (exp) stmt | break; | print(exp); | exp.methodname(exp\*);

access ::=
: public | private | protec

methoddec ::=
: access type methodname(vardec*) stmt

instancedec ::=
: access vardec = exp;

***classdec ::=***

```text
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
```

program ::=
: classdec* thyEntryPoint stmt