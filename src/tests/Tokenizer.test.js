const Tokenizer = require('../Lexer/Tokenizer');
const { PublicToken, PrivateToken, ProtecToken } = require("../Lexer/Tokens/AccessTokens")
const { 
    LeftCurlyToken,
    RightCurlyToken, 
    LeftParenToken, 
    RightParenToken,
    SemiColonToken,
    DotToken,
    CommaToken
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
    PrintToken
 } = require("../Lexer/Tokens/StatementTokens")
const { 
    IntegerToken,
    TrueToken,
    FalseToken,
    StringToken,
    VoidTypeToken,
    ClassNameTypeToken,
    IntegerTypeToken,
    StringTypeToken,
    BooleanTypeToken
 } = require("../Lexer/Tokens/TypeTokens")
const MethodNameToken = require("../Lexer/Tokens/MethodNameToken")
const VariableToken = require("../Lexer/Tokens/VariableToken");
const ClassToken = require("../Lexer/Tokens/ClassToken")
const SuperToken = require("../Lexer/Tokens/SuperToken");
const { NewToken } = require('../Lexer/Tokens/NewToken');


function expectTokenizes (input) {

    const tokenizer = new Tokenizer(input)
    const result = tokenizer.tokenize()
    return result;
}

function toEqual(input, expected) {

    if (input.length !== expected.length)
        return false;
    
    for (let i = 0; i < input.length; i++) {
        if ( input[i].constructor !== expected[i].constructor ) {
            return false;
        }
    }
    
    return true;
}

describe("Tokens should be empty", () => {
    
    test("if input is empty", () => {

        let result = expectTokenizes("")
        expect(toEqual(result, [])).toBe(true)
    })

    test("if input is only white space", () => {

        let result = expectTokenizes("    ")
        expect(toEqual(result, [])).toBe(true)
    })
})


describe("A single token should equal", () => {

    test("AssignmentToken if '=' is passed", () => {

        let result = expectTokenizes("=")
        expect(toEqual(result, [new AssignmentToken()])).toBe(true)
    })

    test("BreakToken if 'break' is passed", () => {
        
        let result = expectTokenizes("break")
        expect(toEqual(result, [new BreakToken()])).toBe(true)
    })

    test("DivideToken if '/' is passed", () => {
        
        let result = expectTokenizes("/")
        expect(toEqual(result, [new DivideToken()])).toBe(true)
    })

    test("ElseToken if 'else' is passed", () => {
        
        let result = expectTokenizes("else")
        expect(toEqual(result, [new ElseToken()])).toBe(true)
    })

    test("EqualsToken if '==' is passed", () => {
        
        let result = expectTokenizes("==")
        expect(toEqual(result, [new EqualsToken()])).toBe(true)
    })

    test("FalseToken if 'false' is passed", () => {
        
        let result = expectTokenizes("false")
        expect(toEqual(result, [new FalseToken()])).toBe(true)
    })

    test("GreaterThanEqualToken if '>=' is passed", () => {
        
        let result = expectTokenizes(">=")
        expect(toEqual(result, [new GreaterThanEqualToken()])).toBe(true)
    })

    test("GreaterThanToken if '>' is passed", () => {
        
        let result = expectTokenizes(">")
        expect(toEqual(result, [new GreaterThanToken()])).toBe(true)
    })

    test("IfToken if 'if' is passed", () => {
        
        let result = expectTokenizes("if")
        expect(toEqual(result, [new IfToken()])).toBe(true)
    })

    test("IntegerToken if a number is passed", () => {
        
        let result = expectTokenizes("123")
        expect(toEqual(result, [new IntegerToken(123)])).toBe(true)
    })

    test("LeftCurlyToken if '{' is passed", () => {
        
        let result = expectTokenizes("{")
        expect(toEqual(result, [new LeftCurlyToken()])).toBe(true)
    })

    test("LeftParenToken if '(' is passed", () => {
        
        let result = expectTokenizes("(")
        expect(toEqual(result, [new LeftParenToken()])).toBe(true)
    })

    test("LessThanEqualToken if '<=' is passed", () => {
        
        let result = expectTokenizes("<=")
        expect(toEqual(result, [new LessThanEqualToken()])).toBe(true)
    })

    test("LessThanToken if '<' is passed", () => {
        
        let result = expectTokenizes("<")
        expect(toEqual(result, [new LessThanToken()])).toBe(true)
    })

    test("MinusToken if '-' is passed", () => {
        
        let result = expectTokenizes("-")
        expect(toEqual(result, [new MinusToken()])).toBe(true)
    })

    test("MultiplyToken if '*' is passed", () => {
        
        let result = expectTokenizes("*")
        expect(toEqual(result, [new MultiplyToken()])).toBe(true)
    })

    test("NotEqualsToken if '!=' is passed", () => {
        
        let result = expectTokenizes("!=")
        expect(toEqual(result, [new NotEqualsToken()])).toBe(true)
    })

    test("PlusToken if '+' is passed", () => {
        
        let result = expectTokenizes("+")
        expect(toEqual(result, [new PlusToken()])).toBe(true)
    })

    test("PrintToken if 'print' is passed", () => {
        
        let result = expectTokenizes("print")
        expect(toEqual(result, [new PrintToken()])).toBe(true)
    })

    test("PrivateToken if 'private' is passed", () => {
        
        let result = expectTokenizes("private")
        expect(toEqual(result, [new PrivateToken()])).toBe(true)
    })

    test("ProtecToken if 'protec' is passed", () => {
        
        let result = expectTokenizes("protec")
        expect(toEqual(result, [new ProtecToken()])).toBe(true)
    })

    test("PublicToken if 'public' is passed", () => {
        
        let result = expectTokenizes("public")
        expect(toEqual(result, [new PublicToken()])).toBe(true)
    })

    test("ReturnToken if 'return' is passed", () => {
        
        let result = expectTokenizes("return")
        expect(toEqual(result, [new ReturnToken()])).toBe(true)
    })

    test("RightCurlyToken if '}' is passed", () => {
        
        let result = expectTokenizes("}")
        expect(toEqual(result, [new RightCurlyToken()])).toBe(true)
    })

    test("RightParenToken if ')' is passed", () => {
        
        let result = expectTokenizes(")")
        expect(toEqual(result, [new RightParenToken()])).toBe(true)
    })

    test("SemiColonToken if ';' is passed", () => {
        
        let result = expectTokenizes(";")
        expect(toEqual(result, [new SemiColonToken()])).toBe(true)
    })

    test("DotToken if '.' is passed", () => {
        
        let result = expectTokenizes(".")
        expect(toEqual(result, [new DotToken()])).toBe(true)
    })

    test("CommaToken if ',' is passed", () => {
        
        let result = expectTokenizes(",")
        expect(toEqual(result, [new CommaToken()])).toBe(true)
    })

    test("String if a string is passed", () => {

        let result = expectTokenizes('"Hello World"')
        expect(toEqual(result, [new StringToken("Hello World")])).toBe(true)
    })

    test("VoidTypeToken if a 'void' is passed", () => {

        let result = expectTokenizes('void')
        expect(toEqual(result, [new VoidTypeToken()])).toBe(true)
    })

    test("ClassNameTypeToken if a 'class [class name]' is passed", () => {

        let result = expectTokenizes('class myClass')
        expect(toEqual(result, [new ClassToken(), new ClassNameTypeToken("myClass")])).toBe(true)
    })

    test("ClassNameTypeToken if a 'new [class name]' is passed", () => {

        let result = expectTokenizes('new myClass')
        console.log(result)
        expect(toEqual(result, [new NewToken(), new ClassNameTypeToken("myClass")])).toBe(true)
    })

    test("MethodNameToken if a '' is passed", () => {

        let result = expectTokenizes('public myMethod(')
        console.log(result)
        expect(toEqual(result, [new MethodNameToken("myMethod")])).toBe(true)
    })

    test("IntegerTypeToken if a 'int' is passed", () => {

        let result = expectTokenizes('int')
        expect(toEqual(result, [new IntegerTypeToken()])).toBe(true)
    })

    test("StringTypeToken if a 'string' is passed", () => {

        let result = expectTokenizes('string')
        expect(toEqual(result, [new StringTypeToken()])).toBe(true)
    })

    test("BoolTypeToken if a 'boolean' is passed", () => {

        let result = expectTokenizes('boolean')
        expect(toEqual(result, [new BooleanTypeToken()])).toBe(true)
    })

    test("TrueToken if 'true' is passed", () => {
        
        let result = expectTokenizes("true")
        expect(toEqual(result, [new TrueToken()])).toBe(true)
    })

    test("WhileToken if 'while' is passed", () => {
        
        let result = expectTokenizes("while")
        expect(toEqual(result, [new WhileToken()])).toBe(true)
    })

    test("NewToken if 'new' is passed", () => {
        
        let result = expectTokenizes("new")
        expect(toEqual(result, [new NewToken()])).toBe(true)
    })

    test("ClassToken if 'class' is passed", () => {
        
        let result = expectTokenizes("class")
        expect(toEqual(result, [new ClassToken()])).toBe(true)
    })

    test("SuperToken if 'super' is passed", () => {
        
        let result = expectTokenizes("super")
        expect(toEqual(result, [new SuperToken()])).toBe(true)
    })

    test("VariableToken if non-reserved word string is passed", () => {
        
        let result = expectTokenizes("testVariable")
        expect(toEqual(result, [new VariableToken("testVariable")])).toBe(true)
    })

})


describe("Testing Invalid Inputs", () => {
    
    test("Using an invalid string: ret!rn", () => {
        
        const result = () => {
            expectTokenizes("ret!rn")
        }
        expect(result).toThrow(EvalError)
    })

    test("Using an invalid symbol: %", () => {
        
        const result = () => {
            expectTokenizes("%")
        }
        expect(result).toThrow(EvalError)
    })

    test("Using an invalid integer: 11@", () => {
        
        const result = () => {
            expectTokenizes("11@")
        }
        expect(result).toThrow(EvalError)
    })
})

describe("Testing More Complex Inputs", () => {
    //Test multiple valid tokens
    //Test mutliple valid tokens w/o whitespace (should be a variable)
    //Test basic expressions
        //Test basic math expressions

    describe("Multiple valid tokens", () => {

        test("if else: one IfToken, one ElseToken", () => {
            let result = expectTokenizes("if else")
            expect(toEqual(result, [new IfToken(), new ElseToken()])).toBe(true)
        })

    })

    describe("Multiple valid tokens without whitespace", () => {
        
        test("ifelse: one VariableToken called 'ifelse'", () => {
            let result = expectTokenizes("ifelse")
            expect(toEqual(result, [new VariableToken("ifelse")])).toBe(true)
        })

        test("{public: one leftCurlyToken, one PublicToken", () => {
            let result = expectTokenizes("{public")
            expect(toEqual(result, [new LeftCurlyToken, new PublicToken])).toBe(true)
        })

        test("1myVariable: one IntegerToken of value 1, one VariableToken called 'myVariable'", () => {
            let result = expectTokenizes("1myVariable")
            expect(toEqual(result, [new IntegerToken(1), new VariableToken("myVariable")])).toBe(true)
        })
    })

    describe("Basic Expressions", () => {
        
        test("(4 > 7)", () => {
            let result = expectTokenizes("(4 > 7)")
            expect(toEqual(result, [
                new LeftParenToken(),
                new IntegerToken(4),
                new GreaterThanToken(),
                new IntegerToken(7),
                new RightParenToken()
            ])).toBe(true)
        })
    })

    describe("Really Long Input", () => {
        
        test("if ( 1 < 2 ) { int var = 69 } else { int var = 96 }", () => {
            let result = expectTokenizes("if ( 1 < 2 ) { int var = 69 } else { int var = 96 }")
            expect(toEqual(result, [
                new IfToken(),
                new LeftParenToken(),
                new IntegerToken(1),
                new LessThanToken(),
                new IntegerToken(2),
                new RightParenToken(),
                new LeftCurlyToken(),
                new IntegerTypeToken(),
                //------------------------
                new VariableToken("var"),
                new AssignmentToken(),
                new IntegerToken(69),
                new RightCurlyToken(),
                new ElseToken(),
                new LeftCurlyToken(),
                new IntegerTypeToken(),
                //------------------------
                new VariableToken("var"),
                new AssignmentToken(),
                new IntegerToken(96),
                new RightCurlyToken(),
            ])).toBe(true)
        })
    })
})
