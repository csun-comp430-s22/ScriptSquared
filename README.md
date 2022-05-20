# ScriptSquared

Created by Gevork Manukyan, Jack Kouyoumdjian, Emmanuel Bruce Loh, Erick Sanchez

[**DOCUMENTATION CLICK HERE**](ScriptSquared_Doc.md)

## Compiler Implementation Language and Reasoning

JavaScript because it is one of the languages all of us are familiar with and one that we find useful to get better at.

**Target Language**: JavaScript

## Language Description

Object-oriented programming. A language that is like JavaScript but with more traditional classes like Java, along with types. The goal is for us to better understand Object-oriented programming and typing: we wanna take the “script” out of JavaScript.

### Features

**Planned Restrictions:** No type inference

**Computation Abstraction Non-Trivial Feature**: Object + Methods with Class-based inheritance, not using JavaScript classes

**Non-Trivial Feature #2:** Subtyping

**Non-Trivial Feature #3:** Access modifiers

**Work Planned for Custom Component:** Access Modifiers

## Syntax

```text
var is a variable 

s is a String

i is an Int

b is a Boolean

methodname is the name of a method

classname is the name of the class

type ::= int | string | boolean | void | classname

primary_exp ::= i | s | b | var | ‘(‘ exp ‘)’ | new classname(exp*) | this

method_exp ::= primary_exp ( ‘.’ methodname ‘(‘ exp* ‘)’ )*

multiplitive_op ::= * | /

multiplitive_exp ::= method_exp (multiplitive_op method_exp )*

additive_op ::= + | -

additive_exp ::= multiplitive_exp (additive_op multiplitive_exp)*

comparison_op ::= ‘>’ | ‘<’ | ‘>=’ | ‘<=’ | ‘==’ | ‘!=’

comparison_exp ::= additive_exp | additive_exp comparison_op  additive_exp

exp ::= comparison_exp 

vardec ::= var: type

stmt ::= var = exp; | vardec = exp; |  
    { stmt* } |
    return exp; |
    return; | 
    if (exp) stmt else stmt |
    while (exp) stmt | 
    break;	|
    print(exp); |
    exp.methodname(exp*);

access ::= public | private | protec

methoddec ::= access type methodname(vardec*) stmt  // vardecs separated by comma

instancedec ::= access vardec = exp;

classdec ::= class classname super classname {
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

program ::= classdec* `thyEntryPoint` stmt 
```
