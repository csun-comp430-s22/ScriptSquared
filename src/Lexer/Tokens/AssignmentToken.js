const Token = require("./Token")

class AssignmentToken {
    
    constructor(value) {
        this.value = value
    }
}

AssignmentToken.prototype.getTokenValue = Token.getTokenValue


module.exports = AssignmentToken;