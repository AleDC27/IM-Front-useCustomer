import { ReactComponent as MpLogo } from "../../../assets/MpLogo.svg";
import { useTranslation } from "react-i18next";
import MpButton from "../../atoms/MpButton/MpButton";
import OrderInfo from "../../molecules/OrderInfo/OrderInfo";
import s from "./Mercadopago.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getActiveProducts,
  getPaymentMethods,
  getPosValue,
  getSectorValue,
  getStatus,
  postOrder,
  removerCart,
} from "../../../redux/actions";
import { formattedOrder } from "../../../utils/Functions";
export default function Mercadopago() {
  const language = useSelector((state) => state.language);
  const paymentMethods = useSelector((state) => state.paymentMethods);
  const sectorPrice = useSelector((state) => state.sectorPrice);
  const commerce = useSelector((state) => state.commerce);
  const commerceID = commerce.id;
  const productsList = useSelector((state) => state.products);
  const tablePrice = useSelector((state) => state.tablePrice);
  const user = useSelector((state) => state.user);
  const sectorID = useSelector((state) => state.sector);
  const open = useSelector((state) => state.status);
  const tableID = useSelector((state) => state.table);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const totalPrice = cart.reduce((count, p) => count + p.price * p.amount, 0);
  const [price, setPrice] = useState({});
  const [order, setOrder] = useState({});
  const [isLoading, setIsloading] = useState(true);
  const [t, i18n] = useTranslation(["global"]);

  useEffect(() => {
    dispatch(getPosValue(tableID));
    dispatch(getSectorValue(sectorID));
    dispatch(getActiveProducts(commerceID));
    dispatch(getStatus(commerceID, setIsloading));
    dispatch(getPaymentMethods(commerceID));
  }, []);

  useEffect(() => {
    formattedOrder(
      user,
      cart,
      productsList,
      sectorID,
      tableID,
      commerceID,
      tablePrice,
      sectorPrice,
      totalPrice,
      setPrice,
      setOrder
    );
  }, [tablePrice, sectorPrice, productsList, user]);

  const handleMp = () => {
    const methodId = paymentMethods.filter((m) => m.type === "mercadopago")[0].id;
    let mercadoPago = true;
    postOrder(order, methodId, mercadoPago, commerce.name);
    dispatch(removerCart());
    return;
  };

  return (
    <main className={s.mainContainer}>
      <MpLogo className={s.mpLogo} />
      <OrderInfo
        border={true}
        price={price}
        tablePrice={tablePrice}
        sectorPrice={sectorPrice}
      />
      <MpButton path={"/rating"} text={language.mercadoPago_payButton} onClick={handleMp} />
    </main>
  );
}
