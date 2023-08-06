import { fail, response, success } from "../middleware/response.js";
import { validateRegister } from "../models/User.js";
import { registerService } from "../service/auth-service.js";

export const createHandler = async (req, res) => {
    try {
        const data = req.body;
        const entity = await registerService(data);
        return success(res, 200, entity)
    } catch (err) {
      return fail(res, 400, `${err.message}`);
    }
}

export async function fetchHandler(req, res) {
    try {
      const entity = await fetchService({ query: req.query, user: req.user });
      return response(res, 200, entity);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
}