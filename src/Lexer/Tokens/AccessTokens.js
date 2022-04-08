 
class AccessToken {}

class PublicToken extends AccessToken {
    
    constructor() {
        super()
        this.value = "public"
    }
    
}

class PrivateToken extends AccessToken {
    
    constructor() {
        super()
        this.value = "private"
    }
}

class ProtecToken extends AccessToken {
    
    constructor() {
        super()
        this.value = "protec"
    }
}


module.exports = {
    AccessToken,
    PublicToken,
    PrivateToken,
    ProtecToken
};