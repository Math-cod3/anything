import { setCookie, getCookie, deleteCookie } from './cookies';
import { getProfile } from './components/profile';
import { objectPath, isLocalhost } from './components/utils';

const urlPrefix = `${isLocalhost ? 'https://mariafilo.vtexcommercestable.com.br' : ''}/api/dataentities`;
const $body = $('body');
const isInSortitionPage = $body.hasClass('js-sortition-page');
const textContents = {
  readyToSort: {
    title: 'Humm...a surpresa é boa. E vai para a sua bolsa!',
    subtitle: 'Clica no botão abaixo pra sortear seu mimo.',
    callToAction: 'Veja a surpresa',
    link: 'javascript:;',
  },
  notLogged: {
    title: 'Humm...a surpresa é boa. E vai para a sua bolsa!',
    subtitle: 'Faça o seu login para vê-la.',
    callToAction: 'Veja a surpresa',
    link: 'javascript:;',
  },
  cannotSort: {
    title: 'Parece que você já ganhou um mimo hoje!',
    subtitle: 'Volte amanhã e confira outras surpresas.',
    callToAction: 'Veja novidades',
    link: '/Loja/Roupas?O=OrderByScoreDESC',
  },
  error: {
    title: 'Hmm. Parece que estamos com problemas no momento.',
    subtitle: 'Volte mais tarde e tente de novo!',
    callToAction: 'Veja novidades',
    link: '/Loja/Roupas?O=OrderByScoreDESC',
  },
  afterSort: {
    callToAction: 'Comprar',
    link: '/Loja/Roupas?O=OrderByScoreDESC',
  },
};

export default (function () {
  class AwardedBackpack {
    constructor() {
      try {
        this.endPoint = 'https://mochilapremiada.somalabs.com.br';
        this.isInSortitionPage = isInSortitionPage;
        this.doNotShowModal = isInSortitionPage || $body.hasClass('js-hide-backpack-modal');
        this.regularCookieExpirationTime = this.getRegularCookieExpirationTime();
        this.dailyCookieExpirationTime = this.getDailyCookieExpirationTime();
        this.cookieNames = {
          promo: 'MariaFiloAwardedBackpackPromo',
          active: 'MariaFiloAwardedBackpackActive',
          modal: 'MariaFiloAwardedBackpackClosedModal',
        };
        this.cluster = $('.js-awarded-backpack-cluster').text().trim();
        this.isClustered = !!this.cluster;
        this.participationCookie = JSON.parse(decodeURIComponent(getCookie(this.cookieNames.promo) || '{}'));
        this.participationCookie = this.participationCookie ? (Object.keys(this.participationCookie).length ? this.participationCookie : null) : null;
        this.closedModalToday = getCookie(this.cookieNames.modal);
        this.bindEvents();

        if ($('.js-custom-element-mochila-active').text() === 'true') {
          if ($('.js-custom-element-mochila-homolog').text() === 'true' && !~window.location.host.indexOf('homologmariafilo')) return;

          getProfile()
          .then((profile) => {
            if(profile.IsUserDefined){
              this._preInit();
            }
            else{
              this.setSortitionPageContent('notLogged');
              $(".js-awarded-backpack-button").attr("onclick","vtexid.start()")
            }
          });

        }
      } catch (error) {
        console.error(error);
      }
    }

    getRegularCookieExpirationTime() {
      try {
        const expiration = new Date();
        expiration.setHours(new Date().getHours() + 1);
        return expiration.toUTCString();
      } catch (error) {
        console.error(error);
      }
    }

    getDailyCookieExpirationTime() {
      try {
        const expiration = new Date();
        expiration.setHours(23);
        expiration.setMinutes(59);
        expiration.setSeconds(59);
        return expiration.toUTCString();
      } catch (error) {
        console.error(error);
      }
    }

    getDateTwelveHoursAhead(date) {
      try {
        date = date ? new Date(date) : new Date();
        date.setHours(date.getHours() + 12);
        return date.toUTCString();
      } catch (error) {
        console.error(error);
      }
    }

    getDateTomorrowAtSameTime(date) {
      try {
        date = date ? new Date(date) : new Date();
        date.setHours(date.getHours() + 24);
        return date.toUTCString();
      } catch (error) {
        console.error(error);
      }
    }

    setSortitionPageContent(scope = 'readyToSort', sortedContent = null) {
      try {

        $('.js-awarded-backpack-button').html(textContents[scope].callToAction).attr('href', textContents[scope].link);

        if (scope === 'readyToSort') $('.js-awarded-backpack-button').addClass('js-awarded-backpack-sort');
        else $('.js-awarded-backpack-button').removeClass('js-awarded-backpack-sort');

        if (sortedContent) {
          $('.js-awarded-backpack-title').html(sortedContent.title);
          $('.js-awarded-backpack-subtitle').html(sortedContent.subtitle);
          $('.awarded-backpack__promo-flag-text').html(sortedContent.flag.replace(/\s/g, '<br/>'));
          $('.awarded-backpack__backpack-icon').addClass('is-active');
        } else {
          $('.js-awarded-backpack-title').html(textContents[scope].title);
          $('.js-awarded-backpack-subtitle').html(textContents[scope].subtitle);
        }
      } catch (error) {
        console.error(error);
      }
    }

    _preInit() {
      try {
        const activeCookie = getCookie(this.cookieNames.active);

        if (activeCookie) {
          if (JSON.parse(activeCookie)) {
            this.isActive = true;
            if (this.isInSortitionPage) this.checkIfUserCanParticipate();
            else this.showModal(true);
          } else {
            this.isActive = false;
            if (this.isInSortitionPage) window.location.assign('/');
          }
        } else {
          this.checkIfPromoIsActive();
        }
      } catch (error) {
        console.error(error);
      }
    }

    updateMdBackpack(data) {
      fetch(`${urlPrefix}/CL/documents`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/vnd.vtex.masterdata.v10+json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) throw Error;
        })
        .catch(console.error);
    }

    parseUserSortitionDate(timestamp) {
      try {
        return timestamp ? Date.parse(timestamp.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$2/$3/$1 $4:$5:$6')) : null;
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    showModal(lazy = false) {
      try {
        if (!this.doNotShowModal && !this.closedModalToday) {
          if (lazy) {
            setTimeout(() => {
              $('.js-modal[data-modal="awarded-backpack"]').fadeIn(300);
            }, 2000);
          } else {
            $('.js-modal[data-modal="awarded-backpack"]').fadeIn(300);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    checkIfPromoIsActive() {
      try {
        fetch(`${this.endPoint}?checkstatus`)
          .then((response) => {
            if (response.ok) return response.json();
            throw new Error('Response não tá ok');
          })
          .then((data) => {
            if (data.status_code === '200' && data.activate) {
              this.isActive = true;
              setCookie(this.cookieNames.active, 1, null, this.regularCookieExpirationTime);
              this.showModal();
              if (this.isInSortitionPage) {
                this.checkIfUserCanParticipate();
              }
              return true;
            } else {
              throw new Error('Não deu status 200');
            }
          })
          .catch((error) => {
            console.error(error);
            this.isActive = false;
            setCookie(this.cookieNames.active, 0, null, this.regularCookieExpirationTime);
            if (this.isInSortitionPage) window.location = '/';
          });
      } catch (error) {
        console.error(error);
      }
    }

    checkIfMustDeactivatePromo(obj) {
      try {
        const TWELVE_HOURS = 1000 * 60 * 60 * 12;
        if (new Date().getTime() > new Date(obj.date).getTime() + TWELVE_HOURS) {
          if (window.rex.notifications) window.rex.notifications.setPromoNotification(null);
          this.deactivatePromo(obj.userId);
        }
      } catch (error) {
        console.error(error);
      }
    }

    deactivatePromo(id) {
      try {
        fetch(`${this.endPoint}/get.php`, {
          method: 'POST',
          body: { id, sendData: 0 },
        })
          .then((response) => {
            if (response.ok) return response.text();
            throw Error;
          })
          .then(() => {
            const data = {
              email: window.rex.profile.Email,
              promocaoMochila: null,
              mochilaPremiada: null,
            };

            this.updateMdBackpack(data);

            deleteCookie(this.cookieNames.promo);
          })
          .catch(console.error);
      } catch (error) {
        console.error(error);
      }
    }

    checkIfUserCanParticipate() {
      try {
        let { participationCookie } = this;
        participationCookie = typeof participationCookie === 'string' ? JSON.parse(decodeURIComponent(participationCookie)) : participationCookie;

        if (!!participationCookie) {
          const parsedDate = this.parseUserSortitionDate(participationCookie.date);
          let endDate = new Date(this.getDateTomorrowAtSameTime(parsedDate));

          if (new Date() > endDate.getTime()) {
            this.isAllowedToParticipate = true;
            if (window.rex.notifications) window.rex.notifications.setPromoNotification(null);
            this.setSortitionPageContent();
          } else {
            this.checkIfMustDeactivatePromo({ date: parsedDate, userId: participationCookie.id });
            if (window.rex.notifications) window.rex.notifications.setPromoNotification(participationCookie.notification);
            this.setSortitionPageContent('cannotSort');
          }
        } else {
          const { endpoint } = window.rex;
          fetch(`${endpoint}/api/checkout/pub/orderForm/`, { credentials: 'same-origin' })
            .then((response) => {
              if (response.ok) return response.json();
              throw Error();
            })
            .then((oF) => {
              this.orderForm = oF;
              this.userData = this.userData || {};
              this.userData.email = objectPath(oF, 'clientProfileData.email');

              return fetch(`${urlPrefix}/CL/documents?_schema=v1`, {
                method: 'PATCH',
                body: JSON.stringify({ email: this.userData.email }),
                headers: {
                  Accept: 'application/vnd.vtex.masterdata.v10+json',
                  'Content-Type': 'application/json',
                },
              });
            })
            .then((res) => {
              if (res.ok) return res.json();
              return new Promise((resolve) => resolve({}));
            })
            .then((data) => {
              if (data.DocumentId) {
                this.userData.documentId = data.DocumentId;
                return fetch(`${urlPrefix}/CL/documents/${data.DocumentId}?_fields=id,mochilaPremiada&_schema=v1`);
              }
              return fetch(`${urlPrefix}/CL/search/?_fields=id,mochilaPremiada&email=${this.userData.email}&_schema=v1`);
            })
            .then((res) => {
              if (res.ok) return res.json();
              throw Error();
            })
            .then((data) => {
              if (($.isArray(data) && data.length) || data.id) {
                data = $.isArray(data) ? data[0] : data;
                this.userData = {
                  documentId: data.id,
                  userProfileId: this.orderForm.userProfileId,
                };
                delete this.orderForm;
                if (data.mochilaPremiada) {
                  /**
                   * Timestamp example: 20180806110449
                   * Where:
                   *        2018  - year
                   *        08    - month
                   *        06    - day
                   *        11    - hours
                   *        04    - minutes
                   *        49    - seconds
                   * After the regex it turns to: 08/06/2018 11:04:49
                   */
                  let endDate = new Date(this.getDateTomorrowAtSameTime(this.parseUserSortitionDate(data.mochilaPremiada.date)));
                  if (Date.parse(new Date()) > endDate.getTime()) {
                    this.isAllowedToParticipate = true;
                    if (window.rex.notifications) window.rex.notifications.setPromoNotification(null);
                    this.setSortitionPageContent();
                    this.participationCookie = null;
                    deleteCookie(this.cookieNames.promo);
                  } else {
                    this.isAllowedToParticipate = false;
                    this.setSortitionPageContent('cannotSort');
                    setCookie(this.cookieNames.promo, encodeURIComponent(JSON.stringify(data.mochilaPremiada)), null, this.regularCookieExpirationTime);
                  }
                } else {
                  this.isAllowedToParticipate = true;
                  if (window.rex.notifications) window.rex.notifications.setPromoNotification(null);
                  this.setSortitionPageContent();
                  this.participationCookie = null;
                  deleteCookie(this.cookieNames.promo);
                }
              } else {
                throw new Error('>>> Este ID não está registrado na entidade de Clientes.');
              }
            })
            .catch(() => {
              if (window.rex.notifications) window.rex.notifications.setPromoNotification(null);
              this.setSortitionPageContent('error');
              setCookie(this.cookieNames.promo, null, null, this.regularCookieExpirationTime);
            });
        }
      } catch (error) {
        console.error(error);
      }
    }

    formatDateToMiddleware(date) {
      date = date ? new Date(date) : new Date();
      let year = date.getFullYear().toString();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();
      let hours = date.getHours().toString();
      let minutes = date.getMinutes().toString();
      let seconds = date.getSeconds().toString();
      month = month.length > 1 ? month : `0${month}`;
      day = day.length > 1 ? day : `0${day}`;
      hours = hours.length > 1 ? hours : `0${hours}`;
      minutes = minutes.length > 1 ? minutes : `0${minutes}`;
      seconds = seconds.length > 1 ? seconds : `0${seconds}`;
      return year + month + day + hours + minutes + seconds;
    }

    updateAwardedBackpack(obj, idpromo) {
      const email = { email: window.rex.profile.Email };
      const fields = {
        promocaoMochila: idpromo,
        mochilaPremiada: obj,
      };
      const data = $.extend(email, fields);

      this.updateMdBackpack(data);
    }

    makeSortition() {
      try {
        const { endPoint, userData, cookieNames, setSortitionPageContent, getDateTwelveHoursAhead } = this;
        fetch(endPoint, { credentials: 'same-origin' })
          .then((res) => res.json())
          .then((data) => {
            const { teaser, description, idCalculatorConfiguration, notification, icon } = data;
            const sortitionObj = {
              id: userData.documentId,
              name: description,
              teaser: teaser,
              notification: notification || teaser,
              date: this.formatDateToMiddleware(new Date()),
              promoId: idCalculatorConfiguration,
              sendData: true,
            };
            if (window.rex.notifications) window.rex.notifications.setPromoNotification(notification || teaser);
            $(".awarded-backpack__backpack-icon").addClass("opened");
            $(".js-awarded-backpack-alert").addClass("active");
            setSortitionPageContent('afterSort', { title: teaser, subtitle: 'Corra e aproveite! Esse benefício fica em sua bolsa por 1 hora <3', flag: icon });
            setCookie(cookieNames.promo, encodeURIComponent(JSON.stringify(sortitionObj)), null, getDateTwelveHoursAhead());

            //update md CL
            this.updateAwardedBackpack(sortitionObj, idCalculatorConfiguration);

            /**
             * Fetch API isn't working in this very case
             * (and I don't know why)
             */
            $.ajax({
              type: 'POST',
              data: sortitionObj,
              url: `${endPoint}/get.php`,
              async: true,
              error: function (error) {
                console.error(error);
                setSortitionPageContent('error');
              },
            });
          })
          .catch((error) => {
            console.error(error);
            setSortitionPageContent('error');
          });
      } catch (error) {
        console.error(error);
      }
    }

    bindEvents() {
      try {
        $body.on('click', '.js-awarded-backpack-close', () => {
          setCookie(this.cookieNames.modal, 1, null, this.dailyCookieExpirationTime);
        });

        $body.on('click', '.js-awarded-backpack-sort', (e) => {
          e.preventDefault();
          $(e.currentTarget).text('sorteando...');
          this.makeSortition();
        });

        $(window).on('orderFormUpdated.vtex', (e, o) => {
          if (o.loggedIn) {
            fetch(`${urlPrefix}/CL/search?_fields=mochilaPremiada&userId=${o.userProfileId}&_schema=v1`)
              .then((r) => r.json())
              .then((data) => {
                if (data && data.length) {
                  data = data[0];
                  setCookie(this.cookieNames.promo, data.mochilaPremiada ? encodeURIComponent(JSON.stringify(data.mochilaPremiada)) : null, null, this.dailyCookieExpirationTime);
                  setTimeout(() => $(window).trigger('rex.module.notification.set', [data.mochilaPremiada ? data.mochilaPremiada : null]), 600);
                }
              })
              .catch(console.error);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  $(() => {
    window.rex.awardedBackpack = new AwardedBackpack();
  });

})();
