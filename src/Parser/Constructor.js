const { arrayMatchType, arraysEqual } = require("../utils");
const { Exp } = require("./Expressions");
const { Stmt } = require("./Statements");
const { VarDec } = require("./VarDec");


class Constructor {

    constructor(vardecList, superExpList, stmtList) {
        if (!arrayMatchType(vardecList, VarDec)
                || !arrayMatchType(superExpList, Exp)
                || !arrayMatchType(stmtList, Stmt)) {

                    throw new EvalError("Incorrect type passed to Constructor.Parser")
                }

        this.vardecList = vardecList
        this.superExpList = superExpList
        this.stmtList = stmtList
    }

    equals(other) {
        return (other instanceof Constructor
                    && arraysEqual(this.vardecList, other.vardecList)
                    && arraysEqual(this.superExpList, other.superExpList)
                    && arraysEqual(this.stmtList, other.stmtList));
    }
}

module.exports = {
    Constructor
}