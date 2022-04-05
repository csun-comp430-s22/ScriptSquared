// TODO: import types
const {} = require("")
const {
    Exp,
    IntegerExp,
    StringExp,
    BooleanExp,
    VariableExp,
    ThisExp,
    OpExp,
    ExpMethodExp,
    ClassExp,
} = require("./Expressions")

// vardec ::= type var = exp;
class Vardec {

    constructor(type, variable, expression) {

        if ( !(type instanceof Type && variable instanceof VariableExp && expression instanceof Exp ) )
            throw new EvalError("Incorrect type passed to Vardec")

        this.type = type
        this.variable = variable
        this.expression = expression
    }

    equals() {
        
    }
}

module.exports = Vardec