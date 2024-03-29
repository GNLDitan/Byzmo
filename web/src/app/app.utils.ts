import { InjectionToken } from '@angular/core';
import { config } from 'rxjs';
import { isNullOrUndefined } from 'util';

export class Utils {

  static readonly PROVIDER_IMAGES: any = {
    MASTERCARD: 'data:image/png;base64,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',
    VISA: 'data:image/png;base64,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'
  }

  static readonly LS_EMAIL: string = 'email';
  static readonly LS_TOKEN: string = 'token';
  static readonly LS_BROWSERTOKEN: string = 'browsertoken';
  static readonly LS_CURRENCY: string = 'currency';
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  static readonly LS_FACEBOOKACCESSTOKEN = 'facebookToken';
  static readonly LS_GUESTTOKEN: string = 'guesttoken';
  static readonly LS_FOREX: string = 'forexrate';
  static readonly LS_PMSOURCERESOURCE: string = 'paymongo_source_resource';

  static readonly LS_PAYMONGO_CREDITCARD_3DS: string = 'creditcard3ds';


  static readonly CART: string = 'cart';
  static readonly PRODUCT_LIMIT: number = 12;
  static readonly MIN_INSTALLMENT: number = 2;
  static readonly BASE_CURRENCY: string = 'PHP';
  static readonly LOCAL_COUNTRYCODE: string = 'PH';

  static readonly ORDER_STATUS_REPORT: number = 1;
  static readonly SALES_REPORT: number = 2;
  static readonly SHIPPED_ORDER_REPORT: number = 3;
  static readonly ORDER_WITH_DISCOUNT_REPORT: number = 4;
  static readonly ORDER_WITH_LAYAWAY_REPORT: number = 5;
  static readonly ORDER_WITH_PREORDER_REPORT: number = 6;


  static readonly PRODUCT_PRICE_LIST_REPORT: number = 1;
  static readonly STOCK_PRODUCTS_REPORT: number = 2;
  static readonly PRODUCT_WITH_HIGHEST_LOW_SALE_REPORT: number = 3;
  static readonly PRODUCT_TAG_REPORT: number = 4;

  static readonly PREORDER_TERM: any = [{
    code: 'DP',
    description: 'Downpayment'
  }, {
    code: 'RB',
    description: 'Remaining Balance'
  }, {
    code: 'SH',
    description: 'Shipping'
  }, {
    code: 'IN',
    description: 'Shipping Insurance Fee'
  }
  ];

  static readonly FILE_LANDING: any = {
    product: 'product',
    landing: 'landing',
    blog: 'blog',
    attachment: 'attachment'
  };

  static readonly PAYMENT_TYPE: any = {
    order: 'order',
    layaway: 'layaway',
    preOrder: 'pre-order'
  };


  static readonly ONLINE_PAYMENT: any = {
    Paypal: 'PayPal',
    DebitCreditCard: 'Credit / Debit Card',
    CreditCardPaypal: 'Credit Card / Paypal',
    CreditCardViaPaymongo: 'Credit Card / Debit Card via Paymongo',
    GCash: 'GCash',
    GCashViaGcash: 'GCash via Paymongo',
    GrabPay: 'GrabPay'
  };


  static readonly FEATURE_TYPE: any = {
    justArrived: 'Just Arrived',
    onHandItem: 'On Hand',
    onSale: 'On Sale',
    preOrder: 'Pre-Order',
    preOrderLayaway: 'Pre-Order-Layaway'
  };

  static readonly FILTER_ORDER: any = [
    {
      name: 'Category',
      code: 'category'
    },
    {
      name: 'Sub Category',
      code: 'subcategory'
    },
    {
      name: 'Brand',
      code: 'brand'
    },
    {
      name: 'Sub Brand',
      code: 'subbrand'
    }];
  static readonly CURRENCY: any = [
    {
      code: 1,
      description: 'PHP'
    }];

  static readonly ORDER_STATUS: any = [
    {
      id: 0,
      description: 'All'
    },
    {
      id: 1,
      description: 'Unfulfilled'
    },
    {
      id: 2,
      description: 'Processing'
    },
    {
      id: 3,
      description: 'Shipped'
    },
    {
      id: 4,
      description: 'Fulfilled'
    },
    {
      id: 5,
      description: 'Cancelled'
    }];

  static readonly PAYMENT_STATUS: any = [
    {
      id: 1,
      description: 'Unpaid'
    },
    {
      id: 2,
      description: 'Partial'
    },
    {
      id: 3,
      description: 'Paid'
    }];

  static readonly AMOUNT_TYPE: any = [
    {
      code: 1,
      description: 'Currency'
    },
    {
      code: 2,
      description: 'Percent'
    }];


  static readonly REPORT_PRODUCT_TYPE: any = [
    {
      id: 0,
      description: 'All'
    },
    {
      id: 1,
      description: 'On Sale'
    },
    {
      id: 2,
      description: 'Pre Order'
    },
    {
      id: 3,
      description: 'Layaway'
    },
    {
      id: 4,
      description: 'Pre Order Layaway'
    }
  ];

  static readonly REPORT_SORT: any = [
    {
      id: 1,
      description: 'Name'
    },
    {
      id: 2,
      description: 'Item Number'
    },
    {
      id: 3,
      description: 'Price'
    }
  ];

  static readonly REPORT_STOCKS_FILTER: any = [
    {
      id: 0,
      description: 'In Stock'
    },
    {
      id: 1,
      description: 'Low On Stock'
    },
    {
      id: 2,
      description: 'Sold Out'
    }
  ];


  static readonly REPORT_TAGS_FILTER: any = [
    {
      id: 'all',
      description: 'All'
    },
    {
      id: 'on sale',
      description: 'On Sale'
    },
    {
      id: 'on hand',
      description: 'On Hand'
    },
    {
      id: 'just arrived',
      description: 'Just Arrived'
    },
    {
      id: 'pre-order',
      description: 'Pre Order'
    },
    {
      id: 'pre-order-layaway',
      description: 'Pre Order Layaway'
    }
  ];

  static readonly REASON_FOR_CANCEL: any = [
    'Change payment method',
    'Incorrect contact information',
    'Change combined order',
    'Delivery time too long',
    'Duplicate order',
    'Change of Delivery Address',
    'Decided on another product',
    'Shipping cost to high',
    'Found better price elsewhere'
  ];

  static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  static isStringNullOrEmpty(value: string): boolean {
    return this.isNullOrUndefined(value) || value.trim() === '';
  }

  static isArrayNullOrUndefinedOrEmpty(value: any): boolean {
    return value === null || value === undefined || value.length === 0;
  }

  static isInvalidNumber(value: any): boolean {
    return this.isNullOrUndefined(value) || isNaN(value) || value === 0 || value === '0';
  }

  static isInvalidDate(value: any): boolean {
    return this.isNullOrUndefined(value) || isNaN(value);
  }


  static getObjectIndex(find: any, obj: any = []): number {
    const currObj = obj.filter(x => x.code === find)[0];
    return obj.indexOf(currObj);
  }

  static openUrl(url: string) {
    if (!Utils.isStringNullOrEmpty(url)) {
      const win = window.open(url, '_blank');
      win.focus();
    }
  }

  static getFileNameOnly(rawFileName: string) {

    if (rawFileName.indexOf('.') > -1) {
      return rawFileName.split('.').slice(0, -1).join('.');
    }

    return rawFileName;
  }


  static modifyDomClass(htmlString: any, classToAdd: string) {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    const collection = this.updateDomClass(doc.body as HTMLBodyElement, 'P', classToAdd);
    return collection.innerHTML;
  }

  static updateDomClass(collection: HTMLBodyElement, nodeName: string,
                        classToAdd: string, index: number = 0): HTMLBodyElement {

    while (collection.children.length > index) {
      if (collection.children[index].nodeName === nodeName) {
        collection.children[index].classList.add(classToAdd);
      }
      if (!this.isNullOrUndefined(collection.children[index]) && collection.children[index].children.length > 0) {
        this.updateDomClass(collection.children[index] as HTMLBodyElement, nodeName, classToAdd, index);
      }

      index++;
    }
    return collection;
  }


  static ArrayObjectUpdater(arr: Array<any>, obj: any) {
    const index = arr.findIndex((data) => data.id === obj.id);

    if (index <= -1) {
      arr.push(obj);
    } else {
      arr[index] = obj;
    }

    return arr;
  }

  static arraysEqual(arr1, arr2) {
    let cnt = 0;
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = arr1.length; i--;) {
      if (arr1[i] !== arr2[i]) {
        cnt++;
      }
    }
    if (cnt > 0) {
      return false;
    } else {
      return true;
    }
  }


  static GenerateAcronym(param: string) {
    const oparam = param;
    param = param
      .split(/\s/)
      .reduce(function(accumulator, word) {
        return (accumulator + word.charAt(0)).toUpperCase();
      }, '');

    if (param.length <= 2) {
      param = param + oparam.slice(-1);
    }
    return param;
  }

  static numericSuffix(i) {
    const j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + 'st';
    }
    if (j === 2 && k !== 12) {
      return i + 'nd';
    }
    if (j === 3 && k !== 13) {
      return i + 'rd';
    }
    return i + 'th';
  }

  static loadImages(sources: Object, callback: (Image) => void) {
    const images = {};
    let loadedImages = 0;
    let imagesCtr = 0;

    for (const src in sources) {
      imagesCtr++;
      if (sources[src].indexOf('null') > -1) {
        sources[src] = 'img/no-image.png';
      }
    }
    for (const src in sources) {
      images[src] = new Image();
      images[src].onload = () => {
        if (++loadedImages >= imagesCtr) {
          callback(images);
        }
      };

      images[src].onerror = () => {
        images[src].src = 'img/no-image.png';
      };

      images[src].src = sources[src];
    }
  }

  static stringReplace(text: string, seperator) {
    if (!this.isNullOrUndefined(text)) {
      const rtext = text.replace(/[^a-zA-Z ]0-9/g, '');
      return rtext.replace(/\s+/g, seperator);
    } else { return text; }
  }


  static findDataObjectByKey(key: any, obj: any): any {
    const prop = obj.hasOwnProperty(key);
    if (prop) {
      return obj[key];
    } else {
      const objs = Object.keys(obj).filter(x => Object.keys(obj[x]).length > 0);
      for (let i = 0; i < objs.length; i++) {
        const result = this.findDataObjectByKey(key, obj[objs[i]]);
        if (!Utils.isNullOrUndefined(result)) {
          return result;
        }
      }
    }

  }

  static generateNameAbbrev(name: string) {
    if (name === undefined || name == null || name === '') {
      return '';
    }

    let abbrev = '';
    const split = name.split(' ');

    if (split.length <= 0) {
      abbrev = name[0].toUpperCase();
    } else if (split.length === 1) {
      abbrev = split[0][0].toUpperCase();
    } else {
      abbrev = split[0][0].toUpperCase() + split[split.length - 1][0].toUpperCase();
    }

    return abbrev;
  }
  static getUniqueNo() {
    const rnd = Math.random().toString();
    const rnm = rnd.split('.').join('');
    return parseInt(rnm) % 1000000;
  }

  static groupByKey(array, key) {
    return array
      .reduce((hash, obj) => {
        if (obj[key] === undefined) { return hash; }
        return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) });
      }, {});
  }

  static numberWithCommasAndCurrency(amt, currency: string = '') {
    const strAmount = amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (currency !== '' ? (currency + ' ') : '') + strAmount;
  }

  static encodeBlogUrl(title: string) {
    title = title.replace(/[^a-zA-Z0-9 ]/g, '');
    title = title.replace(/\s+/g, '-');

    return title;
  }


  static fullAmount(amount: number) {
    let cntvs = '00';
    const spt = amount.toString().split('.');
    let res = '';
    if (spt.length > 1) {
      cntvs = spt[1].length === 1 ? spt[1] + '0' : spt[1];
      res = spt[0] + cntvs;
    } else { res = spt[0] + cntvs; }
    return parseInt(res);
  }
}

