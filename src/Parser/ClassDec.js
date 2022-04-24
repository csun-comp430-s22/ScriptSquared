const { ClassNameType } = require("./Type")
const { arrayMatchType, arraysEqual } = require("../utils")
const { InstanceDec } = require("./InstanceDec")
const { Constructor } = require("./Constructor")
const MethodDec = require("./MethodDec")


// classdec ::= class classname super classname {
//                  instancedec*;
//                  construc(vardec*) { super(exp*); stmt* } 
//                  methoddec*
//              }
//              |
//              class classname {
//                  instancedec*;
//                  construc(vardec*) stmt	
//                  methoddec*
//              }
class ClassDec {
    constructor(classNameType, superClassName, instanceDecList, constructor, methodDecList) {

        if ( !(classNameType instanceof ClassNameType) 
                || superClassName instanceof ClassNameType
                || !arrayMatchType(instanceDecList, InstanceDec)
                || !(constructor instanceof Constructor)
                || !arrayMatchType(methodDecList, MethodDec)) {
                    
            throw new EvalError("Incorrect type passed to ClassDec")
        }


        this.classNameType = classNameType
        this.superClassName = superClassName
        this.instanceDecList = instanceDecList
        this.constructor = constructor
        this.methodDecList = methodDecList
    }

    equals(other) {
        return (other instanceof ClassDec
                    && this.classNameType.equals(other.classNameType)
                    && this.superClassName.equals(other.superClassName)
                    && arraysEqual(this.instanceDecList, other.instanceDecList)
                    && this.constructor.equals(other.constructor)
                    && arraysEqual(this.methodDecList, other.methodDecList));
    }
}

module.exports = {
    ClassDec
}