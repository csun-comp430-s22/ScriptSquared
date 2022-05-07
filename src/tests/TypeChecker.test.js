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
    private var: boolean = 2;

    construc(var: string) {
        super();
    }

    public boolean baseMethod(test: int) {
        return 1;
    }
}


class childchild super child {
    private varchildchild: string = "hello";

    construc(var: boolean) {
        super();

        b: child = new child();
    }

    public boolean superChildMethod(test: boolean) {
        return 3;
    }
  
    public child superChildMethod2(test: child) {
        return 3;
    }

}

class unrelatedClass {
    construc(var: int, var1: child) {}

    public string baseMethod(test: string, test2: boolean) {
        return 1;
    }
}


thyEntryPoint {
    return;
}
`
let ast = createAST(string)
let typeChecker = new TypeChecker(ast.result)

// TODO: objectType is being returned as one of the functions for the subclass. It shouldn't
console.log("\nClassMethodMap: ", typeChecker.classMethodMap)
console.log("\nMethodAccessMod: ", typeChecker.methodAccessMod)
console.log("\nMethodReturnType: ", typeChecker.methodReturnType)
console.log("\nTypeTree: ", typeChecker.typeTree)
console.log("\nClassConstructorTypes: ", typeChecker.classConstructorTypes)

console.log("\n\nclassInstanceVariables", typeChecker.classInstanceVariables)
console.log("\n\instanceVariableAccessMod", typeChecker.instanceVariableAccessMod)

// TODO: crashes when i make a variable of type class

// Private - only inside of the class
// Protec - only by subclasses 
// Public - by anyone