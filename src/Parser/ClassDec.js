const { Type } = require("./Type")
const { arrayMatchType, arraysEqual } = require("../utils")
const { Stmt } = require("./Statements")
const { InstanceDec } = require("./InstanceDec")
const { Constructor } = require("./Constructor")
const MethodDec = require("./MethodDec")

class ClassDec {
    constructor(className, superClassName, stmtList, instanceDecList, constructor, methodDecList) {

        if ( !(className instanceof Type) 
                || className.value === "int" 
                || className.value === "string" 
                || className.value === "boolean" 
                || className.value === "void"
                || !arrayMatchType(stmtList, Stmt)
                || !arrayMatchType(instanceDecList, InstanceDec)
                || !(constructor instanceof Constructor)
                || !arrayMatchType(methodDecList, MethodDec)) {
                    
            throw new EvalError("Incorrect type passed to ClassDec")
        }


        this.className = className
        this.superClassName = superClassName
        this.stmtList = stmtList
        this.instanceDecList = instanceDecList
        this.constructor = constructor
        this.methodDecList = methodDecList
    }

    equals(other) {
        return (other instanceof ClassDec
                    && this.className.equals(other.className)
                    && this.superClassName.equals(other.superClassName)
                    && arraysEqual(this.stmtList, other.stmtList)
                    && arraysEqual(this.instanceDecList, other.instanceDecList)
                    && this.constructor.equals(other.constructor)
                    && arraysEqual(this.methodDecList, other.methodDecList));
    }
}


//TODO Think about how to incorparate instanceDecList* and methDecList*
//TODO Look at profs function definitions in type checker repo

module.exports = {
    ClassDec
}