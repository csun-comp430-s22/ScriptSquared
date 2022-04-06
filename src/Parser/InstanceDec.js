const { AccessModifier } = require("./AccessModifier");
const { Exp } = require("./Expressions");
const { VarDec } = require("./Vardec");

class InstanceDec {

    constructor(accessModifier, vardec, expression) {

        if ( !(accessModifier instanceof AccessModifier) || !(vardec instanceof VarDec) || !(expression instanceof Exp)) {
            throw new EvalError("Incorrect type passed to InstanceDec")
        }

        this.accessModifier = accessModifier
        this.vardec = vardec
        this.expression = expression
    }

    equals(otherInstanceDec) {
        return (otherInstanceDec instanceof InstanceDec
                    && this.accessModifier.equals(otherInstanceDec.accessModifier)
                    && this.vardec.equals(otherInstanceDec.vardec)
                    && this.expression.equals(otherInstanceDec.expression))
    }
}

module.exports = {
    InstanceDec
}