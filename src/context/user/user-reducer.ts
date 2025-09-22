import { userAuthCookieName } from "./user-context";
import { deleteCookie } from "cookies-next";
import type { IUserAuthAction, IUserAuthState } from "./type";
import { setClientCookie } from "../../utils";

export const UserAuthAction = {
    LOG_OUT : "LOG_OUT",
    SET_TOKEN : "SET_TOKEN",
    SET_PAGE_LOADED : "SET_PAGE_LOADED",
    SET_USER :  "SET_USER",
}

export const UserInitialState: IUserAuthState = {
    token: localStorage.getItem('authToken') || "",
    user: null,
    pageIsLoaded: false,
};

export const UserAuthReducer = (
    state: IUserAuthState,
    action: IUserAuthAction,
) => {
    const { payload } = action;

    switch (action.type) {
        case UserAuthAction.SET_TOKEN:
            // Set cookie and localStorage
            setClientCookie({
                cookieName: userAuthCookieName,
                cookieValue: payload as string,
                hours: 24,
            });
            localStorage.setItem('authToken', payload as string);

            return {
                ...state,
                token: action.payload as string,
            };
        case UserAuthAction.SET_PAGE_LOADED:
            return {
                ...state,
                pageIsLoaded: true,
            };
        case UserAuthAction.SET_USER:
            return {
                ...state,
                user: payload as string | null,
            };
        case UserAuthAction.LOG_OUT:
            // Remove cookie & local storage data
            deleteCookie(userAuthCookieName);
            localStorage.removeItem('authToken');

            return {
                ...state,
                token: "",
                user: null,
            };
        default:
            return state;
    }
};