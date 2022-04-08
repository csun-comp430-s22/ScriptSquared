
class AccessModifier {}

class PublicModifier extends AccessModifier {
    constructor() {
        this.value = "public"
    }

    equals(other) {
        return (other instanceof PublicModifier
            && this.value === other.value)
    }
}

class PrivateModifier extends AccessModifier {
    constructor() {
        this.value = "private"
    }

    equals(other) {
        return (other instanceof PrivateModifier
            && this.value === other.value)
    }
}

class ProtecModifier extends AccessModifier {
    constructor() {
        this.value = "protec"
    }

    equals(other) {
        return (other instanceof ProtecModifier
            && this.value === other.value)
    }
}


module.exports = {
	AccessModifier,
    PublicModifier,
    PrivateModifier,
    ProtecModifier
}