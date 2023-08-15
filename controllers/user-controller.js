import { fail, response, success } from "../middleware/response.js";
import { fetchService, updateUserService, deleteUserService } from "../service/user-service.js";


export async function fetchHandler(req, res) {
    try {
      const entity = await fetchService({ query: req.query, user: req.user });
      return response(res, 200, entity);
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