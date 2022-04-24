const { Parser } = require('../Parser/Parser')
const {
    Type,
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
const { PlusOp, MinusOp, MultiplyOp, DivideOp, GreaterThanOp, GreaterThanEqualOp, LessThanOp, LessThanEqualOp, EqualOp, NotEqualOp, DotOp } = require("../Parser/Operations");
const { VariableExp, StringExp, IntegerExp, BooleanExp, NewClassExp, OpExp, ExpMethodExp } = require('../Parser/Expressions');
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
const { parseList, arraysEqual } = require('../utils');
const { Constructor } = require('../Parser/Constructor');
const { MethodName } = require('../Parser/MethodName')
const { IntegerToken, TrueToken, FalseToken, StringToken } = require('../Lexer/Tokens/ExpressionTypeTokens')

function assertParses(inputTokenList, expected) {

    parser = new Parser(inputTokenList)
    assertEqual(expected, parser.parseExp(0))
}

function assertParsesStmt(inputTokenList, expected) {

    parser = new Parser(inputTokenList)
    assertEqual(expected, parser.parseStmt(0))
}

function assertParseProgram(inputTokenList, expected) {

    parser = new Parser(inputTokenList)
    assertEqual(expected, parser.parseProgram())
}

function expectTokenizes (input) {
    const tokenizer = new Tokenizer(input)
    const result = tokenizer.tokenize()
    return result;
}

let parser = new Parser([new NewToken(), new ClassNameTypeToken("myClass"), new LeftParenToken(), new IntegerToken(5), new CommaToken(), new IntegerToken(6), new CommaToken(), new TrueToken(), new RightParenToken()])
let result = parser.parsePrimaryExp(0)


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

// primary_exp ::= i | s | b | var | ‘(‘ exp ‘)’ | new classname(exp*)
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
    let string = expectTokenizes("public int methodName() int temp = 1;")
    let parser = new Parser(string)
    let result = parser.parseMethodDec(0)
    expect(result.equals(new ParseResult(
        new MethodDec(new PublicModifier(), new IntType(), new MethodName("methodName"), [], new VarDecEqualsExpStmt(new VarDec(new IntType(), new Variable("temp")), new IntegerExp(1))),
        10
    ))).toBe(true)
})

// instancedec ::= access vardec = exp;
test("Testing parseInstanceDec", () => {
    let string = expectTokenizes("public string temp = 1;")
    let parser = new Parser(string)
    let result = parser.parseInstanceDec(0)
    expect(result.equals(new ParseResult(
        new InstanceDec(new PublicModifier(), new VarDec(new StringType(), new Variable("temp")), new IntegerExp(1)),
        6
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
        let string = expectTokenizes("class myClass super myClass { public int temp = 0; construc(boolean yeet) { super(); } }")
        let parser = new Parser(string)
        let result = parser.parseClassDec(0)
        expect(result.equals(new ParseResult(
            new ClassDec(new ClassNameType("myClass"), 
                         new ClassNameType("myClass"),
                         [new InstanceDec(new PublicModifier(), new VarDec(new IntType, (new Variable("temp"))), new IntegerExp(0))],
                         new Constructor([new VarDec(new BooleanType(), new Variable("yeet"))], [], []),
                         [])
            ,
            23
        ))).toBe(true)
    })

    test("Without Super class", () => {
        let string = expectTokenizes("class myClass { public int temp = 0; construc(boolean yeet) { temp = 6; } }")
        let parser = new Parser(string)
        let result = parser.parseClassDec(0)
        expect(result.equals(new ParseResult(
            new ClassDec(new ClassNameType("myClass"), 
                         new ClassNameType(undefined),
                         [new InstanceDec(new PublicModifier(), new VarDec(new IntType, (new Variable("temp"))), new IntegerExp(0))],
                         new Constructor([new VarDec(new BooleanType(), new Variable("yeet"))], [], [new VarEqualsExpStmt(new Variable("temp"), new IntegerExp(6))]),
                         [])
            ,
            21
        ))).toBe(true)
    })
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