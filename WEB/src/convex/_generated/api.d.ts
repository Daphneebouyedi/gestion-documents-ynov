/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as _internal from "../_internal.js";
import type * as actionLogger from "../actionLogger.js";
import type * as alerts from "../alerts.js";
import type * as attestations from "../attestations.js";
import type * as auth from "../auth.js";
import type * as authActions from "../authActions.js";
import type * as conventions from "../conventions.js";
import type * as demandes from "../demandes.js";
import type * as documents from "../documents.js";
import type * as emailService from "../emailService.js";
import type * as http from "../http.js";
import type * as internal_ from "../internal.js";
import type * as internal_auth from "../internal_auth.js";
import type * as myFunctions from "../myFunctions.js";
import type * as requests from "../requests.js";
import type * as seedHistoricalData from "../seedHistoricalData.js";
import type * as updateDateOfBirth from "../updateDateOfBirth.js";
import type * as userProfile from "../userProfile.js";
import type * as user_actions from "../user_actions.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  _internal: typeof _internal;
  actionLogger: typeof actionLogger;
  alerts: typeof alerts;
  attestations: typeof attestations;
  auth: typeof auth;
  authActions: typeof authActions;
  conventions: typeof conventions;
  demandes: typeof demandes;
  documents: typeof documents;
  emailService: typeof emailService;
  http: typeof http;
  internal: typeof internal_;
  internal_auth: typeof internal_auth;
  myFunctions: typeof myFunctions;
  requests: typeof requests;
  seedHistoricalData: typeof seedHistoricalData;
  updateDateOfBirth: typeof updateDateOfBirth;
  userProfile: typeof userProfile;
  user_actions: typeof user_actions;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
