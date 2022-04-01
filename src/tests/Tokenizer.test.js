const Tokenizer = require('../Lexer/Tokenizer');
const { PublicToken, PrivateToken, ProtecToken } = require("../Lexer/Tokens/AccessTokens")
const { 
    LeftCurlyToken,
    RightCurlyToken, 
    LeftParenToken, 
    RightParenToken,
    SemiColonToken,
    PeriodToken,
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
    VoidToken,
    ClassNameToken,
    MethodNameToken,
    IntegerTypeToken,
    StringTypeToken,
    BooleanTypeToken
 } = require("../Lexer/Tokens/TypeTokens")
const VariableToken = require("../Lexer/Tokens/VariableToken");
const NewToken = require("../Lexer/Tokens/NewToken")
const ClassToken = require("../Lexer/Tokens/ClassToken")
const SuperToken = require("../Lexer/Tokens/SuperToken")


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

    test("PeriodToken if '.' is passed", () => {
        
        let result = expectTokenizes(".")
        expect(result).toEqual([new PeriodToken()])
    })

    test("PeriodToken if ',' is passed", () => {
        
        let result = expectTokenizes(",")
        expect(result).toEqual([new CommaToken()])
    })

    test("String if a string is passed", () => {

        let result = expectTokenizes('"Hello World"')
        expect(result).toEqual([new StringToken("Hello World")])
    })

    test("VoidToken if a 'Void' is passed", () => {

        let result = expectTokenizes('Void')
        expect(result).toEqual([new VoidToken()])
    })

    test("IntegerTypeToken if a 'Int' is passed", () => {

        let result = expectTokenizes('Int')
        expect(result).toEqual([new IntegerTypeToken()])
    })

    test("StringTypeToken if a 'String' is passed", () => {

        let result = expectTokenizes('String')
        expect(result).toEqual([new StringTypeToken()])
    })

    test("BoolTypeToken if a 'Boolean' is passed", () => {

        let result = expectTokenizes('Boolean')
        expect(result).toEqual([new BooleanTypeToken()])
    })

    test("TrueToken if 'true' is passed", () => {
        
        let result = expectTokenizes("true")
        expect(result).toEqual([new TrueToken()])
    })

    test("WhileToken if 'while' is passed", () => {
        
        let result = expectTokenizes("while")
        expect(result).toEqual([new WhileToken()])
    })

    test("NewToken if 'new' is passed", () => {
        
        let result = expectTokenizes("new")
        expect(result).toEqual([new NewToken()])
    })

    test("ClassToken if 'class' is passed", () => {
        
        let result = expectTokenizes("new")
        expect(result).toEqual([new ClassToken()])
    })

    test("SuperToken if 'super' is passed", () => {
        
        let result = expectTokenizes("new")
        expect(result).toEqual([new SuperToken()])
    })

    test("VariableToken if non-reserved word string is passed", () => {
        
        let result = expectTokenizes("testVariable")
        expect(result).toEqual([new VariableToken("testVariable")])
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
            expect(result).toEqual([new IfToken(), new ElseToken()])
        })

    })

    describe("Multiple valid tokens without whitespace", () => {
        
        test("ifelse: one VariableToken called 'ifelse'", () => {
            let result = expectTokenizes("ifelse")
            expect(result).toEqual([new VariableToken("ifelse")])
        })

        test("{public: one leftCurlyToken, one PublicToken", () => {
            let result = expectTokenizes("{public")
            expect(result).toEqual([new LeftCurlyToken, new PublicToken])
        })

        test("1myVariable: one IntegerToken of value 1, one VariableToken called 'myVariable'", () => {
            let result = expectTokenizes("1myVariable")
            expect(result).toEqual([new IntegerToken(1), new VariableToken("myVariable")])
        })
    })

    describe("Basic Expressions", () => {
        
        test("(4 > 7)", () => {
            let result = expectTokenizes("(4 > 7)")
            expect(result).toEqual([
                new LeftParenToken(),
                new IntegerToken(4),
                new GreaterThanToken(),
                new IntegerToken(7),
                new RightParenToken()
            ])
        })
    })

    describe("Really Long Input", () => {
        
        test("if ( 1 < 2 ) { int var = 69 } else { int var = 96 }", () => {
            let result = expectTokenizes("if ( 1 < 2 ) { int var = 69 } else { int var = 96 }")
            expect(result).toEqual([
                new IfToken(),
                new LeftParenToken(),
                new IntegerToken(1),
                new LessThanToken(),
                new IntegerToken(2),
                new RightParenToken(),
                new LeftCurlyToken(),
                //FIXME: Need something for int here (is it supposed to be variable)
                new VariableToken("int"),
                //------------------------
                new VariableToken("var"),
                new AssignmentToken(),
                new IntegerToken(69),
                new RightCurlyToken(),
                new ElseToken(),
                new LeftCurlyToken(),
                //FIXME: Need something for int here (is it supposed to be variable)
                new VariableToken("int"),
                //------------------------
                new VariableToken("var"),
                new AssignmentToken(),
                new IntegerToken(96),
                new RightCurlyToken(),
            ])
        })
    })
})
