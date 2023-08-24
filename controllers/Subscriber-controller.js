import {
    fetchService,
    createService,
    updateService,
    deleteService,
  } from "../service/subscribe-service.js";
  import { fail, response, success } from "../middleware/response.js";
  
  export const fetchHandler = async (req, res) => {
    try {
      const result = await fetchService(req.query);
      return response(res, 200, result);
    } catch (err) {
      return fail(res, 400, `${err.message}`);
    }
  };
  
  export const createHandler = async (req, res) => {
    try {
      const result = await createService(req.body);
      return success(res, 201, result);
    } catch (err) {
      return fail(res, 400, `${err.message}`);
    }
  };
  
  export const updateHandler = async (req, res) => {
    try {
      const { recordId } = req.params;
      const result = await updateService(recordId, req.body, req.user);
      return success(res, 200, result);
    } catch (err) {
      //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
  };
  
  export const deleteHandler = async (req, res) => {
    try {
      const result = await deleteService(req.params.recordId);
      return success(res, 200, result);
    } catch (err) {
      return fail(res, 400, `${err.message}`);
    }
  };