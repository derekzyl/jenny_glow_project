import {
  createStaff,
  deleteStaff,
  getAllStaff,
  getMyStaffProfile,
  getOneStaff,
  updateStaff,
} from "./main_staff/controller.staff";

class Staff {
  public create_staff = createStaff;
  public update_staff = updateStaff;
  public get_staff_profile = getMyStaffProfile;
  public get_one_staff = getOneStaff;
  public get_all_staff = getAllStaff;
  public delete_staff = deleteStaff;
}
export const StaffIndex = new Staff();
