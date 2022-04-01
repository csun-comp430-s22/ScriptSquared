const Token = require("./Token")

class SuperToken  extends Token {
    
    constructor() {
        super(Token)
        this.value = "super"
    }
}

module.exports = SuperToken