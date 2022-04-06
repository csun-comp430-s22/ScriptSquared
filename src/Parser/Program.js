const { ClassDec } = require("./ClassDec");
const { Stmt } = require("./Statements");
const { arrayMatchType } = require("../utils");


class Program {

    constructor(classDecList, stmtList) {
        if ( !(classDecList instanceof ClassDec) || !arrayMatchType(stmtList, Stmt)) {
            throw new EvalError("Incorrect type passed to ClassDec")
        }

        this.classDecList = classDecList
        this.stmtList = stmtList
    }
}

module.exports = {
    Program
}