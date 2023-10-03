import { useState } from "react";
import { ReactComponent as ImenuLogo } from "../../../assets/ImenuHorizontal.svg";
import { useTranslation } from "react-i18next";
import LinkButton from "../../atoms/LinkButton/LinkButton";
import logo from "../../../assets/ReviewIcon.png";
import HugeTitle from "../../atoms/HugeTitle/HugeTitle";
import SubTitle from "../../atoms/SubTitle/SubTitle";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import Stars from "../../atoms/Stars/Stars";
import Confetti from "react-confetti";
import ReviewTextArea from "../../atoms/ReviewTextArea/ReviewTextArea";
import useWindowSize from "react-use/lib/useWindowSize";
import s from "./Review.module.scss";
import FeedbackButton from "../../atoms/FeedbackButton/FeedbackButton";
import { useSelector } from "react-redux";
import StepProgressBar from "../../molecules/StepProgressBar/StepProgressBar";
import { useRating } from "../../../utils/Functions";
import { sendReview } from "../../../redux/actions";

export default function Review() {
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const [duration, setDuration] =useState(true);
  const language = useSelector((state)=> state.language);
  const commerceInfo = useSelector((state)=> state.commerce);
  const {width, height} = useWindowSize();

  const [t, i18n] = useTranslation(["global"]);

  const { starsArray, stars, handleStars } = useRating();

  const handleSent = ()=> {
    //! Crear accion que envie el feedback al backend
    const review = {
      rating: stars,
      feedback: comment
    }
    sendReview(review);
    setSent(true);
  }

  setTimeout(() => {
    setDuration(false)
  }, 6000);


  return (
    <section className={s.reviewContainer}>
      <header className={s.reviewHeader}>
        {duration && (
          <Confetti numberOfPieces={200} height={height / 2} width={width} />
        )}
        <img src={logo} className={s.logo} />
        <div>
          <HugeTitle text={commerceInfo.name} centered={true} review={true} />
          <SubTitle text={language.rating_preparingOrder} review={true} />
        </div>
        {/* <div className={s.progressBar}> */}
        <StepProgressBar />
        {/* </div> */}
      </header>
      <article className={s.article}>
        <ImenuLogo style={{ margin: "0 auto", height: "36px" }} />
        <SubTitle text={language.rating_reviewQuestion} />
        <Stars stars={stars} starsArray={starsArray} handleStars={handleStars} />
        {sent ? (
          <div style={{ marginTop: "50px" }}>
            <HugeTitle text={language.rating_thanks} centered={true} />
            <Paragraph text={language.rating_yourOpinion} />
          </div>
        ) : (
          <>
            <div className={s.textAreaHeader}>
              <label className={s.label} htmlFor="comment">
                {language.rating_reviewLabel}
              </label>
              <Paragraph text={`${comment.length}/240`} />
            </div>
            <ReviewTextArea
              name="comment"
              comment={comment}
              setComment={setComment}
              maxLength={240}
              placeholder={language.rating_reviewPlaceholder}
            />
            <FeedbackButton
              text={language.rating_send}
              handleSent={handleSent}
            />
          </>
        )}
        <div style={{ margin: "auto 0 15px 0" }}>
          <LinkButton
            text={language.rating_backButton}
            path={"/home"}
            centered={true}
            newHeight={"61px"}
            newFz={"21px"}
          />
        </div>
      </article>
    </section>
  );
}
