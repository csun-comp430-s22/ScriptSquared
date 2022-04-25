const { arrayMatchType, arraysEqual } = require("../utils");
const { ClassDec } = require("./ClassDec");
const { Stmt } = require("./Statements");


class Program {

    constructor(classDecList, stmt) {
        if ( !(arrayMatchType(classDecList, ClassDec)) || !(stmt instanceof Stmt)) {
            throw new EvalError("Incorrect type passed to ClassDec")
        }

        this.classDecList = classDecList
        this.stmt = stmt
    }

    equals(other) {
        return (arraysEqual(this.classDecList, other.classDecList)
                && this.stmt.equals(other.stmt))
    }
}

module.exports = {
    Program
}