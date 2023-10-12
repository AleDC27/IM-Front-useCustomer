import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { all_app_texts } from "./language";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct, removeProduct } from "../redux/actions";
import { categoryIcons } from "./Constants";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";

export default function useModal(initialValue = false) {
  const [isOpen, setIsOpen] = useState(initialValue);
  const [productData, setProductData] = useState({
    name: "",
    price: 0,
    image: "",
    description: "",
  });

  const openModal = (
    name,
    price,
    image,
    description,
    id,
    promotion,
    discount,
    surcharge,
    product,
    aditional,
    menuTypeId,
    categoryId,
    unitTypeId,
    productTypeId,
    supplierId,
    allergenType,
    careful
  ) => {
    setIsOpen(true);
    setProductData({
      name: name,
      price: price,
      image: image,
      description: description,
      id: id,
      promotion: promotion,
      discount: discount,
      surcharge: surcharge,
      product: product,
      aditional: aditional,
      menuTypeId: menuTypeId,
      categoryId: categoryId,
      unitTypeId: unitTypeId,
      productTypeId: productTypeId,
      supplierId: supplierId,
      allergenType: allergenType,
      careful: careful,
    });
  };

  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal, productData };
}

export function useAmountControls() {
  const dispatch = useDispatch();

  const addToCart = (
    image,
    name,
    description,
    price,
    amount,
    comment,
    id,
    promotion,
    discount,
    surcharge,
    product,
    aditional,
    menuTypeId,
    categoryId,
    unitTypeId,
    productTypeId,
    supplierId,
    allergenType,
    careful
  ) => {
    const item = {
      image: image,
      name: name,
      description: description,
      price: price,
      amount: amount,
      comment: comment,
      id: id,
      promotion: promotion,
      discount: discount,
      surcharge: surcharge,
      product: product,
      aditional: aditional,
      menuTypeId: menuTypeId,
      categoryId: categoryId,
      unitTypeId: unitTypeId,
      productTypeId: productTypeId,
      supplierId: supplierId,
      allergenType: allergenType,
      careful: careful,
    };
    dispatch(addProduct(item));
  };

  const removeFromCart = (name) => {
    dispatch(removeProduct(name));
  };

  return { addToCart, removeFromCart };
}

export function useRating() {
  const [stars, setStars] = useState(0);
  const starsArray = [...Array(5)];

  const handleStars = (currentRate) => {
    setStars(currentRate);
  };

  return { starsArray, stars, handleStars };
}

export function useTermsAndConditions() {
  const [loginModal, setLoginModal] = useState(false);

  const openLoginModal = () => {
    setLoginModal(true);
  };

  const closeLoginModal = () => {
    setLoginModal(false);
  };
  return { loginModal, openLoginModal, closeLoginModal };
}

export const randomIcon = () => {
  let icon = categoryIcons[Math.floor(Math.random() * categoryIcons.length)];
  return icon;
};
export const dataDecrypt = (data) => {
  const password = import.meta.env.VITE_REACT_APP_KEY;
  const result = CryptoJS.AES.decrypt(data, password);
  const originalText = result.toString(CryptoJS.enc.Utf8).split("/");
  const urlInfo = {
    commerce: originalText[0],
    sector: originalText[1],
    table: originalText[2],
  };
  return urlInfo;
};


//* Funcion para obtener nombres y descripciones del menu
export function menuTranslate (array) {
  const menuData = {
    nombres: [],
    descripciones: []
  }
  array.map((m)=>{
    menuData.nombres.push({name: m.name});
    if (m.description) menuData.descripciones.push({description: m.description});
  })

  return menuData
}
//* Funcion para obtener nombres y descripciones del menu

//* Funcion para obtener nombres de las categorias
export function categoryTranslate(array) {

  const nombres= [];

  array.map((c) => {
    nombres.push({ name: c.category })
  });

  return nombres;
}
//* Funcion para obtener nombres de las categorias


//! funcionando -- falta pasar como variable from y to
export async function translateText(lang = "en", all_app_texts, menu=false) {
  //! obtengo todos los valores de un array con objetos
  const arrayTexts = all_app_texts.map((obj) => {
    const clave = Object.keys(obj)[0];
    const valor = obj[clave];
    return valor;
  });
  //! les doy la forma que requiere microsoft translator
  const formattedTextArray = arrayTexts.map((text) => ({ text }));
  const objetoResultado = {};
  //! hago la traduccion
  return await axios({
    baseURL: import.meta.env.VITE_MICROSOFT_TRANSLATE_ENDPOINT,
    url: "/translate",
    method: "post",
    headers: {
      "Ocp-Apim-Subscription-Key": import.meta.env.VITE_MICROSOFT_TRANSLATE_KEY,
      "Ocp-Apim-Subscription-Region": import.meta.env.VITE_MICROSOFT_LOCATION,
      "Content-type": "application/json",
      "X-ClientTraceId": uuidv4().toString(),
    },
    params: {
      "api-version": "3.0",
      from: "es",
      to: lang,
    },
    data: formattedTextArray,
    responseType: "json",
  }).then(function (response) {
    // console.log(JSON.stringify(response.data, null, 4));
    const all_app_texts_translated = all_app_texts.map((o, index) => {
      const key = Object.keys(o)[0];
      return { [key]: response.data[index].translations[0].text };
    });

    if(!menu){
      for (const obj of all_app_texts_translated) {
      Object.assign(objetoResultado, obj);
    }
    //! resultado en forma de objeto
    return objetoResultado;
  } else {
    return all_app_texts_translated
  }
  });
}

export const formattedOrder = (
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
) => {
  //!todas las promociones, descuentos y recargos
  let totalPromotion = 0;
  let totalDiscount = 0;
  let totalSurcharge = 0;
  //!items segun tipo
  let productos = [];
  let adicionales = [];
  let menus = [];
  //! ordeno items por tipo y sumo promociones, descuentos y recargos
  cart.map((p) => {
    if (!p.menuTypeId) {
      let result = productsList.findIndex((f) => f.name === p.name);
      if (result !== -1) {
        productos.push(p);
      } else {
        adicionales.push(p);
      }
    } else {
      menus.push(p);
    }
    totalPromotion = totalPromotion + p.promotion * p.amount;
    totalDiscount = totalDiscount + p.discount * p.amount;
    totalSurcharge = totalSurcharge + p.surcharge * p.amount;
  });
  let sectorId = sectorID;
  let table = tableID;
  let commerceId = commerceID;
  //!calculo el precio real
  let precioMenu = totalPrice;
  // let precioMenu =
  //   totalPromotion ? totalPrice - (totalPrice * totalPromotion) / 100 : totalPrice;
  // precioMenu = totalDiscount ? precioMenu - (precioMenu * totalDiscount) / 100 : precioMenu;
  // precioMenu = totalSurcharge ? precioMenu + (precioMenu * totalSurcharge) / 100 : precioMenu;
  let partial = precioMenu;
  //!calculo precio con costo de mesa
  //!si tienen promocion, descuento, recargo calculo, sino no
  precioMenu =
    tablePrice.tablePromotion ? precioMenu -
    (precioMenu * tablePrice.tablePromotion) / 100 : precioMenu;
  precioMenu = 
  tablePrice.tableDiscount ? precioMenu -
  (precioMenu * tablePrice.tableDiscount) / 100
    : precioMenu;
  precioMenu =
    tablePrice.tableSurcharge ? precioMenu +
    (precioMenu * tablePrice.tableSurcharge) / 100 : precioMenu;
  //!calculo precio con costo de sector
  precioMenu =
    sectorPrice.sectorPromotion ? precioMenu -
    (precioMenu * sectorPrice.sectorPromotion) / 100 : precioMenu;
  precioMenu =
    sectorPrice.sectorDiscount ? precioMenu -
    (precioMenu * sectorPrice.sectorDiscount) / 100 : precioMenu;
  precioMenu =
    sectorPrice.sectorSurcharge ? precioMenu +
    (precioMenu * sectorPrice.sectorSurcharge) / 100 : precioMenu;
  let finalPrice = precioMenu;
  setPrice({
    totalPromotion,
    totalDiscount,
    totalSurcharge,
    partial,
    finalPrice,
  });
  //! Creo una nueva order
  setOrder({
    user: user,
    productos: productos,
    adicionales: adicionales,
    menus: menus,
    totalPromotion: totalPromotion,
    totalDiscount: totalDiscount,
    totalSurcharge: totalSurcharge,
    sectorId: sectorId,
    table: table,
    commerceId: commerceId,
    totalPrice: precioMenu,
  });
  // return order;
};


export const detectLanguage = async (textSample = 'How are you') => {
  try {
    return await axios({
      baseURL: import.meta.env.VITE_MICROSOFT_TRANSLATE_ENDPOINT,
      url: "/detect",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": import.meta.env
          .VITE_MICROSOFT_TRANSLATE_KEY,
        "Ocp-Apim-Subscription-Region": import.meta.env.VITE_MICROSOFT_LOCATION,
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      params: {
        "api-version": "3.0",
        // from: "en",
        // to: ["fr", "zu"],
      },
      data: [
        {
          text: textSample,
        },
      ],
      responseType: "json",
    }).then(function (response) {
      console.log(response.data[0].language);
      return response.data[0].language;
    });
  } catch (error) {
    console.error(error);
  }
};