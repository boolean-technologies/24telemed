import { useNavigate } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query';
import { Path } from "./paths";
import { TOKEN_KEY } from "../constants";
import { OpenAPI } from "@local/api-generated";
import { tokenManager } from "./tokenManager";

export function useLogout(){
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    return () => {
        tokenManager.setToken()
        queryClient.clear();
        navigate(Path.login);
    }
}