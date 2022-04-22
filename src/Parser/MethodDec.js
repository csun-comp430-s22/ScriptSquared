const { Stmt } = require("./Statements")
const { AccessModifier } = require("./AccessModifier")
const { arraysEqual, instance_of, arrayMatchType } = require("../utils")
const { MethodName } = require("./MethodName")
const { Type } = require("./Type")
const { VarDec } = require("./VarDec")

// ex. access type methodname(vardec*) stmt
class MethodDec {
    constructor(accessModifier, type, methodName, varDecList, stmt) {

        if (!(instance_of(accessModifier, AccessModifier)) || !(instance_of(type, Type)) || !(instance_of(methodName, MethodName)) || !arrayMatchType(varDecList, VarDec) || !(instance_of(stmt, Stmt))) {
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
		&& arraysEqual(this.varDecList, otherMethodDec.varDecList)
		&& this.stmt.equals(otherMethodDec.stmt));
	}
}

module.exports = {
    MethodDec
}