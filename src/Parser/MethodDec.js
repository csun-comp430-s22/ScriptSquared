const { Stmt } = require("./Statements")
const { AccessModifier } = require("./AccessModifier")
const { arraysEqual } = require("../utils")
const { MethodName } = require("./MethodName")
const { Type } = require("./Type")
const { VarDec } = require("./VarDec")

// ex. access type methodname(vardec*) stmt
class MethodDec {
    constructor(accessModifier, type, methodName, varDecList, stmt) {

        if (!(accessModifier instanceof AccessModifier) || !(type instanceof Type) || !(methodName instanceof MethodName) 
        || arrayMatchType(varDecList, VarDec) || arrayMatchType(stmt, Stmt)) {
            throw new EvalError("Incorrect type passed to MethodDec");
        }

        this.accessModifier = accessModifier
        this.type = type
        this.methodName = methodName
		this.varDecList = varDecList
		this.stmt = stmt
	}

    equals(otherMethodDec) {
        return (otherMethodDec instanceof MethodDec
        && otherMethodDec.accessModifier.equals(this.accessModifier) 
		&& otherMethodDec.type.equals(this.type) 
		&& otherMethodDec.methodName.equals(this.methodName)
		&& arraysEqual(varDecList,otherMethodDec.varDecList)
		&& arraysEqual(stmt,otherMethodDec.stmt));
	}
}

module.exports = {
    MethodDec
}