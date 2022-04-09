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
    IntegerToken,
    TrueToken,
    FalseToken,
    StringToken,
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
const { ExpMethodExpStmt, VarEqualsExpStmt, VarDecEqualsExpStmt, ReturnStmt, ReturnExpStmt, IfStmt, BlockStmt, WhileStmt, BreakStmt, PrintExpStmt } = require('../Parser/Statements');
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

describe("Testing parsePrimaryExp", () => {

    test("If input is of token Variable", () => {
        let parser = new Parser( [new VariableToken("var")])
        let result = parser.parsePrimaryExp(0)
        console.log(result)
        expect( result.equals( new ParseResult( new VariableExp(new Variable("var")), 1))).toBe(true)

    })

    test("If input is of token String", () => {
        let parser = new Parser( [new StringToken("example")])
        let result = parser.parsePrimaryExp(0)
        expect(result.equals( new ParseResult(new StringExp("example"), 1))).toBe(true)
    })
    
    test("If input is of token Integer", () => {
        let parser = new Parser( [new IntegerToken(5)])
        let result = parser.parsePrimaryExp(0)
        expect(result.equals( new ParseResult(new IntegerExp(5), 1))).toBe(true)
    })

    test("If input is of token False", () => {
        let parser = new Parser( [new FalseToken()])
        let result = parser.parsePrimaryExp(0)
        expect(result.equals(new ParseResult(new BooleanExp("false"), 1))).toBe(true)
    })

    test("If input is of token True", () => {
        let parser = new Parser( [new TrueToken()])
        let result = parser.parsePrimaryExp(0)
        expect(result.equals(new ParseResult(new BooleanExp("true"), 1))).toBe(true)
    })
    //TODO FINISH
    test("If input is of token LeftParen", () => {
        let parser = new Parser( [new LeftParenToken(), new IntegerToken(5), new RightParenToken()])
        let result = parser.parsePrimaryExp(0)
        expect(result.equals(new ParseResult( new IntegerExp(5), 3))).toBe(true)
    })

    //TODO
    /*
    test("If input is NewToken", () => {
        let parser = new Parser( [new NewToken()])
        let result = parser.parsePrimaryExp(0)
        //expect(toEqual(result, new ParseResult( new VariableToken("example"), 1))).toBe(true)
        //expect(result.equals(new ParseResult( new New, 1))).toBe(true)
    })
    */



})