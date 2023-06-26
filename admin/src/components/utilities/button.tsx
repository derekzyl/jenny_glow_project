import { CustomButtonI } from "./interface/button.interface";
import "./utilities.css";

export const CustomButton = ({
  style,
  onClick,
  children,
  button_type,
}: CustomButtonI) => {
  const button_class_name = `${style} ${button_type} `;
  return (
    <div onClick={onClick} className={button_class_name}>
      {children}
    </div>
  );
};
