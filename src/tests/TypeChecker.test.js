const TypeChecker = require("../TypeChecker/TypeChecker") 
const Tokenizer = require('../Lexer/Tokenizer')
const { Parser } = require('../Parser/Parser')
const { ExpMethodExp } = require("../Parser/Expressions")


function createAST(string) {
    const tokenizer = new Tokenizer(string)
    const tokens = tokenizer.tokenize()
    const parser = new Parser(tokens)
    const AST = parser.parseProgram(0)
    return AST;
}

let string = `

class base {
    protec var: int = 1;

    construc(var: int) {}
    
    public int baseMethod(test: int, test2: boolean, test3: string) {
        return 1;
    }
}

class child super base {
    private var: boolean = true;

    construc(var: string) {
        super(1);
    }

    public boolean baseMethod(test: int) {
        return true;
    }
}


class childchild super child {
    private varchildchild: string = "hello";

    construc(var: boolean) {
        super("yeet");

        b: child = new child("test");
    }

    public boolean superChildMethod(test: boolean) {
        return true;
    }
  
    public child superChildMethod2(test: child) {
        return new child("hello");
    }

}

class unrelatedClass {
    construc(var: int, var1: child) {}

    public string baseMethod(test: string, test2: boolean) {
        return "hello";
    }
}


thyEntryPoint {
    var: base = new base(1);
}
`
let ast = createAST(string)
let typeChecker = new TypeChecker(ast.result)
typeChecker.isWellTypedProgram()

// TODO: objectType is being returned as one of the functions for the subclass. It shouldn't
// console.log("\nClassMethodMap: ", typeChecker.classMethodMap)
// console.log("\nMethodAccessMod: ", typeChecker.methodAccessMod)
// console.log("\nMethodReturnType: ", typeChecker.methodReturnType)
// console.log("\nTypeTree: ", typeChecker.typeTree)
// console.log("\nClassConstructorTypes: ", typeChecker.classConstructorTypes)

// console.log("\n\nclassInstanceVariables", typeChecker.classInstanceVariables)
// console.log("\n\instanceVariableAccessMod", typeChecker.instanceVariableAccessMod)

// TODO: crashes when i make a variable of type class

// Private - only inside of the class
// Protec - only by subclasses 
// Public - by anyone