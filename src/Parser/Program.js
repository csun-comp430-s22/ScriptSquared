const { ClassDec } = require("./ClassDec");
const { Stmt } = require("./Statements");


class Program {

    constructor(classDecList, stmt) {
        if ( !(classDecList instanceof ClassDec) || !(stmt instanceof Stmt)) {
            throw new EvalError("Incorrect type passed to ClassDec")
        }

        this.classDecList = classDecList
        this.stmt = stmt
    }
}

module.exports = {
    Program
}