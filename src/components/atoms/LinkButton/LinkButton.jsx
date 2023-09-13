/* eslint-disable react/prop-types */
import s from "./LinkButton.module.scss";
import { useNavigate } from "react-router-dom";

export default function WelcomeButton({ text, path, type, centered, newHeight, newFz,darker }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(path);
  };

  return (
    <button className={`${s.button} ${(type === "secundary") ? s.secundary : s.primary} ${centered ? s.centered : ""} ${darker && s.darker}`} onClick={handleClick} style={{ height: newHeight ? newHeight : '', fontSize: newFz ? newFz : ''}}>
      {text}
    </button>
  );
}

