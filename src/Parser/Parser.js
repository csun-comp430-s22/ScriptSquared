const AssignmentToken = require('../Lexer/Tokens/AssignmentToken');
const { PublicToken, PrivateToken, ProtecToken } = require("../Lexer/Tokens/AccessTokens")
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
    LessThanToken
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
    VoidToken
 } = require("../Lexer/Tokens/TypeTokens")
const VariableToken = require("../Lexer/Tokens/VariableToken");

const ParseResult = require("./ParseResult") 
const { PlusOp, MinusOp, MultiplyOp, DivideOp, GreaterThanOp, GreaterThanEqualOp, LessThanOp, LessThanEqualOp, EqualOp, NotEqualOp, DotOp } = require("./Operations")

class Parser {

    constructor(tokensArray) {
        this.tokens = tokensArray
    }

    getToken(position) {
        if (position >= 0 && position < this.tokens.size()) {
            return this.tokens[position]
        } else {
            throw new EvalError("Invalid token position: " + position)
        }
    }

    assertTokenHereIs(position, expectedToken) {
        const recieved = this.getToken(position)

        // TODO: Change equals/there is no equals function on classes
        if (!expectedToken.equals(recieved)) {
            throw new EvalError("expected: " + expectedToken + "; recieved: " + recieved)
        }
    }

    parseStmt(position) {
        const token = this.getToken(position)

        // Return;
        if (token.constructor === ReturnToken.constructor) {
            
        }
    }
}