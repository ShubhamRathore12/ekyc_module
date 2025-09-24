import { useSelector } from "store";
export const useAuth = () => useSelector((state) => state.auth);
