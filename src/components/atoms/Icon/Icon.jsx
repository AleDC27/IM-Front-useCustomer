/* eslint-disable react/prop-types */
import s from "./Icon.module.scss";

export default function Icon({icon}) {
  return (
    <div className={s.iconContainer}>
      <img className={s.icon} src={icon.src}/>
      <h4>{icon.name}</h4>
    </div>
  )
}
