const { Parser } = require('../Parser/Parser')
const {
    IntType,
    StringType,
    BooleanType,
    VoidType,
    ClassNameType
} = require('../Parser/Type')
const Tokenizer = require('../Lexer/Tokenizer')
const { PublicToken, PrivateToken, ProtecToken, AccessToken } = require("../Lexer/Tokens/AccessTokens")
const { 
    LeftCurlyToken,
    RightCurlyToken, 
    LeftParenToken, 
    RightParenToken,
    SemiColonToken,
    DotToken,
    CommaToken,
} = require("../Lexer/Tokens/SymbolToken")
const { 
    PlusToken,
    MinusToken,
    MultiplyToken,
    DivideToken,
    EqualsToken,
    NotEqualsToken,
    GreaterThanEqualToken,
    GreaterThanToken,
    LessThanEqualToken,
    LessThanToken,
    AssignmentToken
 } = require("../Lexer/Tokens/OperatorTokens")
const { 
    ReturnToken,
    IfToken,
    ElseToken,
    WhileToken,
    BreakToken,
    PrintToken,
    ThisToken
 } = require("../Lexer/Tokens/StatementTokens")
const { 
    VoidTypeToken,
    ClassNameTypeToken,   
    TypeToken,
    StringTypeToken,
    IntegerTypeToken,
    BooleanTypeToken,
 } = require("../Lexer/Tokens/TypeTokens")
const VariableToken = require("../Lexer/Tokens/VariableToken");
const ParseResult = require("../Parser/ParseResult") 
const { NewToken } = require("../Lexer/Tokens/NewToken")
const { PlusOp, MinusOp, MultiplyOp, DivideOp, GreaterThanOp, GreaterThanEqualOp, LessThanOp, LessThanEqualOp, EqualOp, NotEqualOp, DotOp, Op } = require("../Parser/Operations");
const { VariableExp, StringExp, IntegerExp, BooleanExp, NewClassExp, OpExp, ExpMethodExp, ThisExp } = require('../Parser/Expressions');
const { Variable } = require('../Parser/Variable');
const MethodNameToken = require('../Lexer/Tokens/MethodNameToken');
const { ExpMethodExpStmt, VarEqualsExpStmt, VarDecEqualsExpStmt, ReturnStmt, ReturnExpStmt, IfStmt, BlockStmt, WhileStmt, BreakStmt, PrintExpStmt, Stmt } = require('../Parser/Statements');
const { VarDec } = require('../Parser/VarDec');
const { PublicModifier, PrivateModifier, ProtecModifier } = require('../Parser/AccessModifier');
const { InstanceDec } = require('../Parser/InstanceDec');
const { MethodDec } = require('../Parser/MethodDec');
const { Program } = require('../Parser/Program');
const ThyEntryPointToken = require('../Lexer/Tokens/ThyEntryPointToken');
const ClassToken = require('../Lexer/Tokens/ClassToken');
const { ClassDec } = require('../Parser/ClassDec');
const SuperToken = require('../Lexer/Tokens/SuperToken');
const { Constructor } = require('../Parser/Constructor');
const { MethodName } = require('../Parser/MethodName')
const { IntegerToken, TrueToken, FalseToken, StringToken } = require('../Lexer/Tokens/ExpressionTypeTokens')


function expectTokenizes (input) {
    const tokenizer = new Tokenizer(input)
    const result = tokenizer.tokenize()
    return result;
}


// Parse Type:= int | string | boolean | void | classname
describe("Testing parseType", () => {

    test("If input is of token type int", () => {
        let parser = new Parser( [new IntegerTypeToken])
        let result = parser.parseType(0)
        expect(result.equals( new ParseResult(new IntType(), 1))).toBe(true)
    } )
    test("If input is of token type string", () => {
        let parser = new Parser( [new StringTypeToken])
        let result = parser.parseType(0)
        expect(result.equals( new ParseResult( new StringType(), 1))).toBe(true)
    } )
    test("If input is of token type boolean", () => {
        let parser = new Parser( [new BooleanTypeToken])
        let result = parser.parseType(0)
        expect(result.equals(new ParseResult(new BooleanType(), 1))).toBe(true)
    } )
    test("If input is of token type void", () => {
        let parser = new Parser( [new VoidTypeToken])
        let result = parser.parseType(0)
        expect(result.equals(new ParseResult(new VoidType(), 1))).toBe(true)
    } )
    test("If input is of token type classname", () => {
        let parser = new Parser( [new ClassNameTypeToken("example class")])
        let result = parser.parseType(0)
        expect(result.equals( new ParseResult(new ClassNameType("example class"), 1))).toBe(true)
    } )
})

// primary_exp ::= i | s | b | var | ‘(‘ exp ‘)’ | new classname(exp*) | this
describe("Testing parsePrimaryExp", () => {

    test("If input is of token Variable", () => {
        let string = expectTokenizes("var")
        let parser = new Parser(string)
        let result = parser.parsePrimaryExp(0)
        expect( result.equals( new ParseResult( new VariableExp(new Variable("var")), 1))).toBe(true)
    })

    test("If input is of token String", () => {
        let string = expectTokenizes('"Hello World"')
        let parser = new Parser(string)
        let result = parser.parsePrimaryExp(0)
        expect(result.equals( new ParseResult(new StringExp("Hello World"), 1))).toBe(true)
    })
    
    test("If input is of token Integer", () => {
        let string = expectTokenizes("5")
        let parser = new Parser(string)
        let result = parser.parsePrimaryExp(0)
        expect(result.equals( new ParseResult(new IntegerExp(5), 1))).toBe(true)
    })

    test("If input is of token False", () => {
        let string = expectTokenizes("false")
        let parser = new Parser(string)
        let result = parser.parsePrimaryExp(0)
        expect(result.equals(new ParseResult(new BooleanExp("false"), 1))).toBe(true)
    })

    test("If input is of token True", () => {
        let string = expectTokenizes("true")
        let parser = new Parser(string)
        let result = parser.parsePrimaryExp(0)
        expect(result.equals(new ParseResult(new BooleanExp("true"), 1))).toBe(true)
    })
    
    test("If input is of token LeftParen", () => {
        let parser = new Parser( [new LeftParenToken(), new IntegerToken(5), new RightParenToken()])
        let result = parser.parsePrimaryExp(0)
        expect(result.equals(new ParseResult( new IntegerExp(5), 3))).toBe(true)
    })

    test("If input is of token NewToken", () => {
        let parser = new Parser([new NewToken(), new ClassNameTypeToken("myClass"), new LeftParenToken(), new IntegerToken(5), new CommaToken(), new IntegerToken(6), new CommaToken(), new TrueToken(), new RightParenToken()])
        let result = parser.parsePrimaryExp(0)
        expect( result.equals( new ParseResult( new NewClassExp(new ClassNameType("myClass"), [new IntegerExp(5), new IntegerExp(6), new BooleanExp('true')]), 9))).toBe(true)
    })

    test("If input is of toke ThisToke", () => {
        let string = expectTokenizes("this")
        let parser = new Parser(string)
        let result = parser.parsePrimaryExp(0)
        expect(result.equals(new ParseResult(new ThisExp(), 1))).toBe(true)
    })
})

// method_exp ::= primary_exp ( ‘.’ methodname ‘(‘ exp* ‘)’ )*
describe("Testing paresMethodExp", () => {
    test("Single primary_exp", () => {
        let tokens = expectTokenizes('"myString"')
        let parser = new Parser(tokens)
        let result = parser.parseMethodExp(0)
        expect(result.equals( new ParseResult(new StringExp("myString"), 1) )).toBe(true)
    })

    test("primary_exp.methodname()", () => {
        let parser = new Parser([new IntegerToken(5), new DotToken(), new MethodNameToken("myMethod"), new LeftParenToken(), new RightParenToken()])
        let result = parser.parseMethodExp(0)
        expect(result.equals( new ParseResult(new ExpMethodExp(new IntegerExp(5), new MethodName("myMethod"), []), 5) )).toBe(true)
    })

    test("primary_exp.methodname().methodname()", () => {
        let parser = new Parser([new IntegerToken(5), new DotToken(), new MethodNameToken("myMethod"), new LeftParenToken(), new RightParenToken(), new DotToken(), new MethodNameToken("secondMethod"), new LeftParenToken(), new RightParenToken()])
        let result = parser.parseMethodExp(0)
        expect(result.equals( new ParseResult(new ExpMethodExp( new ExpMethodExp(new IntegerExp(5), new MethodName("myMethod"), []), new MethodName("secondMethod"), []), 9) )).toBe(true)
    })
})

// multiplitive_exp ::= method_exp (multiplitive_op method_exp )*
describe("Testing parseMultDivExp", () => {
    describe("Single method_exp", () => {
        test("Method Call", () => {
            let parser = new Parser([new IntegerToken(5), new DotToken(), new MethodNameToken("myMethod"), new LeftParenToken(), new RightParenToken()])
            let result = parser.parseMultDivExp(0)
            expect(result.equals( new ParseResult(new ExpMethodExp(new IntegerExp(5), new MethodName("myMethod"), []), 5) )).toBe(true)
        })

        test("Primary Exp", () => {
            let tokens = expectTokenizes('1')
            let parser = new Parser(tokens)
            let result = parser.parseMultDivExp(0)
            expect(result.equals( new ParseResult(new IntegerExp(1), 1) )).toBe(true)
        })
    })

    describe("method_exp multiplitive_op method_exp", () => {
        test("Multiplication", () => {
            let tokens = expectTokenizes('1 * 2')
            let parser = new Parser(tokens)
            let result = parser.parseMultDivExp(0)
            expect(result.equals( new ParseResult(new OpExp(new IntegerExp(1), new MultiplyOp(), new IntegerExp(2)), 3) )).toBe(true)
        })

        test("Division", () => {
            let tokens = expectTokenizes('6 / 2')
            let parser = new Parser(tokens)
            let result = parser.parseMultDivExp(0)
            expect(result.equals( new ParseResult(new OpExp(new IntegerExp(6), new DivideOp(), new IntegerExp(2)), 3) )).toBe(true)
        })
    })

    describe("method_exp multiplitive_op method_exp multiplitive_op method_exp", () => {
        test("Multiplication", () => {
            let tokens = expectTokenizes('1 * 2 * 3')
            let parser = new Parser(tokens)
            let result = parser.parseMultDivExp(0)
            expect(result.equals( new ParseResult(new OpExp( new OpExp(new IntegerExp(1), new MultiplyOp(), new IntegerExp(2)), new MultiplyOp(), new  IntegerExp(3) ), 5) )).toBe(true)
        })

        test("Division", () => {
            let tokens = expectTokenizes('8 / 2 / 2')
            let parser = new Parser(tokens)
            let result = parser.parseMultDivExp(0)
            expect(result.equals( new ParseResult(new OpExp( new OpExp(new IntegerExp(8), new DivideOp(), new IntegerExp(2)), new DivideOp(), new  IntegerExp(2) ), 5) )).toBe(true)
        })
    })
})

// access ::= public | private | protec
describe("Testing parseAddSubExp", () => {
    describe("Single multiplitive_exp", () => {
        test("Multiplication/Division", () => {
            let tokens = expectTokenizes('1 * 2')
            let parser = new Parser(tokens)
            let result = parser.parseAddSubExp(0)
            expect(result.equals( new ParseResult(new OpExp(new IntegerExp(1), new MultiplyOp(), new IntegerExp(2)), 3) )).toBe(true)
        })

        test("Method Call", () => {
            let parser = new Parser([new IntegerToken(5), new DotToken(), new MethodNameToken("myMethod"), new LeftParenToken(), new RightParenToken()])
            let result = parser.parseAddSubExp(0)
            expect(result.equals( new ParseResult(new ExpMethodExp(new IntegerExp(5), new MethodName("myMethod"), []), 5) )).toBe(true)
        })

        test("Primary Exp", () => {
            let tokens = expectTokenizes('1')
            let parser = new Parser(tokens)
            let result = parser.parseAddSubExp(0)
            expect(result.equals( new ParseResult(new IntegerExp(1), 1) )).toBe(true)
        })
    })

    describe("multiplitive_exp additive_op multiplitive_exp", () => {
        test("Addition", () => {
            let tokens = expectTokenizes('1 + 2')
            let parser = new Parser(tokens)
            let result = parser.parseAddSubExp(0)
            expect(result.equals( new ParseResult(new OpExp(new IntegerExp(1), new PlusOp(), new IntegerExp(2)), 3) )).toBe(true)
        })

        test("Subtraction", () => {
            let tokens = expectTokenizes('1 - 2')
            let parser = new Parser(tokens)
            let result = parser.parseAddSubExp(0)
            expect(result.equals( new ParseResult(new OpExp(new IntegerExp(1), new MinusOp(), new IntegerExp(2)), 3) )).toBe(true)
        })
    })

    describe("multiplitive_exp additive_op multiplitive_exp additive_op multiplitive_exp", () => {
        test("Addition", () => {
            let tokens = expectTokenizes('1 + 2 + 3')
            let parser = new Parser(tokens)
            let result = parser.parseAddSubExp(0)
            expect(result.equals( new ParseResult(new OpExp( new OpExp(new IntegerExp(1), new PlusOp(), new IntegerExp(2)), new PlusOp(), new  IntegerExp(3) ), 5) )).toBe(true)
        })

        test("Subtraction", () => {
            let tokens = expectTokenizes('1 - 2 - 3')
            let parser = new Parser(tokens)
            let result = parser.parseAddSubExp(0)
            expect(result.equals( new ParseResult(new OpExp( new OpExp(new IntegerExp(1), new MinusOp(), new IntegerExp(2)), new MinusOp(), new  IntegerExp(3) ), 5) )).toBe(true)
        })
    })
})

// comparison_exp ::= additive_exp | additive_exp (‘>’ | ‘<’ | ‘>=’ | ‘<=’ | ‘==’ | ‘!=”)  additive_exp
describe("Testing parseComparisonExp", () => {
    describe("Single additive_exp", () => {
        test("Addition/Subtration", () => {
            let tokens = expectTokenizes('1 + 2')
            let parser = new Parser(tokens)
            let result = parser.parseComparisonExp(0)
            expect(result.equals( new ParseResult(new OpExp(new IntegerExp(1), new PlusOp(), new IntegerExp(2)), 3) )).toBe(true)
        })
        
        test("Multiplication/Division", () => {
            let tokens = expectTokenizes('1 * 2')
            let parser = new Parser(tokens)
            let result = parser.parseComparisonExp(0)
            expect(result.equals( new ParseResult(new OpExp(new IntegerExp(1), new MultiplyOp(), new IntegerExp(2)), 3) )).toBe(true)
        })

        test("Method Call", () => {
            let parser = new Parser([new IntegerToken(5), new DotToken(), new MethodNameToken("myMethod"), new LeftParenToken(), new RightParenToken()])
            let result = parser.parseComparisonExp(0)
            expect(result.equals( new ParseResult(new ExpMethodExp(new IntegerExp(5), new MethodName("myMethod"), []), 5) )).toBe(true)
        })

        test("Primary Exp", () => {
            let tokens = expectTokenizes('1')
            let parser = new Parser(tokens)
            let result = parser.parseComparisonExp(0)
            expect(result.equals( new ParseResult(new IntegerExp(1), 1) )).toBe(true)
        })
    })

    describe("additive_exp additive_op additive_exp", () => {
        test("Greater Than", () => {
            let tokens = expectTokenizes('2 > 1')
            let parser = new Parser(tokens)
            let result = parser.parseComparisonExp(0)
            expect(result.equals( new ParseResult(new OpExp(new IntegerExp(2), new GreaterThanOp(), new IntegerExp(1)), 3) )).toBe(true)
        })

        test("Less Than", () => {
            let tokens = expectTokenizes('1 < 2')
            let parser = new Parser(tokens)
            let result = parser.parseComparisonExp(0)
            expect(result.equals( new ParseResult(new OpExp(new IntegerExp(1), new LessThanOp(), new IntegerExp(2)), 3) )).toBe(true)
        })

        test("Greater Than Equal to", () => {
            let tokens = expectTokenizes('2 >= 1')
            let parser = new Parser(tokens)
            let result = parser.parseComparisonExp(0)
            expect(result.equals( new ParseResult(new OpExp(new IntegerExp(2), new GreaterThanEqualOp(), new IntegerExp(1)), 3) )).toBe(true)
        })

        test("Less Than Equal to", () => {
            let tokens = expectTokenizes('1 <= 2')
            let parser = new Parser(tokens)
            let result = parser.parseComparisonExp(0)
            expect(result.equals( new ParseResult(new OpExp(new IntegerExp(1), new LessThanEqualOp(), new IntegerExp(2)), 3) )).toBe(true)
        })

        test("Equal to", () => {
            let tokens = expectTokenizes('1 == 1')
            let parser = new Parser(tokens)
            let result = parser.parseComparisonExp(0)
            expect(result.equals( new ParseResult(new OpExp(new IntegerExp(1), new EqualOp(), new IntegerExp(1)), 3) )).toBe(true)
        })

        test("Not Equal to", () => {
            let tokens = expectTokenizes('2 != 1')
            let parser = new Parser(tokens)
            let result = parser.parseComparisonExp(0)
            expect(result.equals( new ParseResult(new OpExp(new IntegerExp(2), new NotEqualOp(), new IntegerExp(1)), 3) )).toBe(true)
        })
    })
})

// return exp; | return;
describe("Testing return statements", () => {
    test("return exp;", () => {
        let string = expectTokenizes("return 12;")
        let parser = new Parser(string)
        let result = parser.parseStmt(0)
        expect(result.equals(new ParseResult(new ReturnExpStmt(new IntegerExp(12)), 3))).toBe(true)
    })

    test("return;", () => {
        let string = expectTokenizes("return;")
        let parser = new Parser(string)
        let result = parser.parseStmt(0)
        expect(result.equals(new ParseResult(new ReturnStmt(), 2))).toBe(true)
    })
})

// if (exp) stmt else stmt
describe("Testing If statement", () => {
    test("Only True Branch", () => {
        let string = expectTokenizes("if (true) return;")
        let parser = new Parser(string)
        let result = parser.parseStmt(0)
        expect(result.equals(new ParseResult(new IfStmt(new BooleanExp("true"), new ReturnStmt(), undefined), 6))).toBe(true)
    })

    test("True and False Branch", () => {
        let string = expectTokenizes("if (true) return; else return 1;")
        let parser = new Parser(string)
        let result = parser.parseStmt(0)
        expect(result.equals(new ParseResult(new IfStmt(new BooleanExp("true"), new ReturnStmt(), new ReturnExpStmt(new IntegerExp(1))), 10))).toBe(true)
    })
})

// while (exp) stmt
test("Test While Statement", () => {
    let string = expectTokenizes("while (true) return;")
    let parser = new Parser(string)
    let result = parser.parseStmt(0)
    expect(result.equals(new ParseResult(new WhileStmt(new BooleanExp('true'), new ReturnStmt()), 6))).toBe(true)
})

// break;
test("Test Break Statement", () => {
    let string = expectTokenizes("break;")
    let parser = new Parser(string)
    let result = parser.parseStmt(0)
    expect(result.equals(new ParseResult(new BreakStmt(), 2))).toBe(true)
})

// print(exp);
test("Test Print Statement", () => {
    let string = expectTokenizes("print(1 + 1);")
    let parser = new Parser(string)
    let result = parser.parseStmt(0)
    expect(result.equals(new ParseResult(new PrintExpStmt(new OpExp(new IntegerExp(1), new PlusOp(), new IntegerExp(1))), 7))).toBe(true)
})

// exp.methodname(exp*);
describe("Test exp.methodname(exp*)", () => {
    test("exp.methodname()", () => {
        let parser = new Parser([new IntegerToken(1), new DotToken(), new MethodNameToken("myMethod"), new LeftParenToken(), new RightParenToken(), new SemiColonToken()])
        let result = parser.parseStmt(0)
        expect(result.equals(new ParseResult(new ExpMethodExpStmt(new IntegerExp(1), new MethodName("myMethod"), []), 6))).toBe(true)
    })

    test("exp.methodname(exp)", () => {
        let parser = new Parser([new IntegerToken(1), new DotToken(), new MethodNameToken("myMethod"), new LeftParenToken(), new FalseToken(), new RightParenToken(), new SemiColonToken()])
        let result = parser.parseStmt(0)
        expect(result.equals(new ParseResult(new ExpMethodExpStmt(new IntegerExp(1), new MethodName("myMethod"), [new BooleanExp('false')]), 7))).toBe(true)
    })

    test("exp.methodname(exp, exp)", () => {
        let parser = new Parser([new IntegerToken(1), new DotToken(), new MethodNameToken("myMethod"), new LeftParenToken(), new FalseToken(), new CommaToken(), new StringToken('test'), new RightParenToken(), new SemiColonToken()])
        let result = parser.parseStmt(0)
        expect(result.equals(new ParseResult(new ExpMethodExpStmt(new IntegerExp(1), new MethodName("myMethod"), [new BooleanExp('false'), new StringExp('test')]), 9))).toBe(true)
    })
})

// vardec ::= var: type
describe("Testing parseVarDec", () => {
    test("If variable is int type", () => {
        let string = expectTokenizes("var: int")
        let parser = new Parser(string)
        let result = parser.parseVarDec(0)
        expect(result.equals(new ParseResult(new VarDec(new IntType(), new Variable("var")), 3))).toBe(true)
    })
})


// additive_exp ::= multiplitive_exp (additive_op multiplitive_exp)*
describe("Testing parseAccessModifier", () => {
    test("If input is of token PublicToken", () => {
        let string = expectTokenizes("public")
        let parser = new Parser(string)
        let result = parser.parseAccessModifier(0)
        expect(result.equals(new ParseResult(new PublicModifier(), 1))).toBe(true)
    })

    test("If input is of token PrivateToken", () => {
        let string = expectTokenizes("private")
        let parser = new Parser(string)
        let result = parser.parseAccessModifier(0)
        expect(result.equals(new ParseResult(new PrivateModifier(), 1))).toBe(true)
    })

    test("If input is of token ProtecToken", () => {
        let string = expectTokenizes("protec")
        let parser = new Parser(string)
        let result = parser.parseAccessModifier(0)
        expect(result.equals(new ParseResult(new ProtecModifier(), 1))).toBe(true)
    })
})

// methoddec ::= access type methodname(vardec*) stmt 
test("Testing parseMethodDec", () => {
    let string = expectTokenizes("public int methodName() temp: int = 1;")
    let parser = new Parser(string)
    let result = parser.parseMethodDec(0)
    expect(result.equals(new ParseResult(
        new MethodDec(new PublicModifier(), new IntType(), new MethodName("methodName"), [], new VarDecEqualsExpStmt(new VarDec(new IntType(), new Variable("temp")), new IntegerExp(1))),
        11
    ))).toBe(true)
})

// instancedec ::= access vardec = exp;
test("Testing parseInstanceDec", () => {
    let string = expectTokenizes("public temp: string = 1;")
    let parser = new Parser(string)
    let result = parser.parseInstanceDec(0)
    expect(result.equals(new ParseResult(
        new InstanceDec(new PublicModifier(), new VarDec(new StringType(), new Variable("temp")), new IntegerExp(1)),
        7
    ))).toBe(true)
})

// classdec ::= class classname super classname {
//                  instancedec*
//                  construc(vardec*) { super(exp*); stmt* } 
//                  methoddec*
//              }
//              |
//              class classname {
//                  instancedec*;
//                  construc(vardec*) stmt	
//                  methoddec*
//              }
describe("Testing parseClassDec", () => {
    test("With Super class", () => {
        let string = expectTokenizes("class myClass super myClass { public temp: int = 0; construc(yeet: boolean) { super(); } }")
        let parser = new Parser(string)
        let result = parser.parseClassDec(0)
        expect(result.equals(new ParseResult(
            new ClassDec(new ClassNameType("myClass"), 
                         new ClassNameType("myClass"),
                         [new InstanceDec(new PublicModifier(), new VarDec(new IntType, (new Variable("temp"))), new IntegerExp(0))],
                         new Constructor([new VarDec(new BooleanType(), new Variable("yeet"))], [], []),
                         [])
            ,
            25
        ))).toBe(true)
    })

    test("Without Super class", () => {
        let string = expectTokenizes("class myClass { public temp: int = 0; construc(yeet: boolean) { temp = 6; } }")
        let parser = new Parser(string)
        let result = parser.parseClassDec(0)
        expect(result.equals(new ParseResult(
            new ClassDec(new ClassNameType("myClass"), 
                         new ClassNameType("Object"),
                         [new InstanceDec(new PublicModifier(), new VarDec(new IntType, (new Variable("temp"))), new IntegerExp(0))],
                         new Constructor([new VarDec(new BooleanType(), new Variable("yeet"))], [], [new VarEqualsExpStmt(new Variable("temp"), new IntegerExp(6))]),
                         [])
            ,
            23
        ))).toBe(true)
    })
})

// classdec* `thyEntryPoint` stmt
test("Testing thyEntryPoint", () => {
    let string = expectTokenizes("class myClass super myClass { public temp: int = 0; construc(yeet: boolean) { super(); } } thyEntryPoint { var: int = 1; }")
    let parser = new Parser(string)
    let result = parser.parseProgram(0)
    expect(result.equals(new ParseResult(
        new Program([
            new ClassDec(new ClassNameType("myClass"), 
                         new ClassNameType("myClass"),
                         [new InstanceDec(new PublicModifier(), new VarDec(new IntType, (new Variable("temp"))), new IntegerExp(0))],
                         new Constructor([new VarDec(new BooleanType(), new Variable("yeet"))], [], []),
                         [])
        ], new BlockStmt([new VarDecEqualsExpStmt(new VarDec(new IntType(), new Variable("var")), new IntegerExp(1))]))
        ,
        34
    ))).toBe(true)
})

describe("Testing assertTokenHereIs", () => {
    describe("Access Tokens", () => {
        test("PublicToken", () => {
            const parser = new Parser([new PublicToken()])
            expect(parser.assertTokenHereIs(0, AccessToken)).toBe(true)
        })

        test("PrivateToken", () => {
            const parser = new Parser([new PrivateToken()])
            expect(parser.assertTokenHereIs(0, AccessToken)).toBe(true)
        })

        test("ProtecToken", () => {
            const parser = new Parser([new ProtecToken()])
            expect(parser.assertTokenHereIs(0, AccessToken)).toBe(true)
        })
    })

    test("ClassToken", () => {
        const parser = new Parser([new ClassToken()])
        expect(parser.assertTokenHereIs(0, ClassToken)).toBe(true)
    })

    describe("ExpressionTypeTokens", () => {
        test("IntegerToken", () => {
            const parser = new Parser([new IntegerToken()])
            expect(parser.assertTokenHereIs(0, IntegerToken)).toBe(true)
        })

        test("TrueToken", () => {
            const parser = new Parser([new TrueToken()])
            expect(parser.assertTokenHereIs(0, TrueToken)).toBe(true)
        })

        test("FalseToken", () => {
            const parser = new Parser([new FalseToken()])
            expect(parser.assertTokenHereIs(0, FalseToken)).toBe(true)
        })

        test("StringToken", () => {
            const parser = new Parser([new StringToken()])
            expect(parser.assertTokenHereIs(0, StringToken)).toBe(true)
        })
    })

    test("MethodNameToken", () => {
        const parser = new Parser([new MethodNameToken()])
        expect(parser.assertTokenHereIs(0, MethodNameToken)).toBe(true)
    })

    test("NewToken", () => {
        const parser = new Parser([new NewToken()])
        expect(parser.assertTokenHereIs(0, NewToken)).toBe(true)
    })

    describe("OperatorTokens", () => {
        test("PlusToken", () => {
            const parser = new Parser([new PlusToken()])
            expect(parser.assertTokenHereIs(0, PlusToken)).toBe(true)
        })

        test("MinusToken", () => {
            const parser = new Parser([new MinusToken()])
            expect(parser.assertTokenHereIs(0, MinusToken)).toBe(true)
        })

        test("MultiplyToken", () => {
            const parser = new Parser([new MultiplyToken()])
            expect(parser.assertTokenHereIs(0, MultiplyToken)).toBe(true)
        })

        test("DivideToken", () => {
            const parser = new Parser([new DivideToken()])
            expect(parser.assertTokenHereIs(0, DivideToken)).toBe(true)
        })

        test("EqualsToken", () => {
            const parser = new Parser([new EqualsToken()])
            expect(parser.assertTokenHereIs(0, EqualsToken)).toBe(true)
        })

        test("NotEqualsToken", () => {
            const parser = new Parser([new NotEqualsToken()])
            expect(parser.assertTokenHereIs(0, NotEqualsToken)).toBe(true)
        })

        test("GreaterThanEqualToken", () => {
            const parser = new Parser([new GreaterThanEqualToken()])
            expect(parser.assertTokenHereIs(0, GreaterThanEqualToken)).toBe(true)
        })

        test("GreaterThanToken", () => {
            const parser = new Parser([new GreaterThanToken()])
            expect(parser.assertTokenHereIs(0, GreaterThanToken)).toBe(true)
        })

        test("LessThanEqualToken", () => {
            const parser = new Parser([new LessThanEqualToken()])
            expect(parser.assertTokenHereIs(0, LessThanEqualToken)).toBe(true)
        })

        test("LessThanToken", () => {
            const parser = new Parser([new LessThanToken()])
            expect(parser.assertTokenHereIs(0, LessThanToken)).toBe(true)
        })

        test("AssignmentToken", () => {
            const parser = new Parser([new AssignmentToken()])
            expect(parser.assertTokenHereIs(0, AssignmentToken)).toBe(true)
        })
    })

    describe("StatementTokens", () => {
        test("ReturnToken", () => {
            const parser = new Parser([new ReturnToken()])
            expect(parser.assertTokenHereIs(0, ReturnToken)).toBe(true)
        })

        test("IfToken", () => {
            const parser = new Parser([new IfToken()])
            expect(parser.assertTokenHereIs(0, IfToken)).toBe(true)
        })

        test("ElseToken", () => {
            const parser = new Parser([new ElseToken()])
            expect(parser.assertTokenHereIs(0, ElseToken)).toBe(true)
        })

        test("WhileToken", () => {
            const parser = new Parser([new WhileToken()])
            expect(parser.assertTokenHereIs(0, WhileToken)).toBe(true)
        })

        test("BreakToken", () => {
            const parser = new Parser([new BreakToken()])
            expect(parser.assertTokenHereIs(0, BreakToken)).toBe(true)
        })
        
        test("PrintToken", () => {
            const parser = new Parser([new PrintToken()])
            expect(parser.assertTokenHereIs(0, PrintToken)).toBe(true)
        })

        test("ThisToken", () => {
            const parser = new Parser([new ThisToken()])
            expect(parser.assertTokenHereIs(0, ThisToken)).toBe(true)
        })
    })

    test("SuperToken", () => {
        const parser = new Parser([new SuperToken()])
        expect(parser.assertTokenHereIs(0, SuperToken)).toBe(true)
    })

    describe("SymbolTokens", () => {
        test("LeftCurlyToken", () => {
            const parser = new Parser([new LeftCurlyToken()])
            expect(parser.assertTokenHereIs(0, LeftCurlyToken)).toBe(true)
        })

        test("RightCurlyToken", () => {
            const parser = new Parser([new RightCurlyToken()])
            expect(parser.assertTokenHereIs(0, RightCurlyToken)).toBe(true)
        })

        test("LeftParenToken", () => {
            const parser = new Parser([new LeftParenToken()])
            expect(parser.assertTokenHereIs(0, LeftParenToken)).toBe(true)
        })

        test("RightParenToken", () => {
            const parser = new Parser([new RightParenToken()])
            expect(parser.assertTokenHereIs(0, RightParenToken)).toBe(true)
        })

        test("SemiColonToken", () => {
            const parser = new Parser([new SemiColonToken()])
            expect(parser.assertTokenHereIs(0, SemiColonToken)).toBe(true)
        })

        test("DotToken", () => {
            const parser = new Parser([new DotToken()])
            expect(parser.assertTokenHereIs(0, DotToken)).toBe(true)
        })

        test("CommaToken", () => {
            const parser = new Parser([new CommaToken()])
            expect(parser.assertTokenHereIs(0, CommaToken)).toBe(true)
        })
    })

    test("ThyEntryPointToken", () => {
        const parser = new Parser([new ThyEntryPointToken()])
        expect(parser.assertTokenHereIs(0, ThyEntryPointToken)).toBe(true)
    })

    describe("TypeTokens", () => {
        test("VoidTypeToken", () => {
            const parser = new Parser([new VoidTypeToken()])
            expect(parser.assertTokenHereIs(0, TypeToken)).toBe(true)
        })

        test("ClassNameTypeToken", () => {
            const parser = new Parser([new ClassNameTypeToken()])
            expect(parser.assertTokenHereIs(0, TypeToken)).toBe(true)
        })

        test("IntegerTypeToken", () => {
            const parser = new Parser([new IntegerTypeToken()])
            expect(parser.assertTokenHereIs(0, TypeToken)).toBe(true)
        })

        test("StringTypeToken", () => {
            const parser = new Parser([new StringTypeToken()])
            expect(parser.assertTokenHereIs(0, TypeToken)).toBe(true)
        })

        test("BooleanTypeToken", () => {
            const parser = new Parser([new BooleanTypeToken()])
            expect(parser.assertTokenHereIs(0, TypeToken)).toBe(true)
        })
    })

    test("VariableToken", () => {
        const parser = new Parser([new VariableToken()])
        expect(parser.assertTokenHereIs(0, VariableToken)).toBe(true)
    })
})