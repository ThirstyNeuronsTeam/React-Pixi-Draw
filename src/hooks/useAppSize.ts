import { useContext } from "react";
import { AppSizeContext } from "../components/Application/Application";

export const useAppSize = () => {
  const { appSize } = useContext(AppSizeContext);

  return  appSize;
};
