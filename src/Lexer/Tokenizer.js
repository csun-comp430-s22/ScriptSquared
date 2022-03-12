const TrueToken = require("./Tokens/TrueToken")
const FalseToken = require("./Tokens/FalseToken")
const IfToken = require("./Tokens/IfToken")
const ElseToken = require("./Tokens/ElseToken")
const IntegerToken = require("./Tokens/IntegerToken")
const BreakToken = require("./Tokens/BreakToken")
const DivideToken = require("./Tokens/DivideToken")
const GreaterThanEqualToken = require("./Tokens/GreaterThanEqualToken")
const GreaterThanToken = require("./Tokens/GreaterThanToken")
const LeftCurlyToken = require("./Tokens/LeftCurlyToken")
const LeftParenToken = require("./Tokens/LeftParenToken")
const LessThanEqualToken = require("./Tokens/LessThanEqualToken")
const LessThanToken = require("./Tokens/LessThanToken")
const MinusToken = require("./Tokens/MinusToken")
const MultiplyToken = require("./Tokens/MultiplyToken")
const NotEqualsToken = require("./Tokens/NotEqualsToken")
const EqualsToken = require("./Tokens/NotEqualsToken")
const PlusToken = require("./Tokens/PlusToken")
const PrintToken = require("./Tokens/PrintToken")
const ProtecToken = require("./Tokens/ProtecToken")
const PublicToken = require("./Tokens/PublicToken")
const ReturnToken = require("./Tokens/ReturnToken")
const RightCurlyToken = require("./Tokens/RightCurlyToken")
const RightParenToken = require("./Tokens/RightParenToken")
const SemiColonToken = require("./Tokens/SemiColonToken")
const PrivateToken = require("./Tokens/PrivateToken")
const WhileToken = require("./Tokens/WhileToken")


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
        
        if  (offset < this.inputLength &&
            (retval = this.tryTokenizeVariableOrKeyword()) === null &&
            (retval = this.tryTokenizeInteger()) === null &&
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
            offset++
            retval = new LeftParenToken()
        } else if (this.input.startsWith(")", this.offset)) {
            offset++
            retval = new RightParenToken()
        } else if (this.input.startsWith("{", this.offset)) {
            offset++
            retval = new LeftCurlyToken()
        } else if (this.input.startsWith("}", this.offset)) {
            offset++
            retval = new RightCurlyToken()
        } else if (this.input.statusbar(";", this.offset)) {
            offset++
            retval = new SemiColonToken()
        } else if (this.input.statusbar("+", this.offset)) {
            offset++
            retval = new PlusToken()
        } else if (this.input.statusbar("-", this.offset)) {
            offset++
            retval = new MinusToken()
        } else if (this.input.statusbar("*", this.offset)) {
            offset++
            retval = new MultiplyToken()
        } else if (this.input.statusbar("/", this.offset)) {
            offset++
            retval = new DivideToken()
        } else if (this.input.statusbar(">", this.offset)) {
            offset++
            retval = new GreaterThanToken()
        } else if (this.input.statusbar(">=", this.offset)) {
            offset++
            retval = new GreaterThanEqualToken()
        } else if (this.input.statusbar("<", this.offset)) {
            offset++
            retval = new LessThanToken()
        } else if (this.input.statusbar("<=", this.offset)) {
            offset++
            retval = new LessThanEqualToken()
        } else if (this.input.statusbar("==", this.offset)) {
            offset++
            retval = new EqualsToken()
        } else if (this.input.statusbar("!=", this.offset)) {
            offset++
            retval = new NotEqualsToken()
        }
        
        return retval;
    }

    tryTokenizeVariableOrKeyword () {
        this.skipWhiteSpace()
        let name = ""
        
        if (this.offset < this.input.length() && this.isLetter(this.input.charAt(this.offset))) {
            name += this.input.charAt(this.offset)
            this.offset++    

            while (this.offset < this.input.length() && this.isLetterOrDigit(this.input.charAt(this.offset))) {
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
            return new IntegerToken(number);
        }
        else {
            return null;
        }
    }
}

module.exports = Tokenizer;
