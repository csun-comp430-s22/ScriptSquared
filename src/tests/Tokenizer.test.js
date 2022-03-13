const Tokenizer = require('../Lexer/Tokenizer');
const AssignmentToken = require('../Lexer/Tokens/AssignmentToken');
const BreakToken = require('../Lexer/Tokens/BreakToken');
const DivideToken = require('../Lexer/Tokens/DivideToken');
const ElseToken = require('../Lexer/Tokens/ElseToken');
const EqualsToken = require('../Lexer/Tokens/EqualsToken')
const FalseToken = require('../Lexer/Tokens/FalseToken');
const GreaterThanEqualToken = require('../Lexer/Tokens/GreaterThanEqualToken');
const GreaterThanToken = require('../Lexer/Tokens/GreaterThanToken');
const IfToken = require('../Lexer/Tokens/IfToken');
const IntegerToken = require('../Lexer/Tokens/IntegerToken');
const LeftCurlyToken = require('../Lexer/Tokens/LeftCurlyToken');
const LeftParenToken = require('../Lexer/Tokens/LeftParenToken');
const LessThanEqualToken = require('../Lexer/Tokens/LessThanEqualToken');
const LessThanToken = require('../Lexer/Tokens/LessThanToken');
const MinusToken = require('../Lexer/Tokens/MinusToken');
const MultiplyToken = require('../Lexer/Tokens/MultiplyToken');
const NotEqualsToken = require('../Lexer/Tokens/NotEqualsToken');
const PlusToken = require('../Lexer/Tokens/PlusToken');
const PrintToken = require('../Lexer/Tokens/PrintToken');
const PrivateToken = require('../Lexer/Tokens/PrivateToken');
const ProtecToken = require('../Lexer/Tokens/ProtecToken');
const PublicToken = require('../Lexer/Tokens/PublicToken');
const ReturnToken = require('../Lexer/Tokens/ReturnToken');
const RightCurlyToken = require('../Lexer/Tokens/RightCurlyToken');
const RightParenToken = require('../Lexer/Tokens/RightParenToken');
const SemiColonToken = require('../Lexer/Tokens/SemiColonToken');
const TrueToken = require('../Lexer/Tokens/TrueToken');
const VariableToken = require("../Lexer/Tokens/VariableToken");
const WhileToken = require('../Lexer/Tokens/WhileToken');



function expectTokenizes (input) {

    const tokenizer = new Tokenizer(input)
    const result = tokenizer.tokenize()
    return result;
}


describe("Tokens should be empty", () => {
    
    test("if input is empty", () => {

        let result = expectTokenizes("")
        expect(result).toEqual([])
    })

    test("if input is only white space", () => {

        let result = expectTokenizes("    ")
        expect(result).toEqual([])
    })
})


describe("A single token should equal", () => {

    test("AssignmentToken if '=' is passed", () => {

        let result = expectTokenizes("=")
        expect(result).toEqual([new AssignmentToken()])
    })

    test("BreakToken if 'break' is passed", () => {
        
        let result = expectTokenizes("break")
        expect(result).toEqual([new BreakToken()])
    })

    test("DivideToken if '/' is passed", () => {
        
        let result = expectTokenizes("/")
        expect(result).toEqual([new DivideToken()])
    })

    test("ElseToken if 'else' is passed", () => {
        
        let result = expectTokenizes("else")
        expect(result).toEqual([new ElseToken()])
    })

    test("EqualsToken if '==' is passed", () => {
        
        let result = expectTokenizes("==")
        expect(result).toEqual([new EqualsToken()])
    })

    test("FalseToken if 'false' is passed", () => {
        
        let result = expectTokenizes("false")
        expect(result).toEqual([new FalseToken()])
    })

    test("GreaterThanEqualToken if '>=' is passed", () => {
        
        let result = expectTokenizes(">=")
        expect(result).toEqual([new GreaterThanEqualToken()])
    })

    test("GreaterThanToken if '>' is passed", () => {
        
        let result = expectTokenizes(">")
        expect(result).toEqual([new GreaterThanToken()])
    })

    test("IfToken if 'if' is passed", () => {
        
        let result = expectTokenizes("if")
        expect(result).toEqual([new IfToken()])
    })

    test("IntegerToken if a number is passed", () => {
        
        let result = expectTokenizes("123")
        expect(result).toEqual([new IntegerToken(123)])
    })

    test("LeftCurlyToken if '{' is passed", () => {
        
        let result = expectTokenizes("{")
        expect(result).toEqual([new LeftCurlyToken()])
    })

    test("LeftParenToken if '(' is passed", () => {
        
        let result = expectTokenizes("(")
        expect(result).toEqual([new LeftParenToken()])
    })

    test("LessThanEqualToken if '<=' is passed", () => {
        
        let result = expectTokenizes("<=")
        expect(result).toEqual([new LessThanEqualToken()])
    })

    test("LessThanToken if '<' is passed", () => {
        
        let result = expectTokenizes("<")
        expect(result).toEqual([new LessThanToken()])
    })

    test("MinusToken if '-' is passed", () => {
        
        let result = expectTokenizes("-")
        expect(result).toEqual([new MinusToken()])
    })

    test("MultiplyToken if '*' is passed", () => {
        
        let result = expectTokenizes("*")
        expect(result).toEqual([new MultiplyToken()])
    })

    test("NotEqualsToken if '!=' is passed", () => {
        
        let result = expectTokenizes("!=")
        expect(result).toEqual([new NotEqualsToken()])
    })

    test("PlusToken if '+' is passed", () => {
        
        let result = expectTokenizes("+")
        expect(result).toEqual([new PlusToken()])
    })

    test("PrintToken if 'print' is passed", () => {
        
        let result = expectTokenizes("print")
        expect(result).toEqual([new PrintToken()])
    })

    test("PrivateToken if 'private' is passed", () => {
        
        let result = expectTokenizes("private")
        expect(result).toEqual([new PrivateToken()])
    })

    test("ProtecToken if 'protec' is passed", () => {
        
        let result = expectTokenizes("protec")
        expect(result).toEqual([new ProtecToken()])
    })

    test("PublicToken if 'public' is passed", () => {
        
        let result = expectTokenizes("public")
        expect(result).toEqual([new PublicToken()])
    })

    test("ReturnToken if 'return' is passed", () => {
        
        let result = expectTokenizes("return")
        expect(result).toEqual([new ReturnToken()])
    })

    test("RightCurlyToken if '}' is passed", () => {
        
        let result = expectTokenizes("}")
        expect(result).toEqual([new RightCurlyToken()])
    })

    test("RightParenToken if ')' is passed", () => {
        
        let result = expectTokenizes(")")
        expect(result).toEqual([new RightParenToken()])
    })

    test("SemiColonToken if ';' is passed", () => {
        
        let result = expectTokenizes(";")
        expect(result).toEqual([new SemiColonToken()])
    })

    test("TrueToken if 'true' is passed", () => {
        
        let result = expectTokenizes("true")
        expect(result).toEqual([new TrueToken()])
    })

    test("VariableToken if non-reserved word string is passed", () => {
        
        let result = expectTokenizes("testVariable")
        expect(result).toEqual([new VariableToken("testVariable")])
    })

    test("WhileToken if 'while' is passed", () => {
        
        let result = expectTokenizes("while")
        expect(result).toEqual([new WhileToken()])
    })
})