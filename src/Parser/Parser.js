const { PublicToken, PrivateToken, ProtecToken, AccessToken } = require("../Lexer/Tokens/AccessTokens");
const { 
    LeftCurlyToken,
    RightCurlyToken, 
    LeftParenToken, 
    RightParenToken,
    SemiColonToken,
    DotToken,
    CommaToken,
} = require("../Lexer/Tokens/SymbolToken");
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
 } = require("../Lexer/Tokens/OperatorTokens");
const { 
    ReturnToken,
    IfToken,
    ElseToken,
    WhileToken,
    BreakToken,
    PrintToken,
    ThisToken
 } = require("../Lexer/Tokens/StatementTokens");
const { VoidTypeToken, ClassNameTypeToken, TypeToken, StringTypeToken, IntegerTypeToken, BooleanTypeToken } = require("../Lexer/Tokens/TypeTokens");
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
const { Program } = require('./Program');
const ThyEntryPointToken = require('../Lexer/Tokens/ThyEntryPointToken');
const ClassToken = require('../Lexer/Tokens/ClassToken');
const { ClassDec } = require('./ClassDec');
const SuperToken = require('../Lexer/Tokens/SuperToken');
const { parseList, instance_of } = require('../utils');
const { Constructor } = require('./Constructor');
const { IntegerToken, TrueToken, FalseToken, StringToken } = require("../Lexer/Tokens/ExpressionTypeTokens");
const { MethodName } = require("./MethodName");
const ConstructorToken = require("../Lexer/Tokens/ConstructorToken");

class Parser {

    constructor(tokensArray) {
        this.tokens = tokensArray
    }

    getToken(position) {
        if (position >= 0 && position < this.tokens.length) {
            return this.tokens[position]
        } else {
            throw new EvalError("Invalid token position: " + position)
        }
    }

    assertTokenHereIs(position, expectedType) {
        const recieved = this.getToken(position)

        if (!instance_of(recieved, expectedType)) {
            throw new EvalError("expected: " + expectedType + "; recieved: " + recieved)
        }

        return true;
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
        if (instance_of(typeToken, IntegerTypeToken)) {
            return new ParseResult( new IntType(), position + 1 );    
        }

        // string
        else if (instance_of(typeToken, StringTypeToken)) {
            return new ParseResult( new StringType(), position + 1 );
        }

        // boolean
        else if (instance_of(typeToken, BooleanTypeToken)) {
            return new ParseResult( new BooleanType(), position + 1 );
        }

        // void
        else if (instance_of(typeToken, VoidTypeToken)) {
            return new ParseResult( new VoidType(), position + 1 );
        }

        // classname
        else if (instance_of(typeToken, ClassNameTypeToken)) {
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
        
        if (instance_of(token, VariableToken))
        {
            return new ParseResult(new VariableExp(new Variable(token.value)), position + 1)
        }
        else if (instance_of(token, StringToken))
        {
            return new ParseResult(new StringExp(token.value), position + 1)
        }
        else if (instance_of(token, IntegerToken))
        {
            return new ParseResult(new IntegerExp(token.value), position + 1)
        }
        else if (instance_of(token, TrueToken))
        {
            return new ParseResult(new BooleanExp(token.value), position + 1)
        }
        else if (instance_of(token, FalseToken))
        {
            return new ParseResult(new BooleanExp(token.value), position + 1)
        }
        else if (instance_of(token, LeftParenToken))
        {
            let inParens = this.parseExp(position + 1)
            this.assertTokenHereIs(inParens.position, RightParenToken)
            return new ParseResult(inParens.result, inParens.position + 1)
        }
        else if (instance_of(token, NewToken))
        {
            this.assertTokenHereIs(position + 1, ClassNameTypeToken)
            let classNameTypeToken = this.getToken(position + 1)
            this.assertTokenHereIs(position + 2, LeftParenToken)


            const result = this.extractCommaSeperatedExps(position + 3)
            position = result.position
            const expList = result.expList

            this.assertTokenHereIs(position, RightParenToken)

            return new ParseResult(new NewClassExp(new ClassNameType(classNameTypeToken.value), expList), position + 1);
        }
        
        else {
            throw new EvalError("Expected primary expression; recieved " + token.value)
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
                
                const result = this.extractCommaSeperatedExps(current.position + 3)
                position = result.position
                const expList = result.expList

                this.assertTokenHereIs(position, RightParenToken)
                
                current = new ParseResult(new ExpMethodExp(current.result, new MethodName(methodNameToken.value), expList), position + 1)
            } catch (e) {
                shouldRun = false
            }
        }

        return current;
    }

    // multiplitive_op ::= * | /
    parseMultDivOp(position) {
        const token = this.getToken(position)

        if (instance_of(token, MultiplyToken)) {
            return new ParseResult(new MultiplyOp(), position + 1)
        }
        if (instance_of(token, DivideToken)) {
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
                    current = new ParseResult(new OpExp(current.result, multDivOp.result, anotherPrimary.result), anotherPrimary.position)
            } catch (e) {
                shouldRun = false
            }
        }

        return current;
    }

    // additive_op ::= + | -
    parseAddSubOp(position) {
        const token = this.getToken(position)

        if(instance_of(token, PlusToken)) {
            return new ParseResult(new PlusOp(), position + 1)
        }
        if (instance_of(token, MinusToken)) {
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

        if (instance_of(token, EqualsToken)) {
            return new ParseResult(new EqualOp(), position + 1)
        }
        if (instance_of(token, NotEqualsToken)) {
            return new ParseResult(new NotEqualOp(), position + 1)
        }
        if (instance_of(token, GreaterThanEqualToken)) {
            return new ParseResult(new GreaterThanEqualOp(), position + 1)
        }
        if (instance_of(token, LessThanEqualToken)) {
            return new ParseResult(new LessThanEqualOp(), position + 1)
        }
        if (instance_of(token, LessThanToken)) {
            return new ParseResult(new LessThanOp(), position + 1)
        }
        if (instance_of(token, GreaterThanToken)) {
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
        const token = this.getToken(position)
        if (instance_of(token, NewToken))
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
        if (instance_of(token, VariableToken)) {
            this.assertTokenHereIs(position + 1, AssignmentToken)
            const exp = this.parseExp(position + 2)
            this.assertTokenHereIs(exp.position, SemiColonToken)

            return new ParseResult(new VarEqualsExpStmt(new Variable(token.value), exp.result), exp.position + 1);
        }

        // vardec = exp;
        else if (instance_of(token, IntegerTypeToken) || instance_of(token, VoidTypeToken) || instance_of(token, ClassNameTypeToken) ||
                 instance_of(token, StringTypeToken) || instance_of(token, BooleanTypeToken)) {
            const vardec = this.parseVarDec(position)
            this.assertTokenHereIs(vardec.position, AssignmentToken)
            const exp = this.parseExp(vardec.position + 1)
            this.assertTokenHereIs(exp.position, SemiColonToken)

            return new ParseResult( new VarDecEqualsExpStmt( vardec.result, exp.result ), exp.position + 1 );
        }

        // { stmt* } 
        else if (instance_of(token, LeftCurlyToken)) {

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
        else if (instance_of(token, ReturnToken)) {

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
        else if (instance_of(token, IfToken)) {
            this.assertTokenHereIs(position + 1, LeftParenToken)
            const guard = this.parseExp(position + 2)
            this.assertTokenHereIs(guard.position, RightParenToken)
            const trueBranch = this.parseStmt(guard.position + 1)

            let falseBranch
            try {
                this.assertTokenHereIs(trueBranch.position, ElseToken)
                falseBranch = this.parseStmt(trueBranch.position + 1)
                position = falseBranch.position
            } catch (e) {
                falseBranch = undefined
                position = trueBranch.position
            }

            return new ParseResult( new IfStmt(guard.result, trueBranch.result, falseBranch?.result), position );
        }

        // while (exp) stmt
        else if (instance_of(token, WhileToken)) {
            this.assertTokenHereIs(position + 1, LeftParenToken)
            const guard = this.parseExp(position + 2)
            this.assertTokenHereIs(guard.position, RightParenToken)
            const stmt = this.parseStmt(guard.position + 1)

            return new ParseResult( new WhileStmt( guard.result, stmt.result ), stmt.position );
        }

        // break;
        else if (instance_of(token, BreakToken)) {
            this.assertTokenHereIs(position + 1, SemiColonToken)

            return new ParseResult( new BreakStmt(), position + 2 );
        }

        // print(exp);
        else if (instance_of(token, PrintToken)) {
            this.assertTokenHereIs(position + 1, LeftParenToken)
            const exp = this.parseExp(position + 2)
            this.assertTokenHereIs(exp.position, RightParenToken)
            this.assertTokenHereIs(exp.position + 1, SemiColonToken)

            return new ParseResult( new PrintExpStmt(exp.result), exp.position + 2 );
        }

        // exp.methodname(exp*);
        else {
            const exp = this.parseExp(position)

            if ( !(instance_of(exp.result, ExpMethodExp)) ) 
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
        const accessToken = this.getToken(position)

        // public
        if (instance_of(accessToken, PublicToken)) {
            return new ParseResult( new PublicModifier(), position + 1 );    
        }

        // private
        else if (instance_of(accessToken, PrivateToken)) {
            return new ParseResult( new PrivateModifier(), position + 1 );
        }

        // protec
        else if (instance_of(accessToken, ProtecToken)) {
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

        return new ParseResult( new MethodDec(accessMod.result, type.result, new MethodName(methodNameToken.value), result.vardecList, stmt.result), stmt.position);
    }

    //instancedec ::= access vardec = exp;
    parseInstanceDec(position) {
        const accessMod = this.parseAccessModifier(position)
        const vardec = this.parseVarDec(accessMod.position)
        this.assertTokenHereIs(vardec.position, AssignmentToken)
        const exp = this.parseExp(vardec.position + 1)
        this.assertTokenHereIs(exp.position, SemiColonToken)

        return new ParseResult( new InstanceDec(accessMod.result, vardec.result, exp.result), exp.position + 1 );
    }

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

    parseClassDec(position) {

        this.assertTokenHereIs(position, ClassToken)
        this.assertTokenHereIs(position + 1, ClassNameTypeToken)
        const classNameToken = this.getToken(position + 1)
        
        // position at { or super
        position = position + 2
        let superClassNameToken = null
        try {
            this.assertTokenHereIs(position, SuperToken)
            this.assertTokenHereIs(position + 1, ClassNameTypeToken)
            superClassNameToken = this.getToken(position + 1)
            position = position + 2
        } catch (e) {}

        // position at {
        this.assertTokenHereIs(position, LeftCurlyToken)

        const result = parseList(position + 1, this.parseInstanceDec.bind(this))
        const instanceDecList = result.list
        position = result.position

        this.assertTokenHereIs(position, ConstructorToken)
        this.assertTokenHereIs(position + 1, LeftParenToken)
        const vardecs = this.extractCommaSeperatedVardecs(position + 2)
        position = vardecs.position
        const vardecList = vardecs.vardecList
        this.assertTokenHereIs(position, RightParenToken)

        let stmtList = []
        let superExpList = []
        // Normal class
        try {
            const stmt = this.parseStmt(position + 1)
            if (instance_of(stmt.result, BlockStmt)) 
                stmtList = stmt.result.stmtList
            else 
                stmtList.push(stmt.result)
            
            position = stmt.position
        } 
        
        // With super class
        catch (e) {
            this.assertTokenHereIs(position + 1, LeftCurlyToken)
            this.assertTokenHereIs(position + 2, SuperToken)
            this.assertTokenHereIs(position + 3, LeftParenToken)
            const exps = this.extractCommaSeperatedExps(position + 4)
            position = exps.position
            superExpList = exps.expList
            this.assertTokenHereIs(position, RightParenToken)
            this.assertTokenHereIs(position + 1, SemiColonToken)
            
            const stmts = parseList(position + 2, this.parseStmt.bind(this))
            position = stmts.position
            stmtList = stmts.list

            this.assertTokenHereIs(position, RightCurlyToken)
            position++
        }

        const methodDecs = parseList(position, this.parseMethodDec.bind(this))
        const methodDecList = methodDecs.list
        position = methodDecs.position

        this.assertTokenHereIs(position, RightCurlyToken)
        
        return new ParseResult(new ClassDec(new ClassNameType(classNameToken.value), 
                                            new ClassNameType(superClassNameToken?.value),
                                            instanceDecList,
                                            new Constructor(vardecList, superExpList, stmtList),
                                            methodDecList), 
                                    position + 1)
    }    

    // classdec* `thyEntryPoint` stmt
    parseProgramObject(position) {
        
        const result = parseList(position, this.parseClassDec.bind(this))
        const classDecList = result.list
        const currentPosition = result.position

        this.assertTokenHereIs(currentPosition, ThyEntryPointToken)
        const stmt = this.parseStmt(currentPosition + 1)

        return new ParseResult( new Program(classDecList, stmt.result), stmt.position );
    }

    // Intended to be called on the top-level
    parseProgram() {
        const program = this.parseProgramObject(0)    //ParseResult
        
        if(program.position == this.tokens.length) {
            return new ParseResult(program.result, program.position);
        } else {
            throw new ParseException("Remaining tokens at the end")
        }
    }
    
}

module.exports = {
    Parser
}
