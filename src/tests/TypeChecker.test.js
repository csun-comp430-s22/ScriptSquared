const TypeChecker = require("../TypeChecker/TypeChecker") 
const Tokenizer = require('../Lexer/Tokenizer')
const { Parser } = require('../Parser/Parser')
const { IntType, ClassNameType } = require("../Parser/Type")
const { VariableExp, ThisExp } = require("../Parser/Expressions")
const { Variable } = require("../Parser/Variable")
const { TypeError } = require("../TypeChecker/TypeError")


function createAST(string) {
    const tokenizer = new Tokenizer(string)
    const tokens = tokenizer.tokenize()
    const parser = new Parser(tokens)
    const AST = parser.parseProgram(0)
    return AST;
}

let string = `

class base {
    protec test: int = 1;

    construc(var: int) {}
    
    public int baseMethod(test: int, test2: boolean, test3: string) {
        return 1;
    }
}

class child super base {
    private var: boolean = true;

    construc(var: string) {
        super(1);
        test = 2;
    }

    private boolean baseMethod(test: int) {
        return true;
    }
}


class childchild super child {
    private varchildchild: string = "hello";

    construc(var: boolean) {
        super("yeet");

        this.baseMethod(3, true, "yeet");  
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

// console.log("\nClassMethodMap: ", typeChecker.classMethodMap)
// console.log("\nMethodAccessMod: ", typeChecker.methodAccessMod)
// console.log("\nMethodReturnType: ", typeChecker.methodReturnType)
// console.log("\nTypeTree: ", typeChecker.typeTree)
// console.log("\nClassConstructorTypes: ", typeChecker.classConstructorTypes)

// console.log("\n\nclassInstanceVariables", typeChecker.classInstanceVariables)
// console.log("\n\instanceVariableAccessMod", typeChecker.instanceVariableAccessMod)


describe("Test Expression TypeChecker", () => {

    describe("typeofVariable", () => {
        const typeEnvironment = { "var": new IntType() }
        const ast = createAST("thyEntryPoint {}")
        const typeChecker = new TypeChecker(ast.result)

        test("variable in typeEnvironment", () => {
            const result = typeChecker.expTypeof(new VariableExp(new Variable("var")), typeEnvironment, null)
            expect(result.equals(new IntType())).toBe(true)
        })
        
        test("variable NOT in typeEnvironment", () => {
            function func() {
                typeChecker.expTypeof(new VariableExp(new Variable("test")), typeEnvironment, null)
            }
            expect(func).toThrow(TypeError)
        })
    })

    describe("typeofThis", () => {
        const ast = createAST("thyEntryPoint {}")
        const typeChecker = new TypeChecker(ast.result)

        test("Not in entry point", () => {
            const result = typeChecker.expTypeof(new ThisExp(), {}, "foo")
            expect(result.equals(new ClassNameType("foo"))).toBe(true)
        })

        test("In entry point", () => {
            function func () {
                const result = typeChecker.expTypeof(new ThisExp(), {}, null)
            }

            expect (func).toThrow(TypeError)
        })
    })
})