export interface CustomButtonI {
  style: string;
  onClick: () => void;
  button_type: "elevated_button" | "submerged_button"
  children: React.ReactNode;
}
