import { createProfile, deleteProfileById, deleteProfileByUserId, getManyProfile, getOneProfileById, getOneProfileByUserId, updateProfileById, updateProfileByUserId } from "./main_profile/controller.profile";
class Profile {
    constructor() {
        this.create_profile = createProfile;
        this.get_all_profile = getManyProfile;
        this.delete_profile_by_id = deleteProfileById;
        this.update_profile_by_id = updateProfileById;
        this.delete_profile_by_user_id = deleteProfileByUserId;
        this.get_profile_by_id = getOneProfileById;
        this.get_profile_by_user_id = getOneProfileByUserId;
        this.update_profile_by_user_id = updateProfileByUserId;
    }
}
export const ProfileIndex = new Profile();
//# sourceMappingURL=index.profile.js.map