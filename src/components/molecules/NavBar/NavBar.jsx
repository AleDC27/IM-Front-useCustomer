import { useState } from "react";
import { ReactComponent as ArrowBack } from "../../../assets/ArrowBack.svg";
import { ReactComponent as Profile } from "../../../assets/Profile.svg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage, removeUser } from "../../../redux/actions";
import { idiomas } from "../../../utils/Constants";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import i18next from "i18next";
import s from "./NavBar.module.scss";

export default function NavBar({ ordersButton, setIsloading, navarrow, path }) {
  const [userActive, setUserActive] = useState(false);
  const [langActive, setLangActive] = useState(false);
  const [t, i18n] = useTranslation("global");
  const language = useSelector((state) => state.language);
  const email = useSelector((state) =>
    state.user.email ? state.user.email : ""
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const current = localStorage.getItem("Lang");

  const handleUser = () => {
    setUserActive(!userActive);
    setLangActive(false);
  };

  const handleLang = () => {
    setLangActive(!langActive);
    setUserActive(false);
  };

  return (
    <nav className={`${s.navBar} ${ordersButton && s.spaceBetween}`} style={{justifyContent: navarrow ? "space-between" : "flex-end"}}>
      {navarrow && <ArrowBack className={s.icon} onClick={() => navigate(path)} />}
        {ordersButton ? <button className={s.ordersButton} onClick={()=> navigate('/myorders')}>Ver mis pedidos</button> : null}
      <div className={s.infoContainer}>
        <Profile
          className={`${s.icon} ${userActive && s.pfActive} ${s.pfIcon}`}
          onClick={handleUser}
          onBlur={() => setUserActive(false)}
        />
        <div className={`${userActive && s.visible} ${s.userContainer}`}>
          <div className={s.userInfo}>
            <Profile className={`${s.icon} ${s.disabled}`} />
            <Paragraph text={email} disabled={true} />
          </div>
          <hr
            style={{
              width: "90%",
              margin: "0 auto",
              border: ".5px solid #BABABA",
            }}
          />
          <div
            className={`${s.logOutContainer}`}
            onClick={() => dispatch(removeUser())}
          >
            <ArrowBack
              className={`${s.icon} ${email == "" && s.iconDisabled}`}
            />
            <Paragraph
              text={t("navBar.disconnect")}
              disabled={email == ""}
            />
          </div>
        </div>
        <div
          className={`${s.lang} ${langActive && s.lgActive}`}
          onClick={handleLang}
          onBlur={() => setLangActive(false)}
        >
          <Paragraph text={current} />
          <div className={`${langActive && s.visible} ${s.langsContainer}`}>
            <div
              className={`${s.langOption} ${current === "Es" && s.highlight}`}
              onClick={() => {
                i18n.changeLanguage("Es");
                localStorage.setItem("Lang", "Es");
              }}
            >
              <Paragraph text={"Español"} />
            </div>
            <div
              className={`${s.langOption} ${current === "En" && s.highlight}`}
              onClick={() => {
                i18n.changeLanguage("En");
                localStorage.setItem("Lang", "En");
              }}
            >
              <Paragraph text={"English"} />
            </div>
            <div
              className={`${s.langOption} ${current === "Por" && s.highlight}`}
              onClick={() => {
                i18n.changeLanguage("Por");
                localStorage.setItem("Lang", "Por");
              }}
            >
              <Paragraph text={"Português"} />
            </div>
            <div
              className={`${s.langOption} ${
                current === "Bra" && s.highlight
              }`}
              onClick={() => {
                i18n.changeLanguage("Bra");
                localStorage.setItem("Lang", "Bra");
              }}
            >
              <Paragraph text={"Português Bra"} />
            </div>
            {/* {idiomas.map((idioma, index) => (
              <div
                key={index}
                className={`${s.langOption} ${
                  current === idioma.lang && s.highlight
                }`}
                onClick={() =>
                  dispatch(changeLanguage(idioma.lang, setIsloading))
                }
              >
                <Paragraph text={idioma.name} />
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </nav>
  );
}
