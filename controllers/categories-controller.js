import { fail, response, success } from "../middleware/response.js";
import { fetchCategoryService, createCategoryService, updateCategoryService, deleteCategoryService } from '../service/categories-service.js';


export const fetchCategoryHandler = async (req, res) => {
    try{
        const entity = await fetchCategoryService({ query: req.query, user: req.user });
        return response(res, 200, entity);
    }catch(err){
        return fail(res, 400, `${err.message}`);
    }
}

export const createCategoryHandler = async (req, res) => {
    try {
        const entity = await createCategoryService(req.body);
        return success(res, 201, entity);
    }catch(err){
        return fail(res, 400, `${err.message}`);
    }
}

export async function updateCategoryHandler(req, res) {
    try {
        const { recordId } = req.params;
        const result = await updateCategoryService(recordId, req.body, req.user);
        return success(res, 200, result);
    } catch (err) {
        return fail(res, 400, `${err.message}`);
    }
}
  
  
export async function deleteCategoryHandler(req, res) {
    try {
        const { recordId } = req.params;
        const result = await deleteCategoryService(recordId);
        return success(res, 200, result);
    } catch (err) {
        return fail(res, 400, `${err.message}`);
    }
}