import { useContext } from "react";
import { UserAuthContext } from "./user-context";

export function useUserAuthContext() {
    const context = useContext(UserAuthContext);

    if (!context) {
        throw new Error(
            "userAuthContext must be used within UserAuthContextProvider",
        );
    }

    return context;
}