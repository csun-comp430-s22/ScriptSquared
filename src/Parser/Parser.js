const AssignmentToken = require('../Lexer/Tokens/AssignmentToken');
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
    VoidTypeToken,
    ClassNameTypeToken,   
    TypeToken,
    StringTypeToken,
    IntegerTypeToken,
    BooleanTypeToken,
    VoidTypeToken
 } = require("../Lexer/Tokens/TypeTokens")
const VariableToken = require("../Lexer/Tokens/VariableToken");

const ParseResult = require("./ParseResult") 
const { NewToken } = require("../Lexer/Tokens/NewToken")
const { PlusOp, MinusOp, MultiplyOp, DivideOp, GreaterThanOp, GreaterThanEqualOp, LessThanOp, LessThanEqualOp, EqualOp, NotEqualOp, DotOp } = require("./Operations");
const { VariableExp, StringExp, IntegerExp, BooleanExp, NewClassExp, OpExp, ExpMethodExp } = require('./Expressions');
const { Variable } = require('./Variable');
const MethodNameToken = require('../Lexer/Tokens/MethodNameToken');
const { ExpMethodExpStmt, VarEqualsExpStmt, VarDecEqualsExpStmt, ReturnStmt, ReturnExpStmt, IfStmt, BlockStmt, WhileStmt, BreakStmt, PrintExpStmt } = require('./Statements');
const { VarDec } = require('./VarDec');
const { Type, IntType, StringType, BooleanType, VoidType, ClassNameType } = require('./Type');
const { PublicModifier, PrivateModifier, ProtecModifier } = require('./AccessModifier');
const { InstanceDec } = require('./InstanceDec');
const { MethodDec } = require('./MethodDec');

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
        const expList = []
        let shouldRun = true

        while (shouldRun === true) {
            try {
                const expParam = this.parseExp(position)
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

    extractCommaSeperatedVardecs(position) {
        const vardecList = []
        let shouldRun = true

        while(shouldRun === true) {
            try {
                const vardec = this.parseVarDec(position)
                position = vardec.position
                vardecList.push(vardec.result)
                this.assertTokenHereIs(position, CommaToken)
                position++

            } catch (e) {
                shouldRun = false
            }
        }

        return { vardecList, position }
    }

    // int | string | boolean | void | classname
    parseType(position) {
        this.assertTokenHereIs(position, TypeToken)
        const typeToken = this.getToken(position)

        // int
        if (typeToken instanceof IntegerTypeToken) {
            return new ParseResult( new IntType(), position + 1 );    
        }

        // string
        else if (typeToken instanceof StringTypeToken) {
            return new ParseResult( new StringType(), position + 1 );
        }

        // boolean
        else if (typeToken instanceof BooleanTypeToken) {
            return new ParseResult( new BooleanType(), position + 1 );
        }

        // void
        else if (typeToken instanceof VoidTypeToken) {
            return new ParseResult( new VoidType(), position + 1 );
        }

        // classname
        else if (typeToken instanceof ClassNameTypeToken) {
            return new ParseResult( new ClassNameType(typeToken.value), position + 1 );
        }

        else {
            throw new EvalError("Expected type; recieved " + typeToken.value)
        }
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
            this.assertTokenHereIs(position + 1, ClassNameTypeToken)
            let ClassNameTypeToken = this.getToken(position + 1)
            this.assertTokenHereIs(position + 2, LeftParenToken)


            const result = this.extractCommaSeperatedExps(position + 3)
            position = result.position
            const expList = result.expList

            this.assertTokenHereIs(position, RightParenToken)

            return new ParseResult(new NewClassExp(ClassNameTypeToken.value, expList), position + 1);
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

    // vardec ::= type var
    parseVarDec(position) {
        const type = this.parseType(position)
        this.assertTokenHereIs(type.position, VariableToken)
        const variableToken = this.getToken(type.position)

        return new ParseResult( new VarDec(type.result, new Variable(variableToken.value) ), type.position + 1 );
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
            const vardec = this.parseVarDec(position)
            this.assertTokenHereIs(vardec.position, EqualsToken)
            const exp = this.parseExp(vardec.position + 1)
            this.assertTokenHereIs(exp.position, SemiColonToken)

            return new ParseResult( new VarDecEqualsExpStmt( vardec.result, exp.result ), exp.position + 1 );
        }

        // { stmt* } 
        else if (token instanceof LeftCurlyToken) {

            const stmtList = []
            let currentPosition = position + 1
            let shouldRun = true

            while(shouldRun) {
                try {

                    const stmt = this.parseStmt(currentPosition)
                    stmtList.push(stmt.result)
                    currentPosition = stmt.position

                } catch(e) {
                    shouldRun = false
                }
            }

            this.assertTokenHereIs(currentPosition, RightCurlyToken)

            return new ParseResult( new BlockStmt(stmtList), currentPosition + 1 );
        }

        // return exp; | return;
        else if (token instanceof ReturnToken) {

            // return;
            try {
                this.assertTokenHereIs(position + 1, SemiColonToken)
                return new ParseResult(new ReturnStmt(), position + 2);

            } 
            // return exp;
            catch (e) {
                const exp = this.parseExp(position + 1)
                this.assertTokenHereIs(exp.position, SemiColonToken)

                return new ParseResult(new ReturnExpStmt(exp.result), exp.position + 1);
            }
        }

        // if (exp) stmt else stmt
        else if (token instanceof IfToken) {
            this.assertTokenHereIs(position + 1, LeftParenToken)
            const guard = this.parseExp(position + 2)
            this.assertTokenHereIs(guard.position, RightParenToken)
            const trueBranch = this.parseStmt(guard.position + 1)
            this.assertTokenHereIs(trueBranch.position, ElseToken)
            const falseBranch = this.parseStmt(trueBranch.position + 1)

            return new ParseResult( new IfStmt(guard.result, trueBranch.result, falseBranch.result), falseBranch.position );
        }

        // while (exp) stmt
        else if (token instanceof WhileToken) {
            this.assertTokenHereIs(position + 1, LeftParenToken)
            const guard = this.parseExp(position + 2)
            this.assertTokenHereIs(guard.position, RightParenToken)
            const stmt = this.parseStmt(guard.position + 1)

            return new ParseResult( new WhileStmt( guard.result, stmt.result ), stmt.position );
        }

        // break;
        else if (token instanceof BreakToken) {
            this.assertTokenHereIs(position + 1, SemiColonToken)

            return new ParseResult( new BreakStmt(), position + 2 );
        }

        // print(exp);
        else if (token instanceof PrintToken) {
            this.assertTokenHereIs(position + 1, LeftParenToken)
            const exp = this.parseExp(position + 2)
            this.assertTokenHereIs(exp.position, RightParenToken)
            this.assertTokenHereIs(exp.position + 1, SemiColonToken)

            return new ParseResult( new PrintExpStmt(exp.result), exp.position + 2 );
        }

        // exp.methodname(exp*);
        else {
            const exp = this.parseExp(position)

            if ( !(exp.result instanceof ExpMethodExp) ) 
                throw new EvalError("expected ExpMethodExp;")
            
            this.assertTokenHereIs(exp.position, SemiColonToken)
            return new ParseResult(new ExpMethodExpStmt(exp.result.parentExp,
                                                        exp.result.methodName,
                                                        exp.result.parameterExpsArray), 
                                    exp.position + 1);
        } 
    }

    // access ::= public | private | protec
    parseAccessModifier(position) {
        this.assertTokenHereIs(position, AccessToken)
        const accessToken = this.getToken(position)

        // public
        if (accessToken instanceof PublicToken) {
            return new ParseResult( new PublicModifier(), position + 1 );    
        }

        // private
        else if (accessToken instanceof PrivateToken) {
            return new ParseResult( new PrivateModifier(), position + 1 );
        }

        // protec
        else if (accessToken instanceof ProtecToken) {
            return new ParseResult( new ProtecModifier(), position + 1 );
        }

        else {
            throw new EvalError("expected AccessToken; recieved " + accessToken.value)
        }
    }

    // methoddec ::= access type methodname(vardec*) stmt 
    parseMethodDec(position) {
        const accessMod = this.parseAccessModifier(position)
        const type = this.parseType(accessMod.position)
        this.assertTokenHereIs(type.position, MethodNameToken)
        const methodNameToken = this.getToken(type.position)
        this.assertTokenHereIs(type.position + 1, LeftParenToken)

        const result = this.extractCommaSeperatedVardecs(type.position + 2)

        this.assertTokenHereIs(result.position, RightParenToken)
        const stmt = this.parseStmt(result.position + 1)

        return new ParseResult( new MethodDec(accessMod.result, type.result, methodNameToken.value, result.vardecList, stmt.result), stmt.position);
    }

    //instancedec ::= access vardec = exp;
    parseInstanceDec(position) {
        const accessMod = this.parseAccessModifier(position)
        const vardec = this.parseVarDec(accessMod.position)
        this.assertTokenHereIs(vardec.position, EqualsToken)
        const exp = this.parseExp(vardec.position + 1)
        this.assertTokenHereIs(exp.position, SemiColonToken)

        return new ParseResult( new InstanceDec(accessMod.result, vardec.result, exp.result), exp.position + 1 );
    }

    // classdec ::= class classname super classname {
    //                  instancedec*;
    //                  construc(vardec*) { super(exp*); stmt* }	// vardec separated by comma. 
    //                  methoddec*
    //              }
    parseClassDec(position) {

    }

    // classdec* `thyEntryPoint` { stmt* }
    parseProgram(position) {

    }
    
}

module.exports = {
    Parser
}