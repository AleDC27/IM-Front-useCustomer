import axios from "axios";
import {
  ADD_PRODUCT,
  REMOVE_PRODUCT,
  SET_USER,
  GET_COMMERCE,
  GET_ACTIVE_MENUS,
  GET_ACTIVE_DISHES,
  FILTER_CATEGORY,
  GET_ALL_CATEGORIES,
  GET_SEARCHED_PRODUCT,
  SET_TABLE,
  REMOVE_USER,
  ADD_CART,
  SET_SECTOR,
  GET_STATUS,
  GET_ACTIVE_PRODUCTS,
  GET_ALL_ADITIONALS,
  CHANGE_LANGUAGE,
  SET_TABLE_PRICE,
  SET_SECTOR_PRICE,
  CLEAR_SEARCH_PRODUCT,
  GET_PAYMENT_METHODS,
  IS_PRODUCT_AVAILABLE,
} from "./actionTypes";
import { ProductsInfo } from "../../utils/Constants";
import { TRANSLATE_TEXT } from "./actionTypes";
import { v4 as uuidv4 } from "uuid";
import { all_app_texts } from "../../utils/language";
import { menuTranslate, translateText } from "../../utils/Functions";

////////////////////* SearchBar Action Creator *////////////////////

export function searchProduct(product) {
  return async function (dispatch) {
    try {
      return dispatch({
        type: GET_SEARCHED_PRODUCT,
        payload: product,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function clearSearchProduct() {
  return async function (dispatch) {
    try {
      return dispatch({
        type: CLEAR_SEARCH_PRODUCT,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

////////////////////* Cart Actions Creators *////////////////////

export function addCart(cart) {
  return async function (dispatch) {
    try {
      return dispatch({
        type: ADD_CART,
        payload: cart,
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function addProduct(product) {
  return async function (dispatch) {
    try {
      return dispatch({
        type: ADD_PRODUCT,
        payload: product,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function getAllProducts() {
  return async function (dispatch) {
    try {
      return dispatch({
        type: GET_ALL_PRODUCTS,
        payload: ProductsInfo,
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function removeProduct(name) {
  return async function (dispatch) {
    try {
      return dispatch({
        type: REMOVE_PRODUCT,
        payload: name,
      });
    } catch (error) {
      console.error(error);
    }
  };
}

////////////////////* Order *////////////////////

export async function postOrder(order, methodId) {
  let date = new Date().toJSON().slice(0, 10);
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const formattedHour = hour < 10 ? "0" + hour : hour;
  const formattedMinute = minute < 10 ? "0" + minute : minute;

  const time = formattedHour + ":" + formattedMinute;
  let additionals = {
    id: [],
    name: [],
    cost: [],
    promotion: [],
    discount: [],
    surcharge: [],
    amount: [],
    unitTypeId: [],
    detail: [],
  };
  let products = {
    id: [],
    name: [],
    cost: [],
    unitTypeId: [],
    productTypeId: [],
    supplierId: [],
    promotion: [],
    discount: [],
    surcharge: [],
    amount: [],
    allergenType: [],
    careful: [],
    detail: [],
  };
  let menu = {
    id: [],
    name: [],
    description: [],
    cost: [],
    menuTypeId: [],
    categoryId: [],
    dishes: [],
    product: [],
    additionalId: [],
    promotion: [],
    discount: [],
    surcharge: [],
    amount: [],
    detail: [],
  };
  //!armo todos los adicionales
  if (order.adicionales.length) {
    order.adicionales.map((a) => {
      additionals.id.push(`${a.id}`);
      additionals.name.push(`${a.name}`);
      additionals.cost.push(`${a.price}`);
      additionals.promotion.push(`${a.promotion}`);
      additionals.discount.push(`${a.discount}`);
      additionals.surcharge.push(`${a.surcharge}`);
      additionals.amount.push(`${a.amount}`);
      additionals.unitTypeId.push(`${a.unitTypeId}`);
      additionals.detail.push(`${a.comment}`);
    });
  } else {
    additionals = {
      id: [""],
      name: [""],
      cost: [""],
      promotion: [""],
      discount: [""],
      surcharge: [""],
      amount: [""],
      unitTypeId: [""],
      detail: [""],
    };
  }
  //!armo todos los productos
  if (order.productos.length) {
    order.productos.map((p) => {
      products.id.push(`${p.id}`);
      products.name.push(`${p.name}`);
      products.cost.push(`${p.price}`);
      products.unitTypeId.push(`${p.unitTypeId}`);
      products.productTypeId.push(`${p.productTypeId}`);
      products.supplierId.push(`${p.supplierId}`);
      products.promotion.push(`${p.promotion}`);
      products.discount.push(`${p.discount}`);
      products.surcharge.push(`${p.surcharge}`);
      products.amount.push(`${p.amount}`);
      products.allergenType.push(`${p.allergenType}`);
      products.careful.push(`${p.careful}`);
      products.detail.push(`${p.comment}`);
    });
  } else {
    products = {
      id: [""],
      name: [""],
      cost: [""],
      unitTypeId: [""],
      productTypeId: [""],
      supplierId: [""],
      promotion: [""],
      discount: [""],
      surcharge: [""],
      amount: [""],
      allergenType: [""],
      careful: [""],
      detail: [""],
    };
  }
  //!armo todos los menus
  if (order.menus.length) {
    order.menus.map((m) => {
      menu.id.push(`${m.id}`);
      menu.name.push(`${m.name}`);
      menu.description.push(`${m.description}`);
      menu.cost.push(`${m.price}`);
      menu.menuTypeId.push(`${m.menuTypeId}`);
      menu.categoryId.push(`${m.categoryId}`);
      m.dishes ? menu.dishes.push(`${m.dishes}`) : menu.dishes.push("");
      m.product !== undefined
        ? menu.product.push(`${m.product}`)
        : menu.product.push("");
      m.additionalId !== undefined
        ? menu.additionalId.push(`${m.additional}`)
        : menu.additionalId.push("");
      menu.promotion.push(`${m.promotion}`);
      menu.discount.push(`${m.discount}`);
      menu.surcharge.push(`${m.surcharge}`);
      menu.amount.push(`${m.amount}`);
      menu.detail.push(`${m.comment}`);
    });
  } else {
    menu = {
      id: [""],
      name: [""],
      description: [""],
      cost: [""],
      menuTypeId: [""],
      categoryId: [""],
      dishes: [""],
      product: [""],
      additionalId: [""],
      promotion: [""],
      discount: [""],
      surcharge: [""],
      amount: [""],
      detail: [""],
    };
  }
  try {
    const newOrder = {
      name: order.name ? order.name : "sss",
      date: date,
      hour: time,
      status: "orderPlaced",
      detail: "",
      validity: date,
      promotion: 0,
      discount: 0,
      surcharge: 0,
      poId: parseInt(order.table),
      employeeId: 3,
      accountId: null,
      paymentId: methodId,
      commerceId: order.commerceId,
      deliveryId: null,
      paid: order.totalPrice.toFixed(2),
      courierId: null,
      costDelivery: 0,
      sectorId: parseInt(order.sectorId),
      accountemail: order.email ? order.email : "",
      accountname: order.name ? order.name : "",
      accountphone: order.phone ? order.phone : "",
      accountbirthDate: order.birthDate ? order.birthDate : "",
      accountaddress: order.address ? order.address : "",
      googleemail: order.email ? order.email : "",
      additionals,
      products,
      dishes: {
        id: [""],
        name: [""],
        description: [""],
        photo: [""],
        cost: [""],
        estimatedTime: [""],
        additionalId: [""],
        amountAdditional: [""],
        supplyId: [""],
        amountSupplies: [""],
        recipeId: [""],
        dishTypeId: [""],
        promotion: [""],
        discount: [""],
        surcharge: [""],
        amount: [""],
        detail: [""],
      },
      menu,
    };
    let response = await axios.post(
      "http://localhost:3001/order/new",
      newOrder
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}


export const sendReview = (review, orderId) => {
  try {
    let response = axios.put(`http://localhost:3001/order/rating/${orderId}`, review);
    return response.data;
  } catch (error) {
    console.error(error)
  }
}

////////////////////* Commerce Actions Creators *////////////////////

export function setTable(table) {
  return async function (dispatch) {
    try {
      //llamado a api para consultar datos de Pos
      return dispatch({
        type: SET_TABLE,
        payload: table,
      });
    } catch (error) {
      console, error(error);
    }
  };
}

export function setSector(sector) {
  return async function (dispatch) {
    try {
      //llamado a api para consultar datos de Pos
      return dispatch({
        type: SET_SECTOR,
        payload: sector,
      });
    } catch (error) {
      console, error(error);
    }
  };
}

export function getCommerce(id) {
  return async function (dispatch) {
    try {
      let commerceInfo = await axios.get(
        `http://localhost:3001/commerce/detail/${id}`
      );
      return dispatch({
        type: GET_COMMERCE,
        payload: commerceInfo.data[0],
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function getStatus(id, setIsLoading) {
  return async function (dispatch) {
    try {
      let status = await axios.get(
        `http://localhost:3001/commerce/openCommerce/${id}`
      );
      if (setIsLoading) setIsLoading(false);
      return dispatch({
        type: GET_STATUS,
        payload: status.data,
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function getPaymentMethods(id) {
  return async function (dispatch) {
    try {
      let payments = await axios.get(
        `http://localhost:3001/payment/all_active/${id}`
      );
      return dispatch({
        type: GET_PAYMENT_METHODS,
        payload: payments.data,
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function getActiveMenus(id, setIsLoading) {
  return async function (dispatch) {
    try {
      let allActiveMenus = await axios.get(
        // `http://localhost:3001/menu/all_active/${id}`
        `http://localhost:3001/menu/lastMenu/${id}`
      );
      const traduccion = async () => {
        //* Obtengo todos los nombres y descripciones (en este caso no tienen desc.)
        let results = menuTranslate(allActiveMenus.data);
        //* Traduzco todos los nombres y las descripciones
        let translatedNames = await translateText(
          localStorage.getItem("Lang"),
          results.nombres,
          true
        );
        let translatedDescriptions = await translateText(
          localStorage.getItem("Lang"),
          results.descripciones,
          true
        );
        //* Reemplazo los nombres originales por los nombres traducidos
        const translatedMenus = allActiveMenus.data.map((a, index) => {
          a.name = translatedNames[index].name;
          if (a.description)  a.description = translatedDescriptions[index].description
          return a;
        });
        return translatedMenus;
      };
      if (setIsLoading) setIsLoading(false);
      return dispatch({
        type: GET_ACTIVE_MENUS,
        // payload: { menus: allActiveMenus.data, id: id },
        payload: await traduccion(),
      });
    } catch (error) {
      console.error(error);
    }
  };
}

//!comentado hasta que arreguen este nuevo endpoint
// export function getActiveMenus(id) {
//   return async function (dispatch) {
//     try {
//       let date = new Date().toJSON().slice(0, 10);
//       const info = {
//         commerceId: id,
//         date: date,
//       };
//       let allActiveMenus = await axios.get(
//         "http://localhost:3001/menu/menuCommerceActive",
//         info
//       );
//       return dispatch({
//         type: GET_ACTIVE_MENUS,
//         payload: { menus: allActiveMenus.data},
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };
// }
export function getActiveDishes(id) {
  return async function (dispatch) {
    try {
      let allActiveDishes = await axios.get(
        "http://localhost:3001/dish/all_active"
      );
      return dispatch({
        type: GET_ACTIVE_DISHES,
        payload: { dishes: allActiveDishes.data, id: id },
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function getActiveProducts(id) {
  return async function (dispatch) {
    try {
      let allActiveProducts = await axios.get(
        `http://localhost:3001/product/all_active/${id}`
      );
       const traduccion = async () => {
         //* Obtengo todos los nombres y descripciones (en este caso no tienen desc.)
         let results = menuTranslate(allActiveProducts.data);
         //* Traduzco todos los nombres
         let translatedNames = await translateText(
           localStorage.getItem("Lang"),
           results.nombres,
           true
         );
         //* Reemplazo los nombres originales por los nombres traducidos
         const translatedProducts = allActiveProducts.data.map((a, index) => {
           a.name = translatedNames[index].name;
           return a;
         });
         return translatedProducts;
       };

      return dispatch({
        type: GET_ACTIVE_PRODUCTS,
        payload: await traduccion(),
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function getActiveAditionals(id) {
  return async function (dispatch) {
    try {
      let allActiveAditionals = await axios.get(
        `http://localhost:3001/additional/all_active/${id}`
        );
      const traduccion = async () => {
        //* Obtengo todos los nombres y descripciones (en este caso no tienen desc.)
        let results = menuTranslate(allActiveAditionals.data);
        //* Traduzco todos los nombres
        let translatedNames = await translateText(
          localStorage.getItem("Lang"),
          results.nombres,
          true
        );
        //* Reemplazo los nombres originales por los nombres traducidos
        const translatedAdittionals = allActiveAditionals.data.map(
          (a, index) => {
            a.name = translatedNames[index].name;
            return a;
          }
        );
        return translatedAdittionals;
      };

      return dispatch({
        type: GET_ALL_ADITIONALS,
        payload: await traduccion(),
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function getAllCategorys(id) {
  return async function (dispatch) {
    try {
      let allActiveCategorys = await axios.get(
        `http://localhost:3001/category/all_active/${id}`
      );
      return dispatch({
        type: GET_ALL_CATEGORIES,
        payload: allActiveCategorys.data,
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function filterCategory(id) {
  return async function (dispatch) {
    try {
      return dispatch({
        type: FILTER_CATEGORY,
        payload: id,
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export const setFiltro = (filtroPor) => {
  return {
    type: "FILTER_BY_CATEGORY",
    payload: filtroPor,
  };
};

export const isAvailable = (name, setLoading)=> {
  return {
    type: IS_PRODUCT_AVAILABLE,
    payload: { name: name, setLoading: setLoading },
  };
 }

export function getPosValue(id) {
  return async function (dispatch) {
    try {
      let response = await axios.get(`http://localhost:3001/pos/detail/${id}`);
      let tableSurcharge = response.data[0].surcharge
      let tableDiscount = response.data[0].discount
      let tablePromotion = response.data[0].promotion
      let tablePrice = {
        tableSurcharge,
        tablePromotion,
        tableDiscount
      }
      return dispatch({
        type: SET_TABLE_PRICE,
        payload: tablePrice
      })
      // return {tableSurcharge, tableDiscount, tablePromotion}
    } catch (error) {
      console.error(error);
    }
  };
}

export function getSectorValue(id) {
  return async function (dispatch) {
    try {
      let response = await axios.get(`http://localhost:3001/pos/detail/${id}`);
      let sectorSurcharge = response.data[0].surcharge;
      let sectorDiscount = response.data[0].discount;
      let sectorPromotion = response.data[0].promotion;
      let sectorPrice = {
        sectorSurcharge,
        sectorPromotion,
        sectorDiscount
      }
      return dispatch({
        type: SET_SECTOR_PRICE,
        payload: sectorPrice
      })
      // return { sectorSurcharge, sectorDiscount, sectorPromotion };
    } catch (error) {
      console.error(error);
    }
  };
}
////////////////////* User Actions Creators *////////////////////
export function setUser(user) {
  return async function (dispatch) {
    try {
      return dispatch({
        type: SET_USER,
        payload: user,
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function removeUser() {
  return async function (dispatch) {
    try {
      return dispatch({
        type: REMOVE_USER,
      });
    } catch (error) {
      console.error(error);
    }
  };
}

////////////////////* Language Action type *////////////////////

export function changeLanguage(lang, setIsloading) {
  return async function (dispatch) {
    try {
      if (setIsloading) setIsloading(true);
      const result = dispatch({
        type: CHANGE_LANGUAGE,
        payload: {
          lang: lang,
          language: await translateText(lang, all_app_texts),
        },
      });
      if (setIsloading) setIsloading(false);
      return result;
    } catch (error) {
      console.error(error);
    }
  };
}
