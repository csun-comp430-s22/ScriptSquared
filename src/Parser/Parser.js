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
    PrintToken,
    ThisToken
 } = require("../Lexer/Tokens/StatementTokens")
const { 
    IntegerToken,
    TrueToken,
    FalseToken,
    StringToken,
    VoidToken,
    ClassNameToken,   
    TypeToken
 } = require("../Lexer/Tokens/TypeTokens")
const VariableToken = require("../Lexer/Tokens/VariableToken");

const ParseResult = require("./ParseResult") 
const { NewToken } = require("../Lexer/Tokens/NewToken")
const { PlusOp, MinusOp, MultiplyOp, DivideOp, GreaterThanOp, GreaterThanEqualOp, LessThanOp, LessThanEqualOp, EqualOp, NotEqualOp, DotOp } = require("./Operations");
const { VariableExp, StringExp, IntegerExp, BooleanExp, NewClassExp, OpExp, ExpMethodExp } = require('./Expressions');
const { Variable } = require('./Variable');
const MethodNameToken = require('../Lexer/Tokens/MethodNameToken');
const { ExpMethodExpStmt, VarEqualsExpStmt, VarDecEqualsExpStmt } = require('./Statements');
const { VarDec } = require('./VarDec');
const { Type } = require('./Type');

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

    assertTokenHereIs(position, expectedType) {
        const recieved = this.getToken(position)

        if (recieved instanceof expectedType) {
            throw new EvalError("expected: " + expectedType + "; recieved: " + recieved)
        }
    }

    extractCommaSeperatedExps(position) {
        let expList = []
        let shouldRun = true

        while (shouldRun === true) {
            try {
                let expParam = this.parseExp(position)
                position = expParam.position
                expList.push(expParam.result)
                this.assertTokenHereIs(position, CommaToken)
                position++
                
            } catch (e) {
                shouldRun = false
            }
        }

        return { expList, position }
    }

    // primary_exp ::= i | s | b | var | ‘(‘ exp ‘)’ | new classname(exp*)
    parsePrimaryExp(position)
    {
        const token = this.getToken(position)
        let shouldRun = true
        
        if (token instanceof VariableToken)
        {
            return new ParseResult(new VariableExp(new Variable(VariableToken.value)), position + 1)
        }
        else if (token instanceof StringToken)
        {
            return new ParseResult(new StringExp(StringToken.value), position + 1)
        }
        else if (token instanceof IntegerToken)
        {
            return new ParseResult(new IntegerExp(IntegerToken.value), position + 1)
        }
        else if (token instanceof TrueToken)
        {
            return new ParseResult(new BooleanExp(TrueToken.value), position + 1)
        }
        else if (token instanceof FalseToken)
        {
            return new ParseResult(new BooleanExp(TrueToken.value), position + 1)
        }
        else if (token instanceof LeftParenToken)
        {
            let inParens = this.parseExp(position + 1)
            this.assertTokenHereIs(inParens.position, RightParenToken)
            return new ParseResult(inParens.result, inParens.position + 1)
        }
        else if (token instanceof NewToken)
        {
            this.assertTokenHereIs(position + 1, ClassNameToken)
            let classNameToken = this.getToken(position + 1)
            this.assertTokenHereIs(position + 2, LeftParenToken)


            const result = this.extractCommaSeperatedExps(position + 3)
            position = result.position
            const expList = result.expList

            this.assertTokenHereIs(position, RightParenToken)

            return new ParseResult(new NewClassExp(classNameToken.value, expList), position + 1);
        }
        
        else {
            throw new EvalError("Expected primary expression; recieved " + token)
        }
        
    }

    // method_exp ::= primary_exp ( ‘.’ methodname ‘(‘ exp* ‘)’ )*
    parseMethodExp(position) {
        let current = this.parsePrimaryExp(position)
        let shouldRun = true

        while(shouldRun === true) {
            try {
                this.assertTokenHereIs(current.position, DotToken)
                this.assertTokenHereIs(current.position + 1, MethodNameToken)
                const methodNameToken = this.getToken(current.position + 1)
                this.assertTokenHereIs(current.position + 2, LeftParenToken)
                
                const result = this.extractCommaSeperatedExps(position + 3)
                position = result.position
                const expList = result.expList

                this.assertTokenHereIs(position, RightParenToken)
                
                current = new ParseResult(new ExpMethodExp(current.result, methodNameToken.value, expList), position + 1)
            } catch (e) {
                shouldRun = false
            }
        }

        return current;
    }

    // multiplitive_op ::= * | /
    parseMultDivOp(position) {
        const token = this.getToken(position)

        if (token instanceof MultiplyToken) {
            return new ParseResult(new MultiplyOp(), position + 1)
        }
        if (token instanceof DivideToken) {
            return new ParseResult(new DivideOp(), position + 1)
        }
        throw new EvalError("Expected * or -; recieved: " + token)
    }

    // multiplitive_exp ::= method_exp (multiplitive_op method_exp )*
    parseMultDivExp(position) {
        let current = this.parseMethodExp(position)
        let shouldRun = true

        while(shouldRun === true) {
            try {
                    const multDivOp = this.parseMultDivOp(current.position)
                    const anotherPrimary = this.parseMethodExp(multDivOp.position)
                    current = new ParseResult(new OpExp(current.result, multDivOp.result, anotherPrimary.result))
            } catch (e) {
                shouldRun = false
            }
        }

        return current;
    }

    // additive_op ::= + | -
    parseAddSubOp(position) {
        const token = this.getToken(position)

        if(token instanceof PlusToken) {
            return new ParseResult(new PlusOp(), position + 1)
        }
        if (token instanceof MinusToken) {
            return new ParseResult(new MinusOp(), position + 1)
        }
        throw new EvalError("Expected + or -; recieved: " + token)

    }
    
    // additive_exp ::= multiplitive_exp (additive_op multiplitive_exp)*
    parseAddSubExp(position) {
        let current = this.parseMultDivExp(position)
        let shouldRun = true

        while(shouldRun) {
            try {
                   const addSubOp = this.parseAddSubOp(current.position)
                   const other = this.parseMultDivExp(addSubOp.position)
                   current = new ParseResult(new OpExp(current.result, addSubOp.result, other.result), other.position)
            } catch (e) {
                shouldRun = false
            }
        }

        return current;
    }
    
    // comparison_op ::= ‘>’ | ‘<’ | ‘>=’ | ‘<=’ | ‘==’ | ‘!=’
    parseComparisonOp(position) {
        const token = this.getToken(position)

        if (token instanceof EqualsToken) {
            return new ParseResult(new EqualOp(), position + 1)
        }
        if (token instanceof NotEqualsToken) {
            return new ParseResult(new NotEqualOp(), position + 1)
        }
        if (token instanceof GreaterThanEqualToken) {
            return new ParseResult(new GreaterThanEqualOp(), position + 1)
        }
        if (token instanceof LessThanEqualToken) {
            return new ParseResult(new LessThanEqualOp(), position + 1)
        }
        if (token instanceof LessThanToken) {
            return new ParseResult(new LessThanOp(), position + 1)
        }
        if (token instanceof GreaterThanToken) {
            return new ParseResult(new GreaterThanOp(), position + 1)
        }
        throw new EvalError("Expected '==' or '!=' or '>=' or '<=' or '>' or '<'; recieved: " + token)
    }

    // comparison_exp ::= additive_exp | additive_exp (‘>’ | ‘<’ | ‘>=’ | ‘<=’ | ‘==’ | ‘!=”)  additive_exp
    parseComparisonExp(position) {
        let current = this.parseAddSubExp(position)

        try {
            const comparsionOp = this.parseComparisonOp(current.position)
            const other = this.parseAddSubExp(comparsionOp.position)
            current = new ParseResult(new OpExp(current.result, comparsionOp.result, other.result), other.position)
        } catch (e) {}

        return current;
    }

    // exp ::= comparison_exp | this 
    parseExp(position) {
        if (this.getToken(position) instanceof ThisToken)
            return; // TODO: return 'this' object

        return this.parseComparisonExp(position);
    }


    // stmt ::= var = exp; | vardec = exp; |  
    //         { stmt* } |	// stmt’s separated by semi-colons
    //         return exp; |
    //         return; | 
    //         if (exp) stmt else stmt |
    //         while (exp) stmt | 
    //         break;	|
    //         print(exp); |
    //         exp.methodname(exp*);

    parseStmt(position) {
        const token = this.getToken(position)

        // var = exp;
        if (token instanceof VariableToken) {
            this.assertTokenHereIs(position + 1, EqualsToken)
            const exp = this.parseExp(position + 2)
            this.assertTokenHereIs(exp.position, SemiColonToken)

            return new ParseResult(new VarEqualsExpStmt(new Variable(token.value), exp.result), exp.position + 1);
        }

        // vardec = exp;
        else if (token instanceof TypeToken) {
            this.assertTokenHereIs(position + 1, VariableToken)
            const variable = this.getToken(position + 1)
            this.assertTokenHereIs(position + 2, EqualsToken)
            const exp = this.parseExp(position + 3)
            this.assertTokenHereIs(exp.position, SemiColonToken)

            return new ParseResult( new VarDecEqualsExpStmt( new VarDec(new Type(token.value), new Variable(variable.value) ), exp.result ), exp.position + 1 );
        }

        // return exp; | return;
        else if (token instanceof ReturnToken) {

        }

        // if (exp) stmt else stmt
        else if (token instanceof IfToken) {

        }

        // while (exp) stmt
        else if (token instanceof WhileToken) {

        }

        // break;
        else if (token instanceof BreakToken) {

        }

        // print(exp);
        else if (token instanceof PrintToken) {

        }

        // exp.methodname(exp*);
        else {
            const result = this.parseExp(position)

            if ( !(result.result instanceof ExpMethodExp) ) 
                throw new EvalError("expected ExpMethodExp;")
            
            this.assertTokenHereIs(result.position, SemiColonToken)
            return new ParseResult(new ExpMethodExpStmt(result.result), result.position + 1);
        } 
    }

    
}

module.exports = {
    Parser
}