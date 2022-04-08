const { ClassDec } = require("./ClassDec");
const { Stmt } = require("./Statements");
const { arrayMatchType } = require("../utils");


class Program {

    constructor(classDecList, stmt) {
        if ( !(classDecList instanceof ClassDec) || !arrayMatchType(stmt, Stmt)) {
            throw new EvalError("Incorrect type passed to ClassDec")
        }

        this.classDecList = classDecList
        this.stmt = stmt
    }
}

module.exports = {
    Program
}