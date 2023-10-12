/* eslint-disable react/prop-types */
import { useState } from "react";
import { ReactComponent as XIcon } from "../../../assets/xIcon.svg";
import { useAmountControls} from "../../../utils/Functions";
import { useTranslation } from "react-i18next";
import TextArea from "../../atoms/TextArea/TextArea";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import SubTitle from "../../atoms/SubTitle/SubTitle";
import s from "./Modal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { isAvailable } from "../../../redux/actions";
import { emojiPng } from "../../../utils/Constants";

export default function Modal({ productData,  isOpen, closeModal, changeStyle}) {
  const cart = useSelector((state)=> state.cart);
  const allproducts = useSelector((state) => state.allProducts);
  const alladitionals = useSelector((state) => state.allAditionals);
  const products = useSelector((state) => state.products);
  const language = useSelector((state)=> state.language);
  const available = useSelector((state)=> state.productAvailable);
  const [comment, setComment] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const {addToCart} = useAmountControls();

  const [t, i18n] = useTranslation(["global"]);

   let emoji1 = "";
   if (productData.image) {
     const unicodeArray = productData.image.split(" ");
     const formattedCodes = unicodeArray.map((code) => code.replace("U+", ""));
     const emoji = String.fromCodePoint(
       parseInt(formattedCodes[0], 16),
       parseInt(formattedCodes[1], 16)
     );
     emoji1 = emoji;
   }

   //? useEffect para consultar si el producto abierto esta activo.
   useEffect(() => {
     productData.name && dispatch(isAvailable(productData.name, setLoading));
   }, [allproducts, alladitionals, products]);

    const getPng = (text) => {
      if (text) {
        let png = emojiPng.find((e) => e.name === text);
        return png.src;
      }
    };

  return (
    <article className={`${s.modalContainer} ${isOpen && s.open}`}>
      <div className={s.modal}>
        <XIcon
          className={s.closeIcon}
          onClick={() => {
            closeModal();
            setAmount(0);
            setComment("");
          }}
        />
        <div className={s.productHeader}>
          {/* <span role="img" aria-label="Emoji" className={s.productIcon}>
            {emoji1}
          </span> */}
          <img
            src={getPng(productData.image)}
            style={{ width: "60px", height: "60px" }}
          />
          <div className={s.productInfo}>
            <SubTitle
              className={s.productTitle}
              alignment={"left"}
              text={productData.name}
            />
            <Paragraph
              className={s.productDescription}
              text={productData.description}
              alignment={"left"}
              scrollable={true}
            />
            <h3 className={s.productPrice}>{`$ ${productData.price}`}</h3>
          </div>
        </div>
        <div>
          {loading === false && available === false && (
            <p className={`${s.notAvailableProduct} ${s.visible}`}>
              Producto no disponible
            </p>
          )}
          <div className={s.textAreaHeader}>
            <label className={s.label} htmlFor="comment">
              {language.productModal_commentLabel}
            </label>
            <p className={s.textLimit}>{`${comment.length}/140`}</p>
          </div>
          <TextArea
            id="comment"
            comment={comment}
            setComment={setComment}
            maxLength={140}
            placeholder={language.productModal_commentPlaceholder}
          />
        </div>
        <div className={s.amount}>
          <button
            className={s.amountButton}
            onClick={() => setAmount((prevAmount) => prevAmount - 1)}
            disabled={amount <= 0}
          >
            -
          </button>
          <p className={s.cant}>{amount}</p>
          <button
            className={s.amountButton}
            onClick={() => setAmount((prevAmount) => prevAmount + 1)}
          >
            +
          </button>
        </div>
        <button
          className={`${s.addButton} ${!available && s.unavailable}`}
          onClick={() => {
            available &&
              addToCart(
                productData.image,
                //productData.photo
                productData.name,
                productData.description,
                productData.price,
                amount,
                comment,
                productData.id,
                productData.promotion,
                productData.discount,
                productData.surcharge,
                productData.product,
                productData.aditional,
                productData.menuTypeId,
                productData.categoryId,
                productData.unitTypeId,
                productData.productTypeId,
                productData.supplierId,
                productData.allergenType,
                productData.careful
                // productData.cost,
              );
            available && changeStyle();
            setAmount(0);
            setComment("");
            closeModal();
          }}
        >
          {language.productModal_addButton}
        </button>
      </div>
    </article>
  );
}
