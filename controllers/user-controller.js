import { fail, response, success } from "../middleware/response.js";
import { 
  fetchService, 
  fetchSelfService,
  updateUserService,
  updateByUserService,
  updateByAdminService,
  deleteUserService,
} from "../service/user-service.js";


export async function fetchHandler(req, res) {
    try {
      const entity = await fetchService({ query: req.query, user: req.user });
      return response(res, 200, entity);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
}

export const fetchSelfHandler = async (req, res) => {
  try {
    const entity = await fetchSelfService(req.query, req.user);
    return response(res, 200, entity);
  } catch (err) {
  //   loging(module, req, err);
    return fail(res, 400, `${err.message}`);
  }
}

export const resetCodeHandler = async (req, res) => {
  try {
      const result = await passwordResetCodeService(req.params.email);
      return success(res, 200, result);
  } catch (err) {
      return fail(res, 400, `${err.message}`);
  }
}

export const updateByUserHandler = async (req, res) => {
  try {
    const result = await updateByUserService(req.body.updatedBy, req.body);
    return success(res, 200, result);
  } catch (err) {
  //   loging(module, req, err);
    return fail(res, 400, `${err.message}`);
  }
}

export const updateByAdminHandler = async (req, res) => {
  try {
    const result = await updateByAdminService(req.params.recordId, req.body);
    return success(res, 200, result);
  } catch (err) {
  //   loging(module, req, err);
    return fail(res, 400, `${err.message}`);
  }
}

export const updateUserHandler = async (req, res) => {
  try {
      const { recordId } = req.params;
      const result = await updateUserService(recordId, req.body, req.user);
      return success(res, 200, result);
  } catch (err) {
      return fail(res, 400, `${err.message}`);
  }
}

export async function deleteUserHandler(req, res) {
  try {
      const { recordId } = req.params;
      const result = await deleteUserService(recordId);
      return success(res, 200, result);
  } catch (err) {
      return fail(res, 400, `${err.message}`);
  }
}