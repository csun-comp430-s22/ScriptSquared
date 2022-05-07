const TypeChecker = require("../TypeChecker/TypeChecker") 
const Tokenizer = require('../Lexer/Tokenizer')
const { Parser } = require('../Parser/Parser')
const { IntType, ClassNameType, StringType, BooleanType } = require("../Parser/Type")
const { VariableExp, ThisExp, IntegerExp, StringExp, BooleanExp, OpExp } = require("../Parser/Expressions")
const { Variable } = require("../Parser/Variable")
const { TypeError } = require("../TypeChecker/TypeError")
const { PlusOp, MinusOp, MultiplyOp, DivideOp, GreaterThanOp, LessThanOp, GreaterThanEqualOp, LessThanEqualOp } = require("../Parser/Operations")


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
    const ast = createAST("thyEntryPoint {}")
    const typeChecker = new TypeChecker(ast.result)
    const typeEnvironment = {}

    test("IntegerExp", () => {
        const result = typeChecker.expTypeof(new IntegerExp(1), {}, null)
        expect(result.equals(new IntType())).toBe(true)
    })

    test("StringExp", () => {
        const result = typeChecker.expTypeof(new StringExp("hello"), {}, null)
        expect(result.equals(new StringType())).toBe(true)
    })

    test("BooleanExp", () => {
        const result = typeChecker.expTypeof(new BooleanExp(true), {}, null)
        expect(result.equals(new BooleanType())).toBe(true)
    })

    describe("typeofVariable", () => {
        const typeEnvironment = { "var": new IntType() }

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

        test("Not in entry point", () => {
            const result = typeChecker.expTypeof(new ThisExp(), {}, "foo")
            expect(result.equals(new ClassNameType("foo"))).toBe(true)
        })

        test("In entry point", () => {
            function func () {
                typeChecker.expTypeof(new ThisExp(), {}, null)
            }

            expect (func).toThrow(TypeError)
        })
    })

    describe("typeofOpExp", () => {
        describe("PlusOp", () => {
            test("correct typing", () => {
                const result = typeChecker.expTypeof(new OpExp(new IntegerExp(1), new PlusOp(), new IntegerExp(2)),
                                                     typeEnvironment,
                                                     null)
                expect(result.equals(new IntType())).toBe(true)
            })

            test("incorrect typing", () => {
                function func () {
                    typeChecker.expTypeof(new OpExp(new IntegerExp(1), new PlusOp(), new StringExp("1")),
                                                     typeEnvironment,
                                                     null)
                }
                expect(func).toThrow(TypeError)
            })
        })

        describe("MinusOp", () => {
            test("correct typing", () => {
                const result = typeChecker.expTypeof(new OpExp(new IntegerExp(1), new MinusOp(), new IntegerExp(2)),
                                                     typeEnvironment,
                                                     null)
                expect(result.equals(new IntType())).toBe(true)
            })

            test("incorrect typing", () => {
                function func () {
                    typeChecker.expTypeof(new OpExp(new IntegerExp(1), new MinusOp(), new StringExp("1")),
                                                     typeEnvironment,
                                                     null)
                }
                expect(func).toThrow(TypeError)
            })
        })

        describe("MultiplyOp", () => {
            test("correct typing", () => {
                const result = typeChecker.expTypeof(new OpExp(new IntegerExp(1), new MultiplyOp(), new IntegerExp(2)),
                                                     typeEnvironment,
                                                     null)
                expect(result.equals(new IntType())).toBe(true)
            })

            test("incorrect typing", () => {
                function func () {
                    typeChecker.expTypeof(new OpExp(new IntegerExp(1), new MultiplyOp(), new StringExp("1")),
                                                     typeEnvironment,
                                                     null)
                }
                expect(func).toThrow(TypeError)
            })
        })

        describe("DivideOp", () => {
            test("correct typing", () => {
                const result = typeChecker.expTypeof(new OpExp(new IntegerExp(1), new DivideOp(), new IntegerExp(2)),
                                                     typeEnvironment,
                                                     null)
                expect(result.equals(new IntType())).toBe(true)
            })

            test("incorrect typing", () => {
                function func () {
                    typeChecker.expTypeof(new OpExp(new IntegerExp(1), new DivideOp(), new StringExp("1")),
                                                     typeEnvironment,
                                                     null)
                }
                expect(func).toThrow(TypeError)
            })
        })

        describe("GreaterThanOp", () => {
            test("correct typing", () => {
                const result = typeChecker.expTypeof(new OpExp(new IntegerExp(1), new GreaterThanOp(), new IntegerExp(2)),
                                                     typeEnvironment,
                                                     null)
                expect(result.equals(new BooleanType())).toBe(true)
            })

            test("incorrect typing", () => {
                function func () {
                    typeChecker.expTypeof(new OpExp(new IntegerExp(1), new GreaterThanOp(), new StringExp("1")),
                                                     typeEnvironment,
                                                     null)
                }
                expect(func).toThrow(TypeError)
            })
        })

        describe("LessThanOp", () => {
            test("correct typing", () => {
                const result = typeChecker.expTypeof(new OpExp(new IntegerExp(1), new LessThanOp(), new IntegerExp(2)),
                                                     typeEnvironment,
                                                     null)
                expect(result.equals(new BooleanType())).toBe(true)
            })

            test("incorrect typing", () => {
                function func () {
                    typeChecker.expTypeof(new OpExp(new IntegerExp(1), new LessThanOp(), new StringExp("1")),
                                                     typeEnvironment,
                                                     null)
                }
                expect(func).toThrow(TypeError)
            })
        })

        describe("GreaterThanEqualOp", () => {
            test("correct typing", () => {
                const result = typeChecker.expTypeof(new OpExp(new IntegerExp(1), new GreaterThanEqualOp(), new IntegerExp(2)),
                                                     typeEnvironment,
                                                     null)
                expect(result.equals(new BooleanType())).toBe(true)
            })

            test("incorrect typing", () => {
                function func () {
                    typeChecker.expTypeof(new OpExp(new IntegerExp(1), new GreaterThanEqualOp(), new StringExp("1")),
                                                     typeEnvironment,
                                                     null)
                }
                expect(func).toThrow(TypeError)
            })
        })

        describe("LessThanEqualOp", () => {
            test("correct typing", () => {
                const result = typeChecker.expTypeof(new OpExp(new IntegerExp(1), new LessThanEqualOp(), new IntegerExp(2)),
                                                     typeEnvironment,
                                                     null)
                expect(result.equals(new BooleanType())).toBe(true)
            })

            test("incorrect typing", () => {
                function func () {
                    typeChecker.expTypeof(new OpExp(new IntegerExp(1), new LessThanEqualOp(), new StringExp("1")),
                                                     typeEnvironment,
                                                     null)
                }
                expect(func).toThrow(TypeError)
            })
        })

        describe("EqualOp", () => {
            test("correct typing", () => {
                expect(false).toBe(true)
            })

            test("incorrect typing", () => {
                expect(false).toBe(true)
            })
        })

        describe("NotEqualOp", () => {
            test("correct typing", () => {
                expect(false).toBe(true)
            })

            test("incorrect typing", () => {
                expect(false).toBe(true)
            })
        })
    })
})