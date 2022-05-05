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
    construc() {}
    
    public int baseMethod(test: int, test2: boolean, test3: string) {
        return 1;
    }
}

class childchild super child {
    construc() {
        super();
    }

    public boolean superChildMethod(test: boolean) {
        return 3;
    }

}

class child super base {
    construc() {
        super();
    }

    public int childMethod(test: int) {
        return 2;
    }

    public child objectType() {
        return 4;
    }
}

class base2 super base {
    construc() {}
    
    public int baseMethod(test: int, test2: boolean, test3: string) {
        return 1;
    }
}


    thyEntryPoint {
        new base().baseMethod(1, true, "hello");
        return;
    }
`
let ast = createAST(string)
let typeChecker = new TypeChecker(ast.result)

// TODO: objectType is being returned as one of the functions for the subclass. It shouldn't
console.log(typeChecker.typeTree)