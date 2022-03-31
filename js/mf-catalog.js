import { waitForElement } from "./utils/utils";
import richSnippetBreadcrumbs from "./modules/rich-snippets-breadcrumb";

if ($("body").hasClass("catalog")) {
  function search() {
    if ($("body").hasClass("resultado-busca")) {
      $(".js--searched-text").text(vtxctx.searchTerm);
    }
  }

  // função para colocar o video na pagina de categoria
  function shelfVideo() {
    try {
      var countVideo = 0;
      var initCount = false;

      $(".x-product:not(.js-product-video-iterated)").each((_, xProduct) => {
        const $xProduct = $(xProduct);

        const videoUrl = $xProduct
          .find(".js-shelf-product-video")
          .find("li")
          .text();
        //console.log('videoUrl', videoUrl);

        if (
          videoUrl &&
          videoUrl.match("https") &&
          countVideo === 0 &&
          videoUrl.indexOf("blockgrid=true") < 0
        ) {
          $xProduct.addClass("has-video");
          const poster = Array.from(
            $xProduct.find(".x-image-default").children("img").first().get(0)
              .attributes
          ).filter((attribute) => attribute.name === "src")[0].value;
          $xProduct.find(".x-image-default").html(`
              <div class="js-shelf-video">
                <video class="x-product__video" poster="${poster}" src="${videoUrl
            .split("?")
            .shift()}" muted loop playsinline></video>
              </div>
            `);
          initCount = true;
        }

        if (initCount === true) {
          countVideo++;
          if (countVideo > 8) {
            countVideo = 0;
            initCount = false;
          }
        }

        $xProduct.addClass("js-product-video-iterated");
      });

      startObservation();
    } catch (error) {
      console.error(error);
    }
  }

  function startObservation() {
    try {
      const elements = Array.from(
        document.querySelectorAll(".x-product.has-video")
      );
      const observer = new IntersectionObserver(handleIntersection, {
        rootMargin: "0px",
      });
      elements.forEach((element) => observer.observe(element));
    } catch (error) {
      console.error(error);
    }
  }

  function handleIntersection(entries, observer) {
    try {
      entries.forEach((entry) => {
        const video = $(entry.target).find("video").get(0);
        let timeout;

        if (entry.isIntersecting || entry.isVisible) {
          timeout = setTimeout(() => video.play(), 100);
        } else {
          clearTimeout(timeout);
          video.pause();
        }
      });
    } catch (error) {
      console.error(error);
    }
  }




  function getNumberOfProducts() {
    var number = $(".value").html();

    $(".catalogResults__products-top").append(
      '<span class="value">' + number + " produtos</span>"
    );
  }

  function SeoText() {
    $(".catalogText .department__text h1").click(function () {
      $(".catalogText .department__text").toggleClass("active");
    });

    // function placeholderCheck
    try {
      var DText = $(".department__text").html();
      if (DText == "" || DText == " ") {
        $(".department__text").hide();
      }
    } catch (e) {
      console.error(e);
    }
  }

  function smartResearch() {
    const smartResearchOptions = {
      shelfClass: ".prateleira:not([id*=ResultItems])",
      filtersMenu: ".search-multiple-navigator",
      emptySearchMsg:
        "<h3>Esta combinação de filtros não retornou nenhum resultado!</h3>",
      infinityScroll: true,
      elemLoading: '<div class="department__loading"></div>',
      rangePrice: false,
      callback: function () {
        $("li.helperComplement").remove();
        if ($(".otx-selectedfilters").find("li").length) {
          $(".otx-selectedfilters").addClass("is-active");
        } else {
          $(".otx-selectedfilters").removeClass("is-active");
        }
      },
      shelfCallback: function () {
        $("li.helperComplement").remove();
        // checkIfisWishlist();
        $(".shelf-product").find("p.flag.todos").remove();
      },
      oioajaxCallback: function () {
        $("li.helperComplement").remove();
        shelfVideo();
      },
    };

    var filterCheckboxes = $(".menu-departamento input[type='checkbox']");

    filterCheckboxes.vtexSmartResearch(smartResearchOptions);
  }

  $(document).ready(function () {
    search();
    getNumberOfProducts();
    SeoText();
    orderController();
    filterController();
    seeMoreFilterColor();
    richSnippetBreadcrumbs();
    smartResearch();
    clearFilters();
  });

  function AddProductShelfMain() {
    $(".prateleira:first-child > ul").append(
      $(".prateleira ~ .prateleira > ul").html()
    );
    $(".prateleira ~ .prateleira").remove();
  }

  function removeProductOutOfStock() {
    const productsOutOfStock = document.querySelectorAll(
      "li:not(.is--hide) .x-product.outStock"
    );
    [...productsOutOfStock].forEach((product) => {
      product.parentElement.remove();
      // product.parentElement.classList.add("is--hide");
    });
  }

  $(document).ajaxComplete(function () {
    AddProductShelfMain();
    removeProductOutOfStock();
    addBannerGrid();
  });

  function addBannerGrid() {
    var cardsCatalog = document
      .querySelector(".mf-cards-catalog")
      .querySelectorAll("noscript");

    cardsCatalog.forEach((card) => {
      const { categoryId } = vtxctx;
      const contentCard = card.innerHTML;
      const patternGetPosition =
        /(position\=\"(?<position>[A-Za-z0-9 _]*)\")(?:\s+category\=\"(?<category>[A-Za-z0-9 _]*)\")?/;
      const {
        groups: { position, category },
      } = contentCard.match(patternGetPosition);

      const categoryIsNotTheSameAsAttr = +categoryId !== +category;
      const $body = document.body;
      const isNotCollection = !(
        $body.classList.contains("search-result") ||
        $body.classList.contains("Novidades")
      );

      if (category) {
        if (categoryIsNotTheSameAsAttr) return;
      } else if (isNotCollection) {
        return;
      }

      document.addEventListener("mf-helperComplement", function (e) {
        const cardHasAlreadyAdded = !!document.querySelector(
          `.mf-card__block[position="${+position}"`
        );
        if (cardHasAlreadyAdded) return;

        const lenghtProducts = document.querySelectorAll(
          `.prateleira[id^="ResultItems"] > div > ul > li[class^="loja-maria-filo"]`
        ).length;
        const thereIsNoProduct = position > lenghtProducts;
        if (thereIsNoProduct) return;

        const targetSibling = document.querySelector(
          `.prateleira[id^="ResultItems"] > div > ul > li[class^="loja-maria-filo-"]:nth-of-type(${+position}):not(.is--hide):not(.helperComplement)`
        );
        if (!targetSibling) return;
        targetSibling.insertAdjacentHTML("beforebegin", contentCard);
      });
    });
  }

  function orderController() {
    const $overlay = document.querySelector(".mf-category__overlay");
    const $openOrderBy = document.querySelector(".js--open-ordering");
    const $containerOrderBy = document.querySelector(".dropdown");
    const $itemsOrderBy = document.querySelectorAll(".js--orderby a");

    function activeOrderBy() {
      $containerOrderBy.classList.toggle("is--active");
      $overlay.classList.toggle("is--active");

      window.addEventListener("click", windowDisableOrderBy, false);
    }

    function disableOrderBy() {
      $containerOrderBy.classList.remove("is--active");
      $overlay.classList.remove("is--active");
      window.removeEventListener("click", windowDisableOrderBy, false);
    }

    function windowDisableOrderBy(event) {
      if (!event.target.matches(".dropbtn")) {
        disableOrderBy();
      }
    }

    document.addEventListener("mf-orderby-open", function (e) {
      activeOrderBy();
    });

    $openOrderBy.onclick = function (ev) {
      ev.preventDefault();
      const orderByActive = $containerOrderBy.classList.contains("is--active");

      if (orderByActive) {
        disableOrderBy();
        return;
      }

      const event = new CustomEvent("mf-orderby-open");
      document.dispatchEvent(event);
    };

    function removeOrderByActive() {
      $itemsOrderBy.forEach((item) =>
        item.parentElement.classList.remove("is--active")
      );
    }

    $itemsOrderBy.forEach((item) => {
      item.onclick = function (ev) {
        removeOrderByActive();
        item.parentElement.classList.add("is--active");
      };
    });

    const orderByInUrl = window.location.search;

    const listOrdering = [
      "OrderByReleaseDateDESC",
      "OrderByTopSaleDESC",
      "OrderByPriceDESC",
      "OrderByPriceASC",
      "OrderByBestDiscountDESC",
      "OrderByScoreDESC",
      "OrderByReviewRateDESC",
    ];

    listOrdering.forEach((search) => {
      if (orderByInUrl.includes(search)) {
        const $itemOrderBy = document.querySelector(
          `.js--orderby[data-value=${search}]`
        );
        const $clearOrderBy = document.querySelector(
          ".dropdown-content .mf-clear__button"
        );

        !!$itemOrderBy &&
          ($itemOrderBy.classList.add("is--active"),
          $clearOrderBy.classList.remove("is--hide"));
      }
    });
  }

  function filterController() {
    const $overlay = document.querySelector(".mf-category__overlay");
    const $containerOpenFilters = document.querySelector(
      ".mf-category__filters"
    );
    const $openFilters = document.querySelector(".js--open-filters");
    const $sidebarFilters = document.querySelector(".mf-sidebar-filters");
    const $containerCategoryTop = document.querySelector(".mf-category__top");
    const $clearFiltersButton = document.querySelector(".js--clear-filters");

    function activeAfterBlockWhiteAfterScroll() {
      $containerOpenFilters.classList.add("in--scrolling");
    }

    function activeFilters() {
      $containerCategoryTop.classList.add("in--sticky");
      $overlay.classList.add("is--active");
      $sidebarFilters.classList.add("is--active");
      $containerOpenFilters.classList.add("is--active");
      window.addEventListener(
        "click",
        disablingWithAnyClickOutsideFilters,
        false
      );
      $sidebarFilters.addEventListener(
        "scroll",
        activeAfterBlockWhiteAfterScroll,
        false
      );
    }

    function disableFilters() {
      $overlay.classList.remove("is--active");
      $sidebarFilters.classList.remove("is--active");
      $containerOpenFilters.classList.remove("is--active");
      $containerOpenFilters.classList.remove("in--scrolling");
      window.removeEventListener(
        "click",
        disablingWithAnyClickOutsideFilters,
        false
      );
      $sidebarFilters.removeEventListener(
        "scroll",
        activeAfterBlockWhiteAfterScroll,
        false
      );
      $sidebarFilters.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    function disablingWithAnyClickOutsideFilters(event) {
      const clickOutside =
        !event.target.matches(".js--open-filters") &&
        !event.target.closest(".mf-sidebar-filters");

      if (clickOutside) {
        disableFilters();
      }
    }

    document.addEventListener("mf-filters-open", function (e) {
      activeFilters();
    });

    $openFilters.onclick = function (ev) {
      ev.preventDefault();
      const filtersActive =
        $containerOpenFilters.classList.contains("is--active");

      if (filtersActive) {
        disableFilters();
        return;
      }

      const event = new CustomEvent("mf-filters-open");
      document.dispatchEvent(event);
    };
    $clearFiltersButton.onclick = function (ev) {
      disableFilters();
    };
  }

  function seeMoreFilterColor() {
    waitForElement(".filtro_cor", function () {
      $(".filtro_cor").append(
        '<button id="filtro_cor_mais" class="filtro_cor_mais">Ver +</button>'
      );
      $(".filtro_cor").append(
        '<button id="filtro_cor_menos" class="filtro_cor_menos">Ver -</button>'
      );

      document.getElementById("filtro_cor_mais").onclick = function () {
        $("body.catalog .x-category__filter .filtro_cor div").addClass(
          "filtroVermaisTudo"
        );
        $(
          "body.catalog .x-category__filter .filtro_cor .filtro_cor_mais"
        ).addClass("filtroVermaisOff");
        $(
          "body.catalog .x-category__filter .filtro_cor .filtro_cor_menos"
        ).addClass("filtroVermaisOn");
      };
      document.getElementById("filtro_cor_menos").onclick = function () {
        $("body.catalog .x-category__filter .filtro_cor div").removeClass(
          "filtroVermaisTudo"
        );
        $(
          "body.catalog .x-category__filter .filtro_cor .filtro_cor_mais"
        ).removeClass("filtroVermaisOff");
        $(
          "body.catalog .x-category__filter .filtro_cor .filtro_cor_menos"
        ).removeClass("filtroVermaisOn");
      };
    });
  }

  function clearFilters() {
    const $clearFiltersButton = document.querySelector(".js--clear-filters");

    function activeClearFilters() {
      $clearFiltersButton.classList.remove("is--hide");
    }

    function removeClearFilters() {
      $clearFiltersButton.classList.add("is--hide");
    }

    $(document).ajaxComplete(function () {
      const filtersSelected = !!document.querySelectorAll(
        ".search-multiple-navigator label.sr_selected"
      ).length;

      filtersSelected ? activeClearFilters() : removeClearFilters();
    });

    $clearFiltersButton.onclick = function () {
      $(".search-multiple-navigator input:checked")
        .attr("checked", false)
        .change();
    };
  }
}
