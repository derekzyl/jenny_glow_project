"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileIndex = void 0;
const controller_profile_1 = require("./main_profile/controller.profile");
class Profile {
    constructor() {
        this.create_profile = controller_profile_1.createProfile;
        this.get_all_profile = controller_profile_1.getManyProfile;
        this.get_one_profile = controller_profile_1.getOneProfile;
        this.update_profile = controller_profile_1.updateProfile;
        this.delete_profile = controller_profile_1.deleteProfile;
    }
}
exports.ProfileIndex = new Profile();
