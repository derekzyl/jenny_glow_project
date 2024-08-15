import {
  createProfile,
  deleteProfileById,
  deleteProfileByUserId,
  getManyProfile,
  getOneProfileById, getOneProfileByUserId,
  updateProfileById,
  updateProfileByUserId
} from "./main_profile/controller.profile";

class Profile {
  public create_profile = createProfile;
  public get_all_profile = getManyProfile;
  public delete_profile_by_id = deleteProfileById;
  public update_profile_by_id = updateProfileById;
  public delete_profile_by_user_id = deleteProfileByUserId;
  public get_profile_by_id = getOneProfileById;
  public get_profile_by_user_id = getOneProfileByUserId;
  public update_profile_by_user_id = updateProfileByUserId;
  

  

}
export const ProfileIndex = new Profile();
