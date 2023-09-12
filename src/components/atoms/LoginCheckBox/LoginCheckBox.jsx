import { useState } from "react";
import { useTranslation } from "react-i18next";
import s from "./LoginCheckBox.module.scss";

export default function LoginCheckBox({id, checked, setChecked, lang}) {
  const [t, i18n] = useTranslation("global");

  return (
    <>
      <label className={s.checkbox}>
        <input className={`${s.inputCheckbox} ${checked && s.checked}`} type="checkbox" id={id} name="language" checked={checked} onChange={()=> {setChecked(true); i18n.changeLanguage(lang)}} onBlur={()=> setChecked(false)}/>
        <div className={s.checkbox_circle}>
          <svg viewBox="0 0 52 52" className={s.checkmark}>
            <circle
              fill="none"
              r="25"
              cy="26"
              cx="26"
              className={s.checkmark_circle}
            ></circle>
            <path
              d="M16 26l9.2 8.4 17.4-21.4"
              className={s.checkmark_kick}
            ></path>
          </svg>
        </div>
      </label>
    </>
  );
}