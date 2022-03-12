# ScriptSquared

## Syntax

- var is a variable
- s is a String
- i is an Int
- b is a Boolean
- methodname is the name of a method
- classname is the name of the class


type ::= Int | String | Boolean | Void | classname

op ::= + | - | * | / | > | < | == | != | >= | <=

exp ::= i | s | b | this | exp op exp | exp.methodname(exp*) | new classname(exp*)

vardec ::= type var

stmt ::= var = exp; | vardec = exp; | { stmt* } |	// stmt’s separated by semi-colonsreturn exp; |if (exp) stmt else stmt |while (exp) stmt | break;	|return; | print(exp) 


access ::= public | private | protec

methoddec ::= access type methodname(vardec*) stmt  // vardecs separated by comma

instancedec ::= access vardec = exp

```
classdec ::= class classname super classname {
	     	instancedec*;
		construc(vardec*) { super(exp*); stmt* }	// vardec separated by comma. 
							                        // stmt’s separated by semi-colons
		methoddec*
	      }
```

program ::= classdec* `thyEntryPoint` { stmt* }

## Things to Have

Things to Have

    Variables
    Arrays 
    Operations
    Classes
    Declare
    Assign value
    Statements
    Variable creation
    Variable assignment
    If 
    else
    Loops
    While
    Break;
    { Code  }
    Expressions
    Method call
    public int getValue(Int: 5) {}
    Ternary
    String, int, var
    Variable declarations

## Tokens List

- [ ] Variable
- [ ] Right Curly
- [ ] Left Curly
- [ ] Right Paren
- [ ] Left Paren
- [ ] Return
- [ ] True
- [ ] False
- [ ] SemiColon

TODO