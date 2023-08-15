import { fail, response, success } from "../middleware/response.js";
import { registerService, loginService } from "../service/auth-service.js";

export const createHandler = async (req, res) => {
    try {
        const data = req.body;
        const entity = await registerService(data);
        return success(res, 200, entity)
    } catch (err) {
      return fail(res, 400, `${err.message}`);
    }
}


export const loginHandler = async (req, res) => {
    try {
        const data = req.body;
        const entity = await loginService(data);
        return success(res, 200, entity)
    }catch(err){
        return fail(res, 400, `${err.message}`);
    }
}
