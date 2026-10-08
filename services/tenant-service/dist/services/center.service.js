"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCenterService = exports.updateCenterService = exports.getCenterByIdService = exports.getAllCentersService = exports.createCenterService = void 0;
const center_repository_1 = require("../repositories/center.repository");
const createCenterService = async (input) => {
    return (0, center_repository_1.createCenter)(input);
};
exports.createCenterService = createCenterService;
const getAllCentersService = async () => {
    return (0, center_repository_1.findAllCenters)();
};
exports.getAllCentersService = getAllCentersService;
const getCenterByIdService = async (id) => {
    return (0, center_repository_1.findCenterById)(id);
};
exports.getCenterByIdService = getCenterByIdService;
const updateCenterService = async (id, input) => {
    return (0, center_repository_1.updateCenter)(id, input);
};
exports.updateCenterService = updateCenterService;
const deleteCenterService = async (id) => {
    return (0, center_repository_1.deactivateCenter)(id);
};
exports.deleteCenterService = deleteCenterService;
