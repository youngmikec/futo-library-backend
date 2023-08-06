import { fail, response, success } from "../middleware/response.js";
import { fetchService } from "../service/user-service.js";


export async function fetchHandler(req, res) {
    try {
      const entity = await fetchService({ query: req.query, user: req.user });
      return response(res, 200, entity);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
}