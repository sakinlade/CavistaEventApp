import { getCookie } from "cookies-next";
import { type IUserAuthContext } from "./type";
import { createContext, useEffect, useReducer, type ReactNode } from "react";
import { UserAuthAction, UserAuthReducer, UserInitialState } from "./user-reducer";

export const UserAuthContext = createContext<IUserAuthContext>({
    token: "",
    user: null,
    pageIsLoaded: false,
    dispatch: () => {},
});
interface IAuthProvider {
    children: ReactNode;
}

export const userAuthCookieName = "userAuthCookieName";
UserAuthContext.displayName = "UserAuth";

export function UserAuthContextProvider({ children }: IAuthProvider) {
    const [state, dispatch] = useReducer(UserAuthReducer, UserInitialState);
    useEffect(() => {
        checkAuthToken();
    }, []);

    const checkAuthToken = async () => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            dispatch({
                type: UserAuthAction.SET_TOKEN as keyof typeof UserAuthAction,
                payload: storedToken,
            });
        } else {
            // Fallback to cookie if no localStorage token
            const cookieToken = await getCookie(userAuthCookieName);
            if (cookieToken) {
                // Save to localStorage for persistence
                localStorage.setItem('authToken', cookieToken.toString());
                dispatch({
                    type: UserAuthAction.SET_TOKEN as keyof typeof UserAuthAction,
                    payload: cookieToken,
                });
            }
        }

        dispatch({
            type: UserAuthAction.SET_PAGE_LOADED as keyof typeof UserAuthAction,
        });
    };

    // const refreshToken = async (token: string) => {
    //     try {
    //         // Replace with your actual API endpoint
    //         const response = await request({ token }).get('/account/me');
    //         if (response.status === 200) {
    //             const userData = await response.data?.data;
    //             console.log("Fetched user data:", userData);
    //             // Store user data in localStorage
    //             localStorage.setItem('userData', JSON.stringify(userData));
    //             dispatch({
    //                 type: UserAuthAction.SET_USER as keyof typeof UserAuthAction,
    //                 payload: userData,
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error fetching user data:', error);
    //     }
    // };

    return (
        <UserAuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UserAuthContext.Provider>
    );
}