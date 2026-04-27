// src/api/api.js
import axios from "axios";

export const BASE_URL = "https://backend.keyarea1.com/api/v1";

const API = axios.create({
  baseURL: BASE_URL,
});

export const getPreferredCities = () => API.get("/landing/findProperty");
export const getBudgetProjects = () => API.get("/landing/budget-50lac-1cr");
export const get2BhkProperty = () => API.get("/landing/2bhk-projects");
export const get3BhkProperty = () => API.get("/landing/3bhk-projects");
export const get4BhkProperty = () => API.get("/landing/4bhk-projects");
export const get5BhkProperty = () => API.get("/landing/5bhk-projects");
export const getBungalowProperty = () => API.get("/landing/bungalow");

export const getProjectById = (id) => API.get(`/landing/projects/${id}`);
export const getProjectUnitsById = (id) => API.get(`/landing/projects/${id}/units`);

// =========================
// TOWER BASED APIs (UPDATED)
// =========================

/**
 * Get Towers - Returns list of towers for a project
 */
export const getTowers = (slug) =>
  API.get(`/project/${slug}/towers`);

/**
 * Get Floors by Tower - Returns floors for a specific tower
 */
export const getFloorsByTower = (slug, tower_id) =>
  API.get(`/project/${slug}/towers`, { params: { tower_id } });

/**
 * Get Units by Floor - Returns units for a specific tower and floor
 */
export const getUnitsByFloor = (slug, tower_id, floor) =>
  API.get(`/project/${slug}/towers`, { params: { tower_id, floor } });

/**
 * Get Unit Details - Returns detailed information for a specific unit
 */
export const getUnitDetails = (slug, tower_id, floor, unit_number) =>
  API.get(`/project/${slug}/towers`, { params: { tower_id, floor, unit_number } });