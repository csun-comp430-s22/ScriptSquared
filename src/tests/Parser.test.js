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
        let result = new Parser( new IntegerTypeToken)
        expect(toEqual(result, IntType)).toBe(true)
    } )
    test("If input is of token type string", () => {
        let result = new Parser( new StringTypeToken)
        expect(toEqual(result, StringType)).toBe(true)
    } )
    test("If input is of token type boolean", () => {
        let result = new Parser( new BooleanTypeToken)
        expect(toEqual(result, BooleanType)).toBe(true)
    } )
    test("If input is of token type void", () => {
        let result = new Parser( new  VoidTypeToken)
        expect(toEqual(result, VoidType)).toBe(true)
    } )
    test("If input is of token type classname", () => {
        let result = new Parser( new ClassNameTypeToken("example class"))
        expect(toEqual(result, new ClassNameType("example class"))).toBe(true)
    } )
})

describe("Testing parsePrimaryExp", () => {

    test("If input is of token Variable", () => {
        let result = new Parser( new VariableToken("example"))
        expect(toEqual(result, new VariableExp("example"))).toBe(true)
    })

    test("If input is of token String", () => {
        let result = new Parser( new StringToken("example"))
        expect(toEqual(result, new StringExp("example"))).toBe(true)
    })
    
    test("If input is of token Integer", () => {
        let result = new Parser( new IntegerToken(5))
        expect(toEqual(result, new IntegerExp(5))).toBe(true)
    })

    test("If input is of token False", () => {
        let result = new Parser( new FalseToken())
        expect(toEqual(result, new BooleanExp("false"))).toBe(true)
    })

    test("If input is of token True", () => {
        let result = new Parser( new LeftParenToken())
        expect(toEqual(result, new BooleanExp("true"))).toBe(true)
    })
    //TODO FINISH
    test("If input is of token LeftParen", () => {
        let result = new Parser( [new LeftParenToken(), new IntegerToken(5), new RightParenToken()])
        expect(toEqual(result, new VariableToken("example"))).toBe(true)
    })

    test("If input is NewToken", () => {
        let result = new Parser( new VariableToken("example"))
        expect(toEqual(result, new VariableToken("example"))).toBe(true)
    })



})