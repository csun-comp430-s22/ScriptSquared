// TODO: import types
const { Type } = require("./Type")
const { Variable } = require("./Variable")
const { Exp } = require("./Expressions")

// vardec ::= type var = exp;
class Vardec {

    constructor(type, variable, expression) {

        if ( !(type instanceof Type && variable instanceof Variable && expression instanceof Exp ) )
            throw new EvalError("Incorrect type passed to Vardec")

        this.type = type
        this.variable = variable
        this.expression = expression
    }

    equals(other) {
        return (other instanceof Vardec
            && this.type.equals(other.type)
            && this.variable.equals(other.variable)
            && this.expression.equals(other.expression))
    }
}

module.exports = {
    Vardec
}