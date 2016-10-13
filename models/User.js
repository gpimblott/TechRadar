'use strict';

module.exports = class User{
    constructor(id, username, email, displayName, password, avatar, role, enabled) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.displayName = displayName;
        this.password = password;
        this.avatar = avatar;
        this.role = role;
        this.enabled = enabled;
    }
}