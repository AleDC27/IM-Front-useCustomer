import { Link } from 'react-router-dom';
import s from './MpButton.module.scss';

export default function MpButton({ text/* , path */, onClick}) {

  return (
    <a /* to={path} */ className={s.mpButton} onClick={onClick}>
      {text}
    </a>
  );
}
