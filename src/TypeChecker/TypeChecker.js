const { BooleanExp, Exp, ExpMethodExp, IntegerExp, NewClassExp, OpExp, StringExp, ThisExp, VariableExp } = require("../Parser/Expressions");
const { DivideOp, DotOp, EqualOp, GreaterThanEqualOp, GreaterThanOp, LessThanEqualOp, LessThanOp, MinusOp, MultiplyOp, NotEqualOp, PlusOp } = require("../Parser/Operations");
const { IfStmt, WhileStmt, ReturnExpStmt, ReturnStmt, PrintExpStmt, BreakStmt, BlockStmt, ExpMethodExpStmt, VarEqualsExpStmt, VarDecEqualsExpStmt } = require("../Parser/Statements");
const { BooleanType, ClassNameType, IntType, StringType, Type, VoidType } = require("../Parser/Type");
const { instance_of } = require("../utils");
const { TypeError } = require("./TypeError")

class TypeChecker {

    // Things to track:
    // 1. Variables in scope, and their types
    // 2. Classes available, parameters constructors take, methods they have, what their parent class is

    // Sorts of queries we want to make to calss information: 
    // 1. Is this a valid class?
    // 2. For this class, what ar ethe argument types fo rthe constructor? 
    // 3. Does this class support a given method? If so, what are the parameter
    //    types for the method?
    //      - Need to take inheritance into account
    // 4. Is this given class a subclass of another class?
    // 5. Does our class hierarchy form a tree (aka no cycles)?

    constructor(program) {
        const classList = program.classDecList;
        
        // className: { methodname: array of param types in order }
        this.classMethodMap = {}

        // className: array of param types
        this.classConstructorTypes = {}

        // classname: { methodname: return type }
        this.methodReturnType = {}

        // type: array of subtypes
        this.typeTree = {
            "Object": []
        }

        // Fill type tree
        const dupMap = {}
        classList.forEach(classDec => {
            const className = classDec.classNameType.value 

            if (dupMap[className])
                throw new TypeError("Duplicate class: " + className)
            
            dupMap[className] = true
            this.insertIntoTypeTree(classDec, this.typeTree)
        })

        // Check for Cycles
        let trackerMap = {}
        this.checkForCycles(this.typeTree, "Object", this.typeTree.Object, trackerMap)
        if (Object.keys(trackerMap).length < classList.length)
            throw new TypeError("There is a cycle in the class hierarchy");

        // Fill classMethodMap, methodReturnType, and classConstructorTypes
        classList.forEach(classDec => {
            const className = classDec.classNameType.value
            const methodsArray = this.extractMethodsFromClass(className, classList)

            this.classConstructorTypes[className] = classDec.constructor.vardecList.map(varDec => varDec.type)
            
            this.methodReturnType[className] = {}
            this.classMethodMap[className] = this.convertMethodArrayToObjAndExtractMethodTypes(className, methodsArray, this.methodReturnType)
        })

    }

    extractMethodsFromClass(className, classList) {
        const classDec = classList.find(classDec => classDec.classNameType.value === className)
        if (classDec === undefined) {
            throw new TypeError("Class '" + className + "' is not defined")
        }

        let classMethods = [...classDec.methodDecList]

        // Check for dups
        const dupMap = {}
        classMethods.forEach(methodDec => {
            const methodName = methodDec.methodName.value

            if (dupMap[methodName])
                throw new TypeError("Cannot have two methods '" + methodName + "' in class '" + className + "'");
            else 
                dupMap[methodName] = true
        })
        
        // Extract super class methods
        if (classDec.superClassName.value !== "Object") {
            const superClassMethods = this.extractMethodsFromClass(classDec.superClassName.value, classList)
            classMethods = classMethods.concat(superClassMethods)
        }

        return classMethods;
    }

    convertMethodArrayToObjAndExtractMethodTypes(className, methodArray, methodReturnType) {
        const methodMap = {}

        methodArray.forEach(methodDec => {
            const methodName = methodDec.methodName.value

            // if method is in the map already then it has been overriden and you don't need the super's method
            if ( !(methodName in methodMap) ) {
                methodMap[methodName] = methodDec.varDecList.map(vardec => vardec.type)
                methodReturnType[className][methodName] = methodDec.type
            }  
        })

        return methodMap;
    }

    /**
     * 
     * @param {ClassDec} classDec 
     */
    insertIntoTypeTree(classDec, typeTree) {
        const classType = classDec.classNameType.value
        const parentType = classDec.superClassName.value 
        
        if (parentType in typeTree) {
            typeTree[parentType].push(classType)
        } else {
            typeTree[parentType] = []
            typeTree[parentType].push(classType)
        }

        if (!(classType in typeTree)) {
            typeTree[classType] = [] 
        }
    }

    checkForCycles(typeTree, currentType, currentSubTypeArray, trackerMap = {}) {

        if (trackerMap[currentType])
            throw new TypeError("There is a cycle in the class hierarchy");
        else 
            trackerMap[currentType] = true

        currentSubTypeArray.forEach(type => {
            this.checkForCycles(typeTree, type, typeTree[type], trackerMap)
        })
    }

    /**
     * @param {Exp} exp An Expression variable
     * @param {Object} typeEnvironment An object that maps key:"Variable" to value:"Type"
     * @param {String} classWeAreIn The current class that is in scope (string); Is "null" if in entry point
     * @returns The type of an expression
     */
    expTypeof(exp, typeEnvironment = {}, classWeAreIn) {
        if (instance_of(exp, IntegerExp)) {
            return new IntType();
        } 
        else if (instance_of(exp, StringExp)) {
            return new StringType();
        }
        else if (instance_of(exp, BooleanExp)) {
            return new BooleanType();
        }
        else if (instance_of(exp, VariableExp)) {
            return this.typeofVariable(exp, typeEnvironment);
        }
        else if (instance_of(exp, ThisExp)) {
           return this.typeofThis(classWeAreIn);
        }
        else if (instance_of(exp, OpExp)) {
            return this.typeofOpExp(exp, typeEnvironment, classWeAreIn);
        }
        else if (instance_of(exp, ExpMethodExp)) {
            return this.typeofExpMethodExp(exp, typeEnvironment, classWeAreIn);
        }
        else if (instance_of(exp, NewClassExp)) {
            this.typeofNewClassExp(exp, typeEnvironment, classWeAreIn)
        }
        else {
            throw new TypeError("Unrecognized expression: " + exp);
        }
    }

    typeofVariable(variableExp, typeEnvironment) {
        const variable = variableExp.value
        if (variable in typeEnvironment) {
            return typeEnvironment[variable];
        }

        throw new TypeError("Used variable not in scope: " + variable);
    }

    typeofThis(classWeAreIn) {
        if (classWeAreIn === null) 
            throw new TypeError("'this' used in the entry point");
        else 
            return new ClassNameType(classWeAreIn);
    }

    typeofOpExp(OpExp, typeEnvironment, classWeAreIn) {
        leftType = this.expTypeof(OpExp.leftExp, typeEnvironment, classWeAreIn)
        rightType = this.expTypeof(OpExp.rightExp, typeEnvironment, classWeAreIn)
        op = OpExp.op

        if (instance_of(op, PlusOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new IntType();
            else 
                throw new TypeError("Operand type mismatch for: +")
        }
        else if (instance_of(op, MinusOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new IntType();
            else 
                throw new TypeError("Operand type mismatch for: -")
        }
        else if (instance_of(op, MultiplyOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new IntType();
            else 
                throw new TypeError("Operand type mismatch for: *")           
        }
        else if (instance_of(op, DivideOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new IntType();
            else 
                throw new TypeError("Operand type mismatch for: /")           
        }
        else if (instance_of(op, GreaterThanOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: >")           
        }
        else if (instance_of(op, LessThanOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: <")           
        }
        else if (instance_of(op, GreaterThanEqualOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: >=")           
        }
        else if (instance_of(op, LessThanEqualOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: <=")           
        }
        else if (instance_of(op, EqualOp)) {
            if (instance_of(leftType, BooleanType) && instance_of(rightType, BooleanType))
                return new BooleanType();
            else if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else if (instance_of(leftType, StringType) && instance_of(rightType, StringType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: ==")           
        }
        else if (instance_of(op, NotEqualOp)) {
            if (instance_of(leftType, BooleanType) && instance_of(rightType, BooleanType))
                return new BooleanType();
            else if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else if (instance_of(leftType, StringType) && instance_of(rightType, StringType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: !=")           
        }
        else {
            throw new TypeError("Unsupported operation: " + op);
        }
    }

    typeofExpMethodExp(ExpMethodExp, typeEnvironment, classWeAreIn) {
        const parentExpType = this.expTypeof(ExpMethodExp.parentExp, typeEnvironment, classWeAreIn)
        const parameterExpsTypeArray = ExpMethodExp.parameterExpsArray.map(exp => this.expTypeof(exp, typeEnvironment, classWeAreIn))

        if (!instance_of(parentExpType, ClassNameType))
            throw new TypeError("Called method on non-class type: " + parentExpType);

        const className = parentExpType.value
        const methodName = ExpMethodExp.methodName.value
        const methodTypeArray = this.expectedParamTypesForClassAndMethod(className, methodName)

        if (testArray.length !== expectedArray.length)
            throw new TypeError("Inncorrect number of parameters for call " + methodName);

        // Will throw error if something fails
        this.compareTypesInArray(parameterExpsTypeArray, methodTypeArray)
        return this.methodReturnType[className][methodName];
    }

    /** 
     * 
     * @param {String} className 
     * @param {String} methodName 
     * @returns Array containing types for method parameters; throws error if method not in class
     */
    expectedParamTypesForClassAndMethod(className, methodName) {
        let result = this.classMethodMap[className][methodName]
        if (result === undefined)
            throw new TypeError("Method: " + methodName + " is not in class: " + className);
        
        return result;
    }

    /**
     * 
     * @param {Type[]} testArray 
     * @param {Type[]} expectedArray 
     * @returns True if have same types in same order
     */
    compareTypesInArray(testArray, expectedArray) {
        for (let i = 0; i < testArray.length; i++) {
           this.isLeftTypeofRight(testArray[i], expectedArray[i])
        }      

        return true;
    }

    /**
     * 
     * @param {Type} testType 
     * @param {Type} expectedType 
     * @returns true if test type is equal or subtype of expected type; throws error otherwise
     */
    isLeftTypeofRight(testType, expectedType) {

        if (testType.equals(expectedType))
            return true;
        else if (this.typeTree[expectedType.value].includes(testType.value))
            return true;
        else 
            throw new TypeError("Parameter type: " + testType.value + " doesn't match type: " + expectedType.value);
    }

    typeofNewClassExp(NewClassExp, typeEnvironment, classWeAreIn) {

        const className = NewClassExp.className.value

        // Makes sure parameters are correct type
        
            // Get params of user created exp
            const testParams = NewClassExp.parameterExpsArray
            const testParamsTypes = testParams.map(exp => this.expTypeof(exp))
            
            // Get params of defined class
            const expectedParamsTypes = this.classConstructorTypes[className]

        if (testParamsTypes.length !== expectedParamsTypes.length)
            throw new TypeError("Inncorrect number of constructor parameters for: " + className);

        // Throws error if there is a mismatch
        this.compareTypesInArray(testParamsTypes, expectedParamsTypes)

        return new ClassNameType(NewClassExp.className);
    }


    // STATEMENTS
    isWellTyped(stmt, typeEnvironment, classWeAreIn, functionReturnType) {

        if (instance_of(stmt, IfStmt)) {
            return this.isWellTypedIf(stmt, typeEnvironment, classWeAreIn, functionReturnType);
        } 
        else if (instance_of(stmt, WhileStmt)) {
            return this.isWellTypedWhile(stmt, typeEnvironment, classWeAreIn, functionReturnType);
        } 
        else if (instance_of(stmt, ReturnExpStmt)) {
            return this.isWellTypedReturnExp(stmt, typeEnvironment, classWeAreIn, functionReturnType);
        } 
        else if (instance_of(stmt, ReturnStmt)) {
            return this.isWellTypedReturn(typeEnvironment, functionReturnType);
        } 
        else if (instance_of(stmt, PrintExpStmt)) {
            return this.isWellTypedPrint(stmt, typeEnvironment, classWeAreIn);
        } 
        else if (instance_of(stmt, BreakStmt)) {
            return typeEnvironment;
        } 
        else if (instance_of(stmt, BlockStmt)) {
            return this.isWellTypedBlock(stmt, typeEnvironment, classWeAreIn, functionReturnType);
        } 
        else if (instance_of(stmt, ExpMethodExpStmt)) {
            
        } 
        else if (instance_of(stmt, VarEqualsExpStmt)) {
            return this.isWellTypedVarEqualsExp(stmt, typeEnvironment, classWeAreIn);
        } 
        else if (instance_of(stmt, VarDecEqualsExpStmt)) {
            return this.isWellTypedVarDecEqualsExp(stmt, typeEnvironment, classWeAreIn);
        } 
        else {
            throw new TypeError("Unsupported statement: " + stmt);
        }
    }

    // if (exp) stmt else stmt
    isWellTypedIf (ifStmt, typeEnvironment, classWeAreIn, functionReturnType) {
        const guardType = this.expTypeof(ifStmt.guardExp, typeEnvironment, classWeAreIn)

        if (instance_of(guardType, BooleanType)) {
            this.isWellTyped(ifStmt.trueBranch, typeEnvironment, classWeAreIn, functionReturnType)
            this.isWellTyped(ifStmt.falseBranch, typeEnvironment, classWeAreIn, functionReturnType)
            return typeEnvironment;

        } else {
            throw new TypeError("Guard of 'if' expects an expression of type Boolean but recieved a type of : " + guardType.value);
        }
    }

    // while (exp) stmt
    isWellTypedWhile (whileStmt, typeEnvironment, classWeAreIn, functionReturnType) {
        const guardType = this.expTypeof(whileStmt.guardExp, typeEnvironment, classWeAreIn)

        if (instance_of(guardType, BooleanType)) {
            this.isWellTyped(whileStmt.loopStmt, typeEnvironment, classWeAreIn, functionReturnType)
            return typeEnvironment;
            
        } else {
            throw new TypeError("Guard of 'while' expects an expression of type Boolean but recieved a type of : " + guardType.value);
        }
        
    }

    // return exp;
    isWellTypedReturnExp (returnExp, typeEnvironment, classWeAreIn, functionReturnType) {
        
        if (functionReturnType === null) 
            throw new TypeError("returning in program entry point");
        
        const expType = this.expTypeof(returnExp.returnExp, typeEnvironment, classWeAreIn)
        this.isLeftTypeofRight(expType, functionReturnType)
        return typeEnvironment;
    }

    // return;
    isWellTypedReturn (typeEnvironment, functionReturnType) {
        if (functionReturnType === null) 
            throw new TypeError("returning in program entry point");
        
        if (instance_of(functionReturnType, VoidType))
            return typeEnvironment;
        else 
            throw new TypeError("Function expects return type of '" + functionReturnType + "' but recieved Void");
    }

    // print(exp);
    isWellTypedPrint (printStmt, typeEnvironment, classWeAreIn) {
        const expType = this.expTypeof(printStmt.printExp, typeEnvironment, classWeAreIn)
        return typeEnvironment;
    }

    // { stmt* }
    isWellTypedBlock (blockStmt, typeEnvironment, classWeAreIn, functionReturnType) {

        const stmtList = blockStmt.stmtList

        for (let i = 0; i < stmtList.length; i++) {
            typeEnvironment = this.isWellTyped(stmtList[i], typeEnvironment, classWeAreIn, functionReturnType)
        }

        return typeEnvironment;
    }

    // var = exp;
    isWellTypedVarEqualsExp (varEqualsExpStmt, typeEnvironment, classWeAreIn) {
        const expType = this.expTypeof(varEqualsExpStmt.exp, typeEnvironment, classWeAreIn)
        const variableName = varEqualsExpStmt.variable.value
        const variableDeclaredType = typeEnvironment[variableName] 

        if (variableDeclaredType === undefined) {
            throw new TypeError("Variable '" + variableName + "' does not exist")
        }

        this.isLeftTypeofRight(expType, variableDeclaredType)
        return typeEnvironment;
    }

    // vardec = exp; 
    isWellTypedVarDecEqualsExp (varDecEqualsExpStmt, typeEnvironment, classWeAreIn) {
        const expType = this.expTypeof(varDecEqualsExpStmt.exp, typeEnvironment, classWeAreIn)
        const varDecType = varDecEqualsExpStmt.vardec.type

        this.isLeftTypeofRight(expType, varDecType)
        return this.addToMap(typeEnvironment, varDecEqualsExpStmt.vardec.variable, varDecType);
    }

    /**
     * 
     * @param {Object} map typeEnvironment you want to add variable to
     * @param {Variable} variable Variable object to be added
     * @param {Type} type Type of the variable object
     * @returns new typeEnvironment with added variable
     */
    addToMap(map, variable, type) {
        let newMap = {...map}
        newMap[variable.value] = type
        return newMap;
    }
}

module.exports = TypeChecker;