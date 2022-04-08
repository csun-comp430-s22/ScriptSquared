const { PublicToken, PrivateToken, ProtecToken } = require("../Lexer/Tokens/AccessTokens")
const { 
    LeftCurlyToken,
    RightCurlyToken, 
    LeftParenToken, 
    RightParenToken,
    DotToken,
    SemiColonToken,
    CommaToken
} = require("./Tokens/SymbolToken")
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
    IntegerTypeToken,
    StringTypeToken,
    BooleanTypeToken
 } = require("../Lexer/Tokens/TypeTokens")
const NewToken = require("../Lexer/Tokens/NewToken")
const VariableToken = require("../Lexer/Tokens/VariableToken");
const SuperToken = require("./Tokens/SuperToken")
const ClassToken = require("./Tokens/ClassToken")


class Tokenizer {

    constructor(input) {
        this.input = input
        this.offset = 0
        this.inputLength = input.length
    }

    tokenize () {
        const tokens = []
        let token = this.tokenizeSingle()

        while (token !== null) {
            tokens.push(token)
            token = this.tokenizeSingle()
        } 

        return tokens;
    }

    skipWhiteSpace () {
        while ( (this.offset < this.inputLength) && (this.input.charAt(this.offset) === ' ') ) {
            this.offset++;
        }
    }

    tokenizeSingle(){   
        let retval = null
        this.skipWhiteSpace()
        
        if  (this.offset < this.inputLength &&
            (retval = this.tryTokenizeVariableOrKeyword()) === null &&
            (retval = this.tryTokenizeInteger()) === null &&
            (retval = this.tryTokenizeString()) === null &&
            (retval = this.tryTokenizeSymbol()) === null) 
            {
                throw new EvalError("Invalid token! d u m b y")
            }

            
        return retval;
    }

    tryTokenizeSymbol () {
        this.skipWhiteSpace()
        let retval = null

        if (this.input.startsWith("(", this.offset)) {
            this.offset++
            retval = new LeftParenToken()

        } else if (this.input.startsWith(")", this.offset)) {
            this.offset++
            retval = new RightParenToken()

        } else if (this.input.startsWith("{", this.offset)) {
            this.offset++
            retval = new LeftCurlyToken()

        } else if (this.input.startsWith("}", this.offset)) {
            this.offset++
            retval = new RightCurlyToken()

        } else if (this.input.startsWith(";", this.offset)) {
            this.offset++
            retval = new SemiColonToken()

        } else if (this.input.startsWith("+", this.offset)) {
            this.offset++
            retval = new PlusToken()

        } else if (this.input.startsWith("-", this.offset)) {
            this.offset++
            retval = new MinusToken()

        } else if (this.input.startsWith("*", this.offset)) {
            this.offset++
            retval = new MultiplyToken()

        } else if (this.input.startsWith("/", this.offset)) {
            this.offset++
            retval = new DivideToken()

        } else if (this.input.substring(this.offset, this.offset + 2) === ">=") {
            this.offset += 2
            retval = new GreaterThanEqualToken()

        } else if (this.input.startsWith(">", this.offset)) {
            this.offset++
            retval = new GreaterThanToken()
            
        } else if (this.input.substring(this.offset, this.offset + 2) === "<=") {
            this.offset += 2
            retval = new LessThanEqualToken()

        } else if (this.input.startsWith("<", this.offset)) {
            this.offset++
            retval = new LessThanToken()
            
        } else if (this.input.substring(this.offset, this.offset + 2) === "==") {
            this.offset += 2
            retval = new EqualsToken()
            
        } else if (this.input.substring(this.offset, this.offset + 2) === "!=") {
            this.offset += 2
            retval = new NotEqualsToken()
            
        } else if (this.input.startsWith('=', this.offset)) {
            this.offset++
            retval = new AssignmentToken()

        } else if (this.input.startsWith(".", this.offset)) {
            this.offset++
            retval = new DotToken()
        } else if (this.input.startsWith(",", this.offset)) {
            this.offset++
            retval = new CommaToken()
        }
        
        return retval;
    }

    tryTokenizeVariableOrKeyword () {
        this.skipWhiteSpace()
        let name = ""
        
        if (this.offset < this.inputLength && this.isLetter(this.input.charAt(this.offset))) {
            name += this.input.charAt(this.offset)
            this.offset++    

            while (this.offset < this.inputLength && this.isLetterOrDigit(this.input.charAt(this.offset))) {
                name += this.input.charAt(this.offset)
                this.offset++   
            }
            
            if (name === "true")    
            {
                return new TrueToken();
            }
            else if (name === "false")    
            {
                return new FalseToken();
            }
            else if (name === "if")    
            {
                return new IfToken();
            }
            else if (name === "else")    
            {
                return new ElseToken();
            }
            else if (name === "while")
            {
                return new WhileToken();
            }
            else if (name === "print")
            {
                return new PrintToken();
            }
            else if (name === "break")
            {
                return new BreakToken();
            }
            else if (name === "return")
            {
                return new ReturnToken();
            }
            else if (name === "public")
            {
                return new PublicToken();
            }
            else if (name === "private")
            {
                return new PrivateToken();
            }
            else if (name === "protec")
            {
                return new ProtecToken();
            } 
            else if (name === "new") 
            {
                return new NewToken();
            } 
            else if (name === "int")
            {
                return new IntegerTypeToken();
            }
            else if (name === "string")
            {
                return new StringTypeToken();
            }
            else if (name === "boolean")
            {
                return new BooleanTypeToken();
            }
            else if (name === "void")
            {
                return new VoidTypeToken();
            }
            else if (name === "super")
            {
                return new SuperToken();
            }
            else if (name === "class")
            {
                return new ClassToken();
            }
            else
            {
                return new VariableToken(name);
            }
            
        } else { return null; }
        
    }
    
    isLetter(c) {
        return /[a-zA-Z]/.test(c);
    }

    isLetterOrDigit (c) {
        return /[a-zA-Z\d]/.test(c);
    }

    tryTokenizeInteger () {
        this.skipWhiteSpace()

        let number = ""

        while ( (this.offset < this.inputLength) && (parseInt(this.input.charAt(this.offset)) ) ) {
            number += this.input.charAt(this.offset)
            this.offset++
        }

        if (number !== "") {
            return new IntegerToken(parseInt(number));
        }
        else {
            return null;
        }
    }

    tryTokenizeString () {
        this.skipWhiteSpace()

        let string = ""

        if (this.input.charAt(this.offset) !== '"')
            return null;

        this.offset++
        while ( (this.offset < this.inputLength) && (this.input.charAt(this.offset) !== '"') ) {
            string += this.input.charAt(this.offset)
            this.offset++
        }

        if (this.input.charAt(this.offset) === '"') {
            this.offset++
            return new StringToken(string);
        } else {
            return null;
        }
    }
}

module.exports = Tokenizer;
