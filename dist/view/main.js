import View from '../core/view.js';
import el from '../util/dom.js';
import { Route } from '../types.js';
export default class Main extends View {
    static #template = /* html */ `
    <fragment>
      <h1>🥤 자판기 미션</h1>
      <div id="gnb" class="margin-auto">
        <button data-route-target="${Route.productInventory}">상품 관리</button>
        <button data-route-target="${Route.machineCharge}">잔돈 충전</button>
        <button data-route-target="${Route.userPurchase}">상품 구매</button>
      </div>
      <div id="page"></div>
    </fragment>
  `;
    static #components = {
        [Route.productInventory]: '<product-inventory></product-inventory>',
        [Route.machineCharge]: '<machine-charge></machine-charge>',
        [Route.userPurchase]: '<user-purchase></user-purchase>',
    };
    $gnb;
    $buttons;
    $page;
    constructor() {
        super();
        const $content = el(Main.#template);
        this.$gnb = $content.querySelector('#gnb');
        this.$page = $content.querySelector('#page');
        this.$buttons = Array.from(this.$gnb.querySelectorAll('button'));
        this.$gnb.addEventListener('click', this.routeChange);
        this.render($content);
    }
    watch = ({ route }) => ({ route });
    onStoreUpdated({ route }) {
        el(this.$page, [Main.#components[route]]);
        this.$buttons.forEach($btn => {
            $btn.classList.toggle('current', $btn.dataset.routeTarget === route);
        });
    }
    routeChange = (e) => {
        const $tg = e.target;
        if ($tg?.localName !== 'button')
            return;
        this.dispatch('route_change', { route: $tg.dataset.routeTarget || '' });
    };
}
customElements.define('vending-machine-app', Main);
//# sourceMappingURL=main.js.map