const Token = require("./Token")

class ClassToken  extends Token {
    
    constructor() {
        super(Token)
        this.value = "class"
    }
}

module.exports = ClassToken