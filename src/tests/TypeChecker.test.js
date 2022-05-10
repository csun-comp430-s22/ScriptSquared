const TypeChecker = require("../TypeChecker/TypeChecker") 
const Tokenizer = require('../Lexer/Tokenizer')
const { Parser } = require('../Parser/Parser')
const { IntType, ClassNameType, StringType, BooleanType, VoidType, Type } = require("../Parser/Type")
const { VariableExp, ThisExp, IntegerExp, StringExp, BooleanExp, OpExp, NewClassExp, ExpMethodExp } = require("../Parser/Expressions")
const { Variable } = require("../Parser/Variable")
const { TypeError } = require("../TypeChecker/TypeError")
const { PlusOp, MinusOp, MultiplyOp, DivideOp, GreaterThanOp, LessThanOp, GreaterThanEqualOp, LessThanEqualOp, EqualOp, NotEqualOp } = require("../Parser/Operations")
const { IfStmt, BreakStmt, WhileStmt, ReturnExpStmt, ReturnStmt, PrintExpStmt, VarDecEqualsExpStmt, VarEqualsExpStmt, BlockStmt, ExpMethodExpStmt } = require("../Parser/Statements")
const { VarDec } = require("../Parser/VarDec")
const { MethodName } = require("../Parser/MethodName")
const { PublicModifier, PrivateModifier, ProtecModifier } = require("../Parser/AccessModifier")
const { MethodDec } = require("../Parser/MethodDec")
const { InstanceDec } = require("../Parser/InstanceDec")
const { ClassDec } = require("../Parser/ClassDec")
const { Constructor } = require("../Parser/Constructor")


function createAST(string) {
    const tokenizer = new Tokenizer(string)
    const tokens = tokenizer.tokenize()
    const parser = new Parser(tokens)
    const AST = parser.parseProgram(0)
    return AST;
}

function objsEqual(obj1, obj2) {
    const obj1Keys = Object.keys(obj1)

    for (let i = 0; i < obj1Keys.length; i++) {
        const key = obj1Keys[i]

        if ( !(key in obj2) )
            return false;
        
        if ( !(obj1[key].equals(obj2[key])) )
            return false;
    }

    return true;
}


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
            test("correct boolean typing", () => {
                const result = typeChecker.expTypeof(new OpExp(new BooleanExp(true), new EqualOp(), new BooleanExp(false)),
                                                     typeEnvironment,
                                                     null)
                expect(result.equals(new BooleanType())).toBe(true)
            })

            test("correct integer typing", () => {
                const result = typeChecker.expTypeof(new OpExp(new IntegerExp(1), new EqualOp(), new IntegerExp(2)),
                                                     typeEnvironment,
                                                     null)
                expect(result.equals(new BooleanType())).toBe(true)
            })

            test("correct string typing", () => {
                const result = typeChecker.expTypeof(new OpExp(new StringExp("t"), new EqualOp(), new StringExp("y")),
                                                     typeEnvironment,
                                                     null)
                expect(result.equals(new BooleanType())).toBe(true)
            })

            test("incorrect typing", () => {
                function func () {
                    typeChecker.expTypeof(new OpExp(new IntegerExp(1), new EqualOp(), new StringExp("1")),
                                                     typeEnvironment,
                                                     null)
                }
                expect(func).toThrow(TypeError)
            })
        })

        describe("NotEqualOp", () => {
            test("correct boolean typing", () => {
                const result = typeChecker.expTypeof(new OpExp(new BooleanExp(true), new NotEqualOp(), new BooleanExp(false)),
                                                     typeEnvironment,
                                                     null)
                expect(result.equals(new BooleanType())).toBe(true)
            })

            test("correct integer typing", () => {
                const result = typeChecker.expTypeof(new OpExp(new IntegerExp(1), new NotEqualOp(), new IntegerExp(2)),
                                                     typeEnvironment,
                                                     null)
                expect(result.equals(new BooleanType())).toBe(true)
            })

            test("correct string typing", () => {
                const result = typeChecker.expTypeof(new OpExp(new StringExp("t"), new NotEqualOp(), new StringExp("y")),
                                                     typeEnvironment,
                                                     null)
                expect(result.equals(new BooleanType())).toBe(true)
            })

            test("incorrect typing", () => {
                function func () {
                    typeChecker.expTypeof(new OpExp(new IntegerExp(1), new NotEqualOp(), new StringExp("1")),
                                                     typeEnvironment,
                                                     null)
                }
                expect(func).toThrow(TypeError)
            })
        })
    })

    describe("typeofExpMethodExp", () => {
        const ast = createAST("thyEntryPoint {}")
        const typeChecker = new TypeChecker(ast.result)
        typeChecker.classConstructorTypes["foo"] = [new IntType()]
        typeChecker.classMethodMap["foo"] = { "someMethod": [new BooleanType()] }
        typeChecker.methodAccessMod["foo"] = { "someMethod": new PublicModifier() }
        typeChecker.methodReturnType["foo"] = { "someMethod": new StringType() }

        test("correct typing", () => {
            const result = typeChecker.expTypeof(
                new ExpMethodExp(new NewClassExp(new ClassNameType("foo"), [new IntegerExp(1)]),
                                 new MethodName("someMethod"),
                                 [new BooleanExp(true)]),
                {},
                null
            )
            expect(result.equals(new StringType())).toBe(true)
        })

        test("incorrect typing: non-class type", () => {
            function func () {
                typeChecker.expTypeof(
                    new ExpMethodExp(new IntegerExp(1),
                                     new MethodName("someMethod"),
                                     [new BooleanExp(true)]),
                    {},
                    null
                )
            }
            expect(func).toThrow(TypeError)
        })

        test("incorrect typing: class doesn't exist", () => {
            function func () {
                typeChecker.expTypeof(
                    new ExpMethodExp(new NewClassExp(new ClassNameType("bar"), [new IntegerExp(1)]),
                                 new MethodName("someMethod"),
                                 [new BooleanExp(true)]),
                    {},
                    null
                )
            }
            expect(func).toThrow(TypeError)
        })

        test("incorrect typing: param count incorrect", () => {
            function func () {
                typeChecker.expTypeof(
                    new ExpMethodExp(new NewClassExp(new ClassNameType("foo"), [new IntegerExp(1), new StringExp("1")]),
                                 new MethodName("someMethod"),
                                 [new BooleanExp(true)]),
                    {},
                    null
                )
            }
            expect(func).toThrow(TypeError)
        })

        test("incorrect typing: param type incorrect", () => {
            function func () {
                typeChecker.expTypeof(
                    new ExpMethodExp(new NewClassExp(new ClassNameType("foo"), [new StringExp("1")]),
                                 new MethodName("someMethod"),
                                 [new BooleanExp(true)]),
                    {},
                    null
                )
            }
            expect(func).toThrow(TypeError)
        })

        test("incorrect typing: inaccessable", () => {
            typeChecker.methodAccessMod["foo"] = { "someMethod": new PrivateModifier() }

            function func () {
                typeChecker.expTypeof(
                    new ExpMethodExp(new NewClassExp(new ClassNameType("foo"), [new IntegerExp(1), new StringExp("1")]),
                                 new MethodName("someMethod"),
                                 [new BooleanExp(true)]),
                    {},
                    null
                )
            }
            expect(func).toThrow(TypeError)
        })
    })

    describe("typeofNewClassExp", () => {
        const ast = createAST("thyEntryPoint {}")
        const typeChecker = new TypeChecker(ast.result)
        typeChecker.classConstructorTypes["foo"] = [new IntType()]

        test("correct typing", () => {
            const result = typeChecker.expTypeof(
                new NewClassExp(new ClassNameType("foo"), [new IntegerExp(1)]),
                {},
                null,
                null
            )

            expect(result.equals(new ClassNameType("foo"))).toBe(true)
        })

        test("incorrect typing: class doesn't exist", () => {
            function func () {
                typeChecker.expTypeof(
                    new NewClassExp(new ClassNameType("bar"), [new IntegerExp(1)]),
                    {},
                    null,
                    null
                )
            }
            expect(func).toThrow(TypeError)
        })

        test("incorrect typing: param amount incorrect", () => {
            function func () {
                typeChecker.expTypeof(
                    new NewClassExp(new ClassNameType("foo"), [new IntegerExp(1), new BooleanExp(true)]),
                    {},
                    null,
                    null
                )
            }
            expect(func).toThrow(TypeError)
        })

        test("incorrect typing: param type mismatch", () => {
            function func() {
                typeChecker.expTypeof(new ClassNameType("foo"), [new StringExp("1")],
                {},
                null,
                null)
            }
            expect(func).toThrow(TypeError)
        })
    })
})

describe("Test Statement TypeChecker", () => {
    const ast = createAST("thyEntryPoint {}")
    const typeChecker = new TypeChecker(ast.result)
    const typeEnvironment = {}

    describe("typeofIf", () => {
        test("correct typing", () => {
            const result = typeChecker.isWellTyped(new IfStmt(new BooleanExp(true), 
                                                              new BreakStmt(),
                                                              new BreakStmt()), 
                                                    typeEnvironment,
                                                    null,
                                                    null
            )

            expect(objsEqual(result, {})).toBe(true)
        })

        test("incorrect typing", () => {
            function func () {
                typeChecker.isWellTyped(new IfStmt(new IntegerExp(1), 
                                                              new BreakStmt(),
                                                              new BreakStmt()), 
                                                    typeEnvironment,
                                                    null,
                                                    null
                )
            }
            expect(func).toThrow(TypeError)
        })
    })

    describe("typeofWhile", () => {
        test("correct typing", () => {
            const result = typeChecker.isWellTyped(new WhileStmt(new BooleanExp(true), 
                                                                  new BreakStmt()),
                                                        typeEnvironment,
                                                        null,
                                                        null
                )
    
                expect(objsEqual(result, {})).toBe(true)
        })

        test("incorrect typing", () => {
            function func () {
                typeChecker.isWellTyped(new WhileStmt(new IntegerExp(1), 
                                                              new BreakStmt()),
                                                    typeEnvironment,
                                                    null,
                                                    null
                )
            }
            expect(func).toThrow(TypeError)
        })
    })

    describe("typeofReturnExp", () => {
        test("correct typing", () => {
            const result = typeChecker.isWellTyped(new ReturnExpStmt(new IntegerExp(1)), {}, "foo", new IntType())
            expect(objsEqual(result, {})).toBe(true)
        })

        test("incorrect typing: mismatch", () => {
            function func () {
                typeChecker.isWellTyped(new ReturnExpStmt(new IntegerExp(1)), {}, "foo", new StringType("he"))
            }
            expect(func).toThrow(TypeError)
        })

        test("incorrect typing: null", () => {
            function func () {
                typeChecker.isWellTyped(new ReturnExpStmt(new IntegerExp(1)), {}, "foo", null)
            }
            expect(func).toThrow(TypeError)
        })
    })

    describe("typeofReturn", () => {
        test("correct typing", () => {
            const result = typeChecker.isWellTyped(new ReturnStmt(), {}, null, new VoidType())
            expect(objsEqual(result, {})).toBe(true)
        })

        test("incorrect typing: mismatch", () => {
            function func () {
                typeChecker.isWellTyped(new ReturnStmt(), {}, null, new IntType(1))
            }
            expect(func).toThrow(TypeError)
        })

        test("incorrect typing: null", () => {
            function func () {
                typeChecker.isWellTyped(new ReturnStmt(), {}, null, null)
            }
            expect(func).toThrow(TypeError)
        })
    })

    describe("typeofPrintExp", () => {
        test("correct typing", () => {
            const result = typeChecker.isWellTyped(new PrintExpStmt(new IntegerExp(1)), {}, null, null)
            expect(objsEqual(result, {})).toBe(true)
        })
    })

    describe("typeofBlockStmt", () => {
        
        test("correct typeing", () => {
            const typeEnvironment = {}
            const result = typeChecker.isWellTyped(new BlockStmt([
                new VarDecEqualsExpStmt(new VarDec(new IntType(), new Variable("var")), new IntegerExp(1)),
                new VarEqualsExpStmt(new Variable("var"), new IntegerExp(46)),
                new BreakStmt()
            ]), typeEnvironment, null, null)

            expect(objsEqual(result, { "var": new IntType() })).toBe(true)
            expect(objsEqual(typeEnvironment, {})).toBe(true)
        })
    })

    describe("typeofExpMethodExpStmt", () => {
        const ast = createAST("thyEntryPoint {}")
        const typeChecker = new TypeChecker(ast.result)
        typeChecker.classConstructorTypes["foo"] = [new IntType()]
        typeChecker.classMethodMap["foo"] = { "someMethod": [new BooleanType()] }
        typeChecker.methodAccessMod["foo"] = { "someMethod": new PublicModifier() }
        typeChecker.methodReturnType["foo"] = { "someMethod": new StringType() }

        test("correct typing", () => {
            const result = typeChecker.isWellTyped(
                new ExpMethodExpStmt(new NewClassExp(new ClassNameType("foo"), [new IntegerExp(1)]),
                                     new MethodName("someMethod"),
                                     [new BooleanExp(true)]),
                {},
                null
            )
            expect(objsEqual(result, {})).toBe(true)
        })
    })
    
    describe("typeofVarEqualsExp", () => {
        test("correct typing", () => {
            const typeEnvironment = {
                "var": new IntType()
            }
    
            const result = typeChecker.isWellTyped(new VarEqualsExpStmt(new Variable("var"), new IntegerExp(1)),
                                                   typeEnvironment,
                                                   null,
                                                   null)
            expect(objsEqual(result, typeEnvironment)).toBe(true)
        })

        test("incorrect typing: var not in environment", () => {
            function func () {
                typeChecker.isWellTyped(new VarEqualsExpStmt(new Variable("var"), new IntegerExp(1)),
                                        {},
                                        null,
                                        null)
            }
            expect(func).toThrow(TypeError)
        })

        test("incorrect typing: var-environment mismatch", () => {
            function func () {
                const typeEnvironment = {
                    "var": new IntType()
                }

                typeChecker.isWellTyped(new VarEqualsExpStmt(new Variable("var"), new BooleanExp(true)),
                                        typeEnvironment,
                                        null,
                                        null)
            }
            expect(func).toThrow(TypeError)
        })
    })

    describe("typeofVarDecEqualsExp", () => {
        test("correct typing", () => {
            const result = typeChecker.isWellTyped(new VarDecEqualsExpStmt(new VarDec(new IntType(), new Variable("var")),
                                                                           new IntegerExp(1)
                                                  ), {}, null, null)
            expect(objsEqual(result, { "var": new IntType() })).toBe(true)
        })

        test("incorrect typing: typeEnvironment", () => {
            const result = typeChecker.isWellTyped(new VarDecEqualsExpStmt(new VarDec(new IntType(), new Variable("var")),
                                                                           new IntegerExp(1)
                                                                          ), {}, null, null)
            expect(objsEqual(result, { "var": new StringType() })).toBe(false)
        })

        test("incorrect typing: typeEnvironment", () => {
            function func() {
                typeChecker.isWellTyped(new VarDecEqualsExpStmt(new VarDec(new IntType(), new Variable("var")),
                                                                               new BooleanExp(true)
                                                               ), {}, null, null)
            }
            expect(func).toThrow(TypeError)
        })
    })
})

describe("Test Other Structures TypeChecker", () => {
    const ast = createAST("thyEntryPoint {}")
    const typeChecker = new TypeChecker(ast.result)
    const typeEnvironment = {}

    describe("typeofMethodDec", () => {
        test("correct typing", () => {
            function func () {
                typeChecker.isWellTypedMethodDec(
                    new MethodDec(new PublicModifier(), new IntType(), new MethodName("foo"), [new VarDec(new BooleanType(), new Variable("temp"))], new ReturnExpStmt(new IntegerExp(1))),
                    {"stuff": new BooleanType()},
                    null
                )
            }
            expect(func).not.toThrow(Error)
        })
    })

    describe("typeofInstanceDec", () => {
        test("correct typing", () => {
            function func () {
                typeChecker.isWellTypedInstanceDec(
                    new InstanceDec(new PublicModifier(), new VarDec(new IntType, new Variable("foo")), new IntegerExp(1)),
                    {},
                    null
                )
            }
            expect(func).not.toThrow(Error)
        })
    })

    describe("typeofClassDec", () => {
        typeChecker.classConstructorTypes["foo"] = [new BooleanType()]
        typeChecker.classConstructorTypes["bar"] = [new StringType()]

        test("correct typing", () => {
            function func () {
                typeChecker.isWellTypedClassDec(
                    new ClassDec(
                        new ClassNameType("foo"),
                        new ClassNameType("bar"),
                        [new InstanceDec(new PrivateModifier(), new VarDec(new IntType(), new Variable("thing")), new IntegerExp(1))],
                        new Constructor([new VarDec(new BooleanType(), new Variable("temp"))], [new StringExp("yeet")], [new BreakStmt()]),
                        [new MethodDec(
                            new ProtecModifier(), 
                            new VoidType(), 
                            new MethodName("baz"), 
                            [new VarDec(new BooleanType(), new Variable("temp"))],
                            new ReturnStmt()
                        )]
                    )
                )
            }
            expect(func).not.toThrow(Error)
        })
    })

    describe("typeofProgram", () => {      
        const program = createAST(`
            class foo {
                private bar: int = 1;

                construc() {
                    break;
                }

                protec boolean bazMethod(thing: string) {
                    return true;
                }
            }
            
            thyEntryPoint {

            }
        `).result

        test("correct typing", () => {
            function fun () {
                typeChecker.program = program
                typeChecker.isWellTypedProgram()
            }
            expect(fun).not.toThrow(Error)
        })
    })
})

describe("Test Whole Programs", () => {
    test("Duplicate Class", () => {
        function func () {
                const program = createAST(`
                class foo {
                    construc() {}
                }

                class foo {
                    construc() {}
                }

                thyEntryPoint {

                }
            `).result
            const typeChecker = new TypeChecker(program)
        }

        expect(func).toThrow(Error)
    })

    test("No Duplicate Class", () => {
        function func () {
            const program = createAST(`
                class foo {
                    construc() {}
                }

                thyEntryPoint {

                }
            `).result
            const typeChecker = new TypeChecker(program)
        }

        expect(func).not.toThrow(Error)
    })

    test("Typechecker Maps", () => {
        const program = createAST(`
            class foo {
                private bar: int = 1;

                construc(param: boolean) {
                    break;
                }

                protec boolean bazMethod(thing: string) {
                    return true;
                }
            }
            
            thyEntryPoint {

            }
        `).result
        const typeChecker = new TypeChecker(program)

        expect(objsEqual(typeChecker.classMethodMap["foo"], { "Object": {}, "foo": { "bazMethod": [new StringType()] } }))
        expect(objsEqual(typeChecker.classConstructorTypes["foo"], { "Object": {}, "foo": [new BooleanType()] }))
        expect(objsEqual(typeChecker.methodReturnType["foo"], { "Object": {}, "foo": { "bazMethod": new BooleanType() } }))
        expect(objsEqual(typeChecker.methodAccessMod["foo"], { "Object": {}, "foo": { "bazMethod": new ProtecModifier() } }))
        expect(objsEqual(typeChecker.classInstanceVariables["foo"], { "Object": {}, "foo": { "bar": new IntType() } }))
        expect(objsEqual(typeChecker.instanceVariableAccessMod["foo"], { "Object": {}, "foo": { "bar": new PrivateModifier() } }))
        expect(objsEqual(typeChecker.typeTree["foo"], { "Object": [ "foo" ], "foo": [] }))
    })

    test("Class with Super Class", () => {
        const program = createAST(`
            class foo {
                protec protecVar: int = 1;
                private privateVar: string = "2";

                construc(var: int) {}
                
                public int baseMethod(test: int, test2: boolean) {
                    return 1;
                }

                private boolean privateBaseMethod(test3: int) {
                    return 2;
                }
            }
            
            class bar super foo {          
                construc() {
                    super(1);
                }
            }

            thyEntryPoint {

            }
        `).result
        const typeChecker = new TypeChecker(program)

        // expect(objsEqual(typeChecker.classMethodMap["foo"], { "Object": {}, "foo": { "baseMethod": [new IntType(), new BooleanType()], "privateBaseMethod": [new IntType()] }, "bar": { "baseMethod": [new IntType(), new BooleanType()] } }))
        // expect(objsEqual(typeChecker.classConstructorTypes["foo"], { "Object": [], "foo": [ new IntType() ], "bar": [] }))
        // expect(objsEqual(typeChecker.methodReturnType["foo"], { "Object": {}, "foo": { "baseMethod": new IntType(), "privateBaseMethod": new BooleanType() }, "bar": { "baseMethod": new IntType() } }))
        // expect(objsEqual(typeChecker.methodAccessMod["foo"], { "Object": {}, "foo": { "baseMethod": new PublicModifier(), "privateBaseMethod": new PrivateModifier() }, "bar": { "baseMethod": new PublicModifier() } }))
        // expect(objsEqual(typeChecker.classInstanceVariables["foo"], { "Object": {}, "foo": { "protecVar": new IntType(), "privateVar": new StringType() }, "bar": { "protecVar": new IntType() } }))
        // expect(objsEqual(typeChecker.instanceVariableAccessMod["foo"], { "Object": {}, "foo": { "protecVar": new ProtecModifier(), "privateVar": new PrivateModifier() }, "bar": { "protecVar": new ProtecModifier() } }))
        // expect(objsEqual(typeChecker.typeTree["foo"], { "Object": [ "foo" ], "foo": [ "bar" ], "bar": [] }))
    })

})