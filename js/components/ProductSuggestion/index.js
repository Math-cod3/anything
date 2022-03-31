import Component from '../Component';
import { formatMoney } from '../../utils/utils';
import { emit } from '../../events';
import { quickShop} from '../../quickshop';


class ProductSuggestion extends Component {
  constructor(element, productData) {

    const imageAspectRatio = 1.45;
    super(element);
    this.productData = productData;
    this.title = productData.productName;
    this.url = productData.link;
    this.images = productData.items[0].images;
    this.listPrice = productData.items[0].sellers[0].commertialOffer.ListPrice;
    this.price = productData.items[0].sellers[0].commertialOffer.Price;
    this.parcel = productData.items[0].sellers[0].commertialOffer.Installments[9].Value;
    this.imageWidth = 100;
    this.imageHeight = this.imageWidth * imageAspectRatio;
    // this.productId = productId
  }

  run() {
    this.render();
    this.addEventListeners();
    this.listPriceExist();
    this.bind();
  }

  render() {
    const imageUrls = this.computeImageUrls();
   // <p class="parcel">10x de R$ ${formatMoney(this.parcel / 100)}</p>
    const html = `
      <a href=${this.url} class="image">
        <img src=${imageUrls[0]} alt="produto sugerido"/>
      </a>
      <div class="description">
        <a href=${this.url} class="title">
          <p>${this.title}</p>
        </a>
        <p class="price"><span class="listPrice">R$ ${formatMoney(this.listPrice / 1)}</span>R$ ${formatMoney(this.price / 1)}</p>
        <p class="parcel">10x de R$ ${formatMoney(this.parcel / 1)}</p>
        <a href="#" class="linkCTA">Compre agora</a>
      </div>
      <div class="closeDiv">
        <button type="button" class="close" aria-label="Fechar sugestão de produto">&times;</button>
      </div>
    `;
    this.element.innerHTML = html;
  }
  bind(){
    const linkCta = document.querySelector(".linkCTA");
    console.log(this.productData);
    linkCta.addEventListener('click', (e)=>{
      e.preventDefault();
      quickShop(this.productData);
    })
  }

  computeImageUrls() {
    return this.images.map(
      (image) =>
        `https://mariafilo.vteximg.com.br/arquivos/ids/${image.imageId}-${this.imageWidth}-${this.imageHeight}/${image.imageText}`
    );
  }

  addEventListeners() {
    this.element.querySelector('.close').addEventListener('click', () => {
      emit(window, 'closeProductSuggestion');
    });
  }

  listPriceExist() {
    if (this.listPrice > 0) {
      $('.listPrice').show()
    }
  }
}

export default ProductSuggestion;
