const { Stmt } = require("./Statements")
const { AccessModifier } = require("./AccessModifier")
const { arraysEqual } = require("../utils")
const { MethodName } = require("./MethodName")
const { Type } = require("./Type")
const { Vardec } = require("./Vardec")

// ex. access type methodname(vardec*) {stmt}
class MethodDec {
    constructor(accessModifier, type, methodName, varDecList, stmtList) {

        if (!(accessModifier instanceof AccessModifier) || !(type instanceof Type) || !(methodName instanceof MethodName) 
        || arrayMatchType(varDecList, Vardec) || arrayMatchType(stmtList, Stmt)) {
            throw new EvalError("Incorrect type passed to MethodDec");
        }

        this.accessModifier = accessModifier
        this.type = type
        this.methodName = methodName
		this.varDecList = varDecList
		this.stmtList = stmtList
	}

    equals(otherMethodDec) {
        return (otherMethodDec instanceof MethodDec
        && otherMethodDec.accessModifier.equals(this.accessModifier) 
		&& otherMethodDec.type.equals(this.type) 
		&& otherMethodDec.methodName.equals(this.methodName)
		&& arraysEqual(varDecList,otherMethodDec.varDecList)
		&& arraysEqual(stmtList,otherMethodDec.stmtList));
	}
}

module.exports = MethodDec