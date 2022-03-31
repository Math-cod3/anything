const $body = document.body;
const $breadcrumbContainer = document.querySelector(".mf-breadcrumb");
const $breadcrumbWrapper =
  !!$breadcrumbContainer && $breadcrumbContainer.querySelector(".bread-crumb ul");
let $breadcrumbItems =
  !!$breadcrumbWrapper && $breadcrumbWrapper.querySelectorAll("li");

const Methods = {
  init() {
    Methods.changeDefaultTextToHome();
    Methods.removeDefaultItem();
    $breadcrumbContainer.classList.remove("is--hide");
  },
  changeDefaultTextToHome() {
    const sentencesToChange = ["homolog-mariafilo", "Maria Filo"];

    [...$breadcrumbItems].forEach((item) => {
      const link = item.querySelector("a");
      const spanItemName = link.querySelector('[itemprop="name"]');

      if (sentencesToChange.includes(link.title)) {
        link.innerHTML = "Home";
      } else if(!!spanItemName){
        if (sentencesToChange.includes(spanItemName.textContent)) {
          spanItemName.innerHTML = "Home";
        }
      }
    });
  },
  removeDefaultItem() {
    const sentencesToRemove = ["Loja"];
    const breadcrumbItemsLength = [...$breadcrumbItems].length;
    let itemsProcessed = 0;

    [...$breadcrumbItems].forEach((item) => {
      itemsProcessed++;
      const link = item.querySelector("a");
      const spanItemName = link.querySelector('[itemprop="name"]');

      if (sentencesToRemove.includes(link.title)) {
        item.remove();  
      } else if(!!spanItemName){
        if (sentencesToRemove.includes(spanItemName.textContent)) {
          item.remove();  
        }
      }

      if(itemsProcessed === breadcrumbItemsLength) {
        $breadcrumbItems = !!$breadcrumbWrapper && $breadcrumbWrapper.querySelectorAll("li");
        if ($body.classList.contains("catalog")) {
          Methods.addProductsNumber();
        }
      }
    });
  },
  addProductsNumber() {
    const resultadoNumeroContainer = document.querySelector('.resultado-busca-numero');
    const resultadoNumero = resultadoNumeroContainer.querySelector('[class="value"]').textContent;

    const lastBreadcrumbItem = $breadcrumbItems[$breadcrumbItems.length - 1];

    if (!!$breadcrumbWrapper.querySelector(".mf-countProducts")) {
      $breadcrumbWrapper.querySelector(
        ".mf-countProducts"
      ).innerText = `(${resultadoNumero} produtos)`;
      return;
    }

    const productsCountHtml = `
				<li class="mf-countProducts">
					(${resultadoNumero} produtos)
				</li>
			`;
    lastBreadcrumbItem.insertAdjacentHTML("afterend", productsCountHtml);
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const initThisPage =
    $body.classList.contains("catalog") ||
    $body.classList.contains("produto2021") ;
  if (initThisPage) {
    Methods.init();
  }
});
