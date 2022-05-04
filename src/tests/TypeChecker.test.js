const TypeChecker = require("../TypeChecker/TypeChecker") 
const Tokenizer = require('../Lexer/Tokenizer')
const { Parser } = require('../Parser/Parser')


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

        public int baseMethod(int test, boolean test2, string test3) {
            return 1;
        }
    }

    class child super base {
        construc() {
            super();
        }

        public int childMethod(int test) {
            return 2;
        }

        public child objectType() {
            return 4;
        }
    }

    class childchild super child {
        construc() {
            super();
        }

        public boolean superChildMethod(boolean test) {
            return 3;
        }

    }

    class test super nothing {
        construc() {
            super();
        }
    }

    thyEntryPoint {
        return;
    }
`
// let ast = createAST(string)
// let typeChecker = new TypeChecker(ast.result)

// // TODO: objectType is being returned as one of the functions for the subclass. It shouldn't
// console.log(typeChecker.typeTree)