import {
  isLocalhost,
  parseImageUrl,
  objectPath,
  getProduct,
  getInstallments,
} from "../utils/utils";

window.checkIfisWishlist = function () {
  function updateWishlistButton(wishlistButtonParent) {
    const wishlistButton = $(wishlistButtonParent).find(
      ".js--shelf-add-to-wish"
    );

    const productId = wishlistButton.data("id");
    const localWishlist =
      localStorage.getItem("wishlist") || window.currentWishlist || "";
    
    const checkIdProduct = (productIdWish) => {
      if (localWishlist.includes(productIdWish)) {
        $(wishlistButtonParent).addClass("js-checked");
        wishlistButton.addClass("x-active");
      }
    }

    if ($("body").hasClass("produto2021")) {
      var id = skuJson_0.productId;
      checkIdProduct(id);
    } else {
      checkIdProduct(productId)
    }
  }

  try {
    if ($("body").hasClass("produto2021")) {
      updateWishlistButton(
        $(".x-productPage__callToAction .x-add-it-to-wishlist")
      );
    } else {
      $(`.prateleira[id^="ResultItems"] > div > ul > li[class^="loja-maria-filo"]:not(.js-checked)`).each(function (i) {
        updateWishlistButton(this);
      });
      
    }
  } catch (error) {
    console.error("Wishlist Error", error);
  }
};

class Wishlist {
  constructor() {
    this.isHomolog =
      window.location.hostname.split(".")[0].indexOf("homolog") > -1;

    if (this.isHomolog) {
      this.storeName = window.location.hostname.split(".")[0];
    } else {
      this.storeName = window.rex.store;
    }
    this.urlPrefix = isLocalhost
      ? `//${window.rex.store}.vtexcommercestable.com.br`
      : "";
    this.currentIds = "";

    this.products = [];
    this.loadingProducts = true;
    this.productsPerPage = 47;
    this.page = 1;

    vtexjs.checkout.getOrderForm().done((orderForm) => {
      this.requestIds();
      checkIfisWishlist();
    });

    this.bindEvents();
  }

  showCompartilhar(length) {
    length > 0
      ? $(".wishlist__share").css("opacity", "1")
      : $(".wishlist__share").css("opacity", "0");
  }

  getValueFromPath(obj, key) {
    return key.split(".").reduce(function (o, x) {
      return typeof o == "undefined" || o === null ? o : o[x];
    }, obj);
  }
  // verifica se o usuário já está no master data
  async userInMasterData(email){
    const url = `/api/dataentities/CL/search?_fields=wishlist,id,email&email=${email}`;
    const settings = {
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
    }

    try {
      const fetchResponse = await fetch(url, settings);
      const data = await fetchResponse.json();
      return !!data.length
    }
    catch (e){
      console.log('Erro ao buscar user no master data, error:', e);
    }
  }

  // atualiza o master data com o email do user logado
  async patchEmailUser(email){
    const url = `/api/dataentities/CL/documents/`;
    const settings = {
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      body: JSON.stringify({ 'email':  email, 'wishlist': ''}),
      headers: {
        'Accept': "application/json",
        "Content-Type": "application/json",
      },
    }

    try {
      const fetchResponse = await fetch(url, settings);
      const data = await fetchResponse.status;
      return data;
    } catch(e) {
      console.log('Erro ao atualizar o master data com email do user, error:', e);
    }
  }

  async whenUserIsNotOnMasterData(){
    try{
      const emailUser = 
        this.getValueFromPath(
          window,
          "vtexjs.checkout.orderForm.clientProfileData.email"
        ) || "";

      const userInMasterData = await this.userInMasterData(emailUser);
  
      if(userInMasterData) return;

      const patchEmailUser = await this.patchEmailUser(emailUser);
      
      patchEmailUser === 201 ? this.requestIds() : '';
    } catch (e) {
      console.log('Error in whenUserIsNotOnMasterData function', e)
    }
  }
  // recupera ids armazenados na entidade do cliente
  async requestIds() {
    this.currentIds = "";
    window.currentWishlist = "";
    const loggedIn =
      this.getValueFromPath(window, "vtexjs.checkout.orderForm.loggedIn") ||
      false;
    const self = this;
    let currentWishlist;
    let userId =
      this.getValueFromPath(
        window,
        "vtexjs.checkout.orderForm.userProfileId"
      ) || "";

    // verifica se o usuário está logado
    if (loggedIn) {
      // se tiver logado, faz a requisição da wishlist no master data
      fetch(
        `/api/dataentities/CL/search?_fields=wishlist,id&userId=${userId}`,
        {
          method: "GET",
          mode: "cors",
          credentials: "same-origin",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          // verifica se a wishlist do master data está vazia
          if (data.length && !$.isEmptyObject(data[0])) {
            self.id = data[0].id;
            let tempLocalWishlist = localStorage.getItem("wishlist")
              ? localStorage.getItem("wishlist").split(",")
              : [];
            let tempOnlineWishlist = data[0].wishlist.split(",");
            currentWishlist = data[0].wishlist.split(",");

            if (tempLocalWishlist.join("") != tempOnlineWishlist.join("")) {
              try {
                tempLocalWishlist.map((item, key) =>
                  !~tempOnlineWishlist.indexOf(item)
                    ? currentWishlist.push(item)
                    : false
                );
              } catch (e) {
                console.error(e);
              }

              fetch(`/api/dataentities/CL/documents/${self.id}`, {
                method: "PATCH",
                mode: "cors",
                cache: "no-cache",
                body: JSON.stringify({ wishlist: currentWishlist.join(",") }),
                headers: {
                  accept: "application/json",
                  "content-type": "application/json",
                },
              }).then((data) => {
                // console.log(data)
              });
            }

            window.currentWishlist = currentWishlist.join(",");
            localStorage.removeItem("wishlist");
            self.mount();
            self.updateFlag();
            this.updateHeaderCount();
          } else {
            this.whenUserIsNotOnMasterData();
          }
        })
        .catch((err) => {
          localStorage.getItem("wishlist")
            ? (window.currentWishlist = localStorage.getItem("wishlist"))
            : console.log(
                "request ao MD falhou e não tem wishlist no localStorage"
              );
          self.updateFlag();
          console.error(err);
        });
    } else {
      if (localStorage.getItem("wishlist")) {
        this.currentIds = localStorage.getItem("wishlist");
      } else if (window.location.search.split("ids=")[1]) {
        this.currentIds = window.location.search.split("ids=")[1];
      } else {
        console.assert(
          !isLocalhost,
          "> Usuário não está logado e não tem wishlist no localStorage"
        );
      }
      this.mount();
      this.updateFlag();
    }
  }

  updateHeaderCount() {
    // let wishlistCount =
    //   window.currentWishlist == "" || window.currentWishlist == undefined
    //     ? 0
    //     : window.currentWishlist.split(",").length;
    // !!wishlistCount && $(".wishlist__count").text(` (${wishlistCount - 1})`);
  }

  async updateWishlist(elem, id) {
    const self = this;

    id = id.toString();
    const { loggedIn } = window.vtexjs.checkout.orderForm;
    let tempWishlist = window.currentWishlist.split(",");
    let newWishlist, actionMessage;

    
    if (~tempWishlist.indexOf(id)) {
      const index = tempWishlist.indexOf(id);
      actionMessage = "removido da";
      tempWishlist.splice(index, 1);
      elem.removeClass("x-active");
    } else {
      actionMessage = "adicionado à";
      tempWishlist.push(id);
      elem.addClass("x-active");
      // this.renderWishListPopUp(id);
    }

    newWishlist = tempWishlist.join(",");
    
    if (loggedIn) {
      fetch(`/api/dataentities/CL/documents/${self.id}`, {
        method: "PATCH",
        credentials: "same-origin",
        body: JSON.stringify({ wishlist: newWishlist }),
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
      })
        .then((res) => {
          this.currentIds = newWishlist;
          // $("#wishlist").html("");
          this.mount();
          //this.updateFlag()
        })
        .catch((err) => {
          console.error(err);
          // swal(
          //   "Houve um erro ao manipular este produto na sua lista de favoritos"
          // );
          this.currentIds = newWishlist;
          localStorage.setItem("wishlist", newWishlist);
          this.mount();
          //this.updateFlag()
        });
    } else {
      this.currentIds = newWishlist;
      localStorage.setItem("wishlist", newWishlist);
      this.mount();
      //this.updateFlag()
      this.updateHeaderCount();
    }

    window.currentWishlist = newWishlist;

    //swal(`Produto ${actionMessage} wishlist.`)
  }

  loadMore() {
    if (!this.loadingProducts) {
      this.page = this.page + 1;
      // this.getProducts();
      this.getProducts();
    }
  }

  onWishListEmpty(){
    $('body').addClass('x-active');
    $('.x-wishlist-list, .js--wishlist-shelfs').empty();
    $('.x-wrap-center-content__message').show();
    $('.x-wishlist-page__not-found').show();
  }

  getProducts() {
    this.loadingProducts = true;

    let self = this;
    let productIds = this.currentIds || window.currentWishlist;
    productIds = productIds.split(",").filter(Boolean);

    const productIdLongString = productIds.map(id =>  `fq=productId:${id}`).join('&');

    const shelfId = $(window).width() > 760 ? '4a258ce9-136f-46aa-9925-ed1081dfe366' : '4a258ce9-136f-46aa-9925-ed1081dfe366';

    const fetchUrl = `${
      this.urlPrefix
    }/buscapagina?${productIdLongString}&PS=${productIds.length}&sl=${shelfId}&cc=100&sm=0&PageNumber=1`;
    
    fetch(fetchUrl)
      .then(res => res.text())
      .then(data => {
        $('.js--wishlist-shelfs').html(data);
        $('body').addClass('x-active');
      })
      .catch((err) => {
        this.onWishListEmpty();
        console.error(err);
      });
  }

  updateFlag() {
    try {
      $(".helperComplement").remove();

      if ($("body").hasClass("produto2021")) {
        let currentIds = window.currentWishlist
          ? window.currentWishlist.split(",")
          : "";
        let theBtn = $(".x-productPage__callToAction .x-add-it-to-wishlist");
        let dataId = window.skuJson.productId.toString();

        // console.log(dataId, currentIds, ~currentIds.indexOf(dataId))
        if (~currentIds.indexOf(dataId)) {
          if (!theBtn.hasClass("x-active")) {
            theBtn.addClass("x-active");
          }
        } else {
          if (theBtn.hasClass("x-active")) {
            theBtn.removeClass("x-active");
          }
        }
      }
      window.checkIfisWishlist();
    } catch (error) {
      console.error(error);
    }
  }

  // monta a página de whishlist
  mount() {
    if ($("body").hasClass("wishlist")) {
      this.products = [];
      this.page = 1;
      // this.getProducts();
      this.getProducts();
      // this.setShareLinks()
    }
  }

  bindEvents() {
    // $("body").on("change", ".shelf-product--horizontal select", function (e) {
    //   $(this)
    //     .closest(".shelf-product--horizontal__size")
    //     .removeClass("is-error");
    // });

    // $("body").on("click", ".js-wishlist-add-to-cart", function (e) {
    //   e.preventDefault();
    //   const parent = $(this).closest(".shelf-product--horizontal");
    //   const skuSelectedValue = $(this)
    //     .closest(".shelf-product--horizontal")
    //     .find("select")
    //     .val();

    //   $(".js-wishlist-add-to-cart").attr("disabled", true);

    //   if (skuSelectedValue) {
    //     $(this).addClass("js-loading");
    //     $("#ajaxBusy").stop(true, true).slideDown(100);

    //     let item = {
    //       id: skuSelectedValue,
    //       seller: 1,
    //       quantity: 1,
    //     };

    //     try {
    //       vtexjs.checkout.getOrderForm().done((o) => {
    //         const salesChannel = objectPath(
    //           o,
    //           "salesChannel",
    //           getCookie("VTEXSC") ? getCookie("VTEXSC").split("=")[1] : 1
    //         );

    //         vtexjs.checkout.addToCart([item], null, salesChannel).done(() => {
    //           parent.find(".js-wishlist-add-to-cart").removeClass("js-loading");
    //           $("#ajaxBusy").stop(true, true).slideUp(100);
    //           parent
    //             .find(".shelf-product--horizontal__size")
    //             .removeClass("is-error");
    //         });
    //       });
    //     } catch (e) {
    //       $(".js-wishlist-add-to-cart").attr("disabled", false);
    //       $("#ajaxBusy").stop(true, true).slideUp(100);
    //     }
    //   } else {
    //     parent.find(".shelf-product--horizontal__size").addClass("is-error");
    //   }
    // });

    // $("body").on("click", ".wishlist__share", function () {
    //   $(".wishlist__overlay, .wishlist__lightbox").fadeIn();
    // });

    // $("body").on(
    //   "click",
    //   ".wishlist__overlay, .share-list__close",
    //   function () {
    //     $(".wishlist__overlay, .wishlist__lightbox").fadeOut();
    //   }
    // );

    // $("body").on("click", ".share-list__button", (e) => {
    //   e.preventDefault();
    //   this.shareWishlist();
    // });

    // $(window).on("scroll", () => {
    //   const win = $(window);
    //   const element = $("#wishlist ul");

    //   const screenTop = win.scrollTop();
    //   const screenBottom = screenTop + win.height();

    //   if (!element) return;

    //   const elementTop = element.offset()?.top;
    //   const elementBottom = elementTop + element.innerHeight();
    //   if (screenBottom > elementBottom) {
    //     this.loadMore();
    //   }
    // });
  }
}

$(function () {
  try {
    window.rex.wishlist = new Wishlist();
    // window.checkIfisWishlist()

    $("body").on("click", ".js--shelf-add-to-wish", function (e) {
      e.preventDefault();

      var _this = $(this);
      let productId = $(e.currentTarget).attr("data-id")
        ? $(e.currentTarget).attr("data-id")
        : $(e.currentTarget)
            .closest("[data-id]")
            .attr("data-id");
      // $(this).addClass('is-favorited')
      console.assert(!isLocalhost, "wishlist productId", productId);
      // Update wishlist with productId
      window.rex.wishlist.updateWishlist(_this, productId);
      window.rex.wishlist.updateHeaderCount();
    });

    $('body').on('click', ".x-productPage__callToAction .x-add-it-to-wishlist", function(e){
      e.preventDefault();
      let productId = skuJson_0.productId;
      var _this = $(this);
      window.rex.wishlist.updateWishlist(_this, productId);
      window.rex.wishlist.updateHeaderCount();
    })
  } catch (e) {
    console.error(e);
  }
});
