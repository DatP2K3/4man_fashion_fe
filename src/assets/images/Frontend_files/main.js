import { injectQuery as __vite__injectQuery } from "/@vite/client";import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/main.js");var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/main.ts
import { bootstrapApplication } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_platform-browser.js?v=817d403b";

// src/app/app.config.ts
import { provideZoneChangeDetection, APP_INITIALIZER } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_core.js?v=817d403b";
import { provideRouter } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_router.js?v=817d403b";
import { provideAnimationsAsync } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_platform-browser_animations_async.js?v=817d403b";
import { providePrimeNG as providePrimeNG2 } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/primeng_config.js?v=817d403b";
import { KeycloakBearerInterceptor, KeycloakService as KeycloakService2 } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/keycloak-angular.js?v=817d403b";
import Aura2 from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@primeng_themes_aura.js?v=817d403b";
import { HTTP_INTERCEPTORS } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_common_http.js?v=817d403b";

// src/app/features/login/login.component.ts
import { Component } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_core.js?v=817d403b";
import * as i0 from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_core.js?v=817d403b";
var LoginComponent = class _LoginComponent {
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ i0.\u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], decls: 2, vars: 0, template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      i0.\u0275\u0275elementStart(0, "p");
      i0.\u0275\u0275text(1, "login works!");
      i0.\u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i0.\u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/features/login/login.component.ts", lineNumber: 9 });
})();
(() => {
  const id = "src%2Fapp%2Ffeatures%2Flogin%2Flogin.component.ts%40LoginComponent";
  function LoginComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(new URL("./@ng/component?c=" + id + "&t=" + encodeURIComponent(t), import.meta.url).href, 'import')
    ).then((m) => m.default && i0.\u0275\u0275replaceMetadata(LoginComponent, m.default, [i0], [], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && LoginComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && LoginComponent_HmrLoad(d.timestamp)));
})();

// src/app/pages/home/home.component.ts
import { Component as Component4 } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_core.js?v=817d403b";

// src/app/shared/shared.config.ts
import { provideHttpClient } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_common_http.js?v=817d403b";
import { provideAnimations } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_platform-browser_animations.js?v=817d403b";
import { providePrimeNG } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/primeng_config.js?v=817d403b";
import Aura from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@primeng_themes_aura.js?v=817d403b";

// src/app/shared/components/header/header.component.ts
var header_component_exports = {};
__export(header_component_exports, {
  HeaderComponent: () => HeaderComponent
});
import { Component as Component2 } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_core.js?v=817d403b";

// src/app/core/models/User.ts
var User = class {
  id;
  username;
  email;
  role;
  authStatus;
  constructor(id, username, email, role, authStatus) {
    this.role = role || [];
    this.authStatus = authStatus || "";
    this.id = id || "";
    this.username = username || "";
    this.email = email || "";
  }
};

// src/app/shared/components/header/header.component.ts
import { NgIf } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_common.js?v=817d403b";
import { RouterModule } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_router.js?v=817d403b";
import { ButtonModule } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/primeng_button.js?v=817d403b";
import { DrawerModule } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/primeng_drawer.js?v=817d403b";
import { ProgressBar } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/primeng_progressbar.js?v=817d403b";
import { DividerModule } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/primeng_divider.js?v=817d403b";
import * as i02 from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_core.js?v=817d403b";
import * as i1 from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/keycloak-angular.js?v=817d403b";
import * as i2 from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_router.js?v=817d403b";
import * as i3 from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/primeng_button.js?v=817d403b";
import * as i4 from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/primeng_api.js?v=817d403b";
import * as i5 from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/primeng_drawer.js?v=817d403b";
import * as i6 from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/primeng_divider.js?v=817d403b";
var _c0 = () => ({ width: "350px" });
function HeaderComponent_li_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = i02.\u0275\u0275getCurrentView();
    i02.\u0275\u0275elementStart(0, "li", 16)(1, "a", 17);
    i02.\u0275\u0275listener("click", function HeaderComponent_li_23_Template_a_click_1_listener() {
      i02.\u0275\u0275restoreView(_r1);
      const ctx_r1 = i02.\u0275\u0275nextContext();
      return i02.\u0275\u0275resetView(ctx_r1.login());
    });
    i02.\u0275\u0275text(2, "\u0110\u0102NG NH\u1EACP");
    i02.\u0275\u0275elementEnd()();
  }
}
function HeaderComponent_li_24_Template(rf, ctx) {
  if (rf & 1) {
    i02.\u0275\u0275elementStart(0, "li", 18)(1, "a");
    i02.\u0275\u0275text(2, "\u0110\u0102NG K\xDD");
    i02.\u0275\u0275elementEnd()();
  }
}
function HeaderComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = i02.\u0275\u0275getCurrentView();
    i02.\u0275\u0275elementStart(0, "div", 19)(1, "i", 20);
    i02.\u0275\u0275listener("click", function HeaderComponent_div_25_Template_i_click_1_listener() {
      i02.\u0275\u0275restoreView(_r3);
      const ctx_r1 = i02.\u0275\u0275nextContext();
      return i02.\u0275\u0275resetView(ctx_r1.visible = true);
    });
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275element(2, "i", 21);
    i02.\u0275\u0275elementStart(3, "p-drawer", 22);
    i02.\u0275\u0275twoWayListener("visibleChange", function HeaderComponent_div_25_Template_p_drawer_visibleChange_3_listener($event) {
      i02.\u0275\u0275restoreView(_r3);
      const ctx_r1 = i02.\u0275\u0275nextContext();
      i02.\u0275\u0275twoWayBindingSet(ctx_r1.visible, $event) || (ctx_r1.visible = $event);
      return i02.\u0275\u0275resetView($event);
    });
    i02.\u0275\u0275elementStart(4, "div", 23)(5, "h2", 24);
    i02.\u0275\u0275text(6, "Hi, Phan \u0110\u1EA1t");
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275element(7, "p-divider");
    i02.\u0275\u0275elementStart(8, "div", 25)(9, "p");
    i02.\u0275\u0275text(10, " Chi ti\xEAu th\xEAm ");
    i02.\u0275\u0275elementStart(11, "strong", 26);
    i02.\u0275\u0275text(12, "500.000\u0111");
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275text(13, " \u0111\u1EC3 l\xEAn h\u1EA1ng ");
    i02.\u0275\u0275elementStart(14, "strong");
    i02.\u0275\u0275text(15, "B\u1EA0C");
    i02.\u0275\u0275elementEnd()();
    i02.\u0275\u0275element(16, "p-progressbar", 27);
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(17, "div", 28)(18, "p");
    i02.\u0275\u0275text(19, " Hi\u1EC7n t\u1EA1i b\u1EA1n c\xF3: ");
    i02.\u0275\u0275element(20, "br");
    i02.\u0275\u0275elementStart(21, "span", 29);
    i02.\u0275\u0275element(22, "i", 30);
    i02.\u0275\u0275elementStart(23, "strong", 31);
    i02.\u0275\u0275text(24, "0");
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275text(25, " 4Mancash");
    i02.\u0275\u0275elementEnd()();
    i02.\u0275\u0275elementStart(26, "button");
    i02.\u0275\u0275text(27, "V\u1EC1 4Man");
    i02.\u0275\u0275elementEnd()();
    i02.\u0275\u0275elementStart(28, "div", 32)(29, "P", 33);
    i02.\u0275\u0275text(30, "Gi\u1EDBi thi\u1EC7u b\u1EA1n b\xE8");
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(31, "p", 34);
    i02.\u0275\u0275text(32, " Nh\u1EADn ngay 10% gi\xE1 tr\u1ECB \u0111\u01A1n h\xE0ng \u0111\u1EA7u ti\xEAn c\u1EE7a b\u1EA1n b\xE8 \u0111\u01B0\u1EE3c quy \u0111\u1ED5i th\xE0nh 4ManCash ");
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(33, "div", 35)(34, "button", 36);
    i02.\u0275\u0275text(35, "Chia s\u1EBB");
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(36, "button", 37);
    i02.\u0275\u0275text(37, "T\xECm hi\u1EC3u th\xEAm");
    i02.\u0275\u0275elementEnd()()();
    i02.\u0275\u0275elementStart(38, "div", 38)(39, "div", 39);
    i02.\u0275\u0275element(40, "i", 40);
    i02.\u0275\u0275elementStart(41, "a", 41);
    i02.\u0275\u0275text(42, "L\u1ECBch s\u1EED \u0111\u01A1n h\xE0ng");
    i02.\u0275\u0275elementEnd()();
    i02.\u0275\u0275elementStart(43, "div", 39);
    i02.\u0275\u0275element(44, "i", 42);
    i02.\u0275\u0275elementStart(45, "a", 41);
    i02.\u0275\u0275text(46, "S\u1ED5 \u0111\u1ECBa ch\u1EC9");
    i02.\u0275\u0275elementEnd()();
    i02.\u0275\u0275elementStart(47, "div", 39);
    i02.\u0275\u0275element(48, "i", 43);
    i02.\u0275\u0275elementStart(49, "a", 44);
    i02.\u0275\u0275text(50, "C\xE0i \u0111\u1EB7t t\xE0i kho\u1EA3n");
    i02.\u0275\u0275elementEnd()();
    i02.\u0275\u0275elementStart(51, "div", 39);
    i02.\u0275\u0275element(52, "i", 45);
    i02.\u0275\u0275elementStart(53, "a", 46);
    i02.\u0275\u0275text(54, "FAQ & Ch\xEDnh s\xE1ch");
    i02.\u0275\u0275elementEnd()()();
    i02.\u0275\u0275elementStart(55, "div", 47);
    i02.\u0275\u0275element(56, "button", 48);
    i02.\u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = i02.\u0275\u0275nextContext();
    i02.\u0275\u0275advance(3);
    i02.\u0275\u0275styleMap(i02.\u0275\u0275pureFunction0(5, _c0));
    i02.\u0275\u0275twoWayProperty("visible", ctx_r1.visible);
    i02.\u0275\u0275property("baseZIndex", 1e4);
    i02.\u0275\u0275advance(13);
    i02.\u0275\u0275property("value", ctx_r1.percent);
  }
}
var HeaderComponent = class _HeaderComponent {
  keycloak;
  user = new User();
  visible = false;
  percent = 80;
  isLoggedIn = false;
  userProfile = null;
  constructor(keycloak) {
    this.keycloak = keycloak;
  }
  ngOnInit() {
    return __async(this, null, function* () {
      this.isLoggedIn = yield this.keycloak.isLoggedIn();
      if (this.isLoggedIn) {
        this.userProfile = yield this.keycloak.loadUserProfile();
        this.user.authStatus = "AUTH";
        window.sessionStorage.setItem("userdetails", JSON.stringify(this.user));
      }
    });
  }
  login() {
    this.keycloak.login();
  }
  logout() {
    let redirectURI = "http://localhost:4200/home";
    this.keycloak.logout(redirectURI);
  }
  static \u0275fac = function HeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HeaderComponent)(i02.\u0275\u0275directiveInject(i1.KeycloakService));
  };
  static \u0275cmp = /* @__PURE__ */ i02.\u0275\u0275defineComponent({ type: _HeaderComponent, selectors: [["app-header"]], decls: 26, vars: 3, consts: [[1, "header"], [1, "logo"], ["src", "/assets/images/logo.png", "alt", "4ManFashion", 1, "logo-image"], [1, "nav"], [1, "nav-list"], ["routerLink", "/home"], ["routerLink", "/phukien"], ["routerLink", "/about"], [1, "search"], ["type", "text", "placeholder", "T\xECm ki\u1EBFm s\u1EA3n ph\u1EA9m..."], [1, "pi", "pi-search"], [1, "auth-nav"], [1, "auth-nav-list"], ["class", "login-btn", 4, "ngIf"], ["class", "register-btn", 4, "ngIf"], ["class", "menu", 4, "ngIf"], [1, "login-btn"], [3, "click"], [1, "register-btn"], [1, "menu"], [1, "pi", "pi-user", 3, "click"], [1, "pi", "pi-shopping-cart"], ["position", "right", 3, "visibleChange", "visible", "baseZIndex"], [1, "profile-drawer"], [1, "title-drawer"], [1, "spending-info"], [1, "target-cash"], [3, "value"], [1, "man-club"], [1, "wallet"], [1, "pi", "pi-money-bill"], [1, "coin"], [1, "row", "section-invite"], [1, "title-invite"], [1, "invite-desc"], [1, "btn-invite-group"], [1, "share-btn"], [1, "more-btn"], [1, "row", "nav-manage"], [1, "col-6", "nav-manage-item"], [1, "pi", "pi-history"], ["routerLink", "/my-order"], [1, "pi", "pi-address-book"], [1, "pi", "pi-cog"], ["routerLink", "/my-setting"], [1, "pi", "pi-question-circle"], ["routerLink", "/address"], [1, "footer"], ["pButton", "", "label", "\u0110i \u0111\u1EBFn t\xE0i kho\u1EA3n", 1, "p-button-raised", "p-button-lg"]], template: function HeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      i02.\u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      i02.\u0275\u0275element(2, "img", 2);
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(3, "nav", 3)(4, "ul", 4)(5, "li")(6, "a", 5);
      i02.\u0275\u0275text(7, "TRANG CH\u1EE6");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(8, "li")(9, "a", 5);
      i02.\u0275\u0275text(10, "QU\u1EA6N");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(11, "li")(12, "a", 6);
      i02.\u0275\u0275text(13, "PH\u1EE4 KI\u1EC6N");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(14, "li")(15, "a", 7);
      i02.\u0275\u0275text(16, "GI\u1EDAI THI\u1EC6U");
      i02.\u0275\u0275elementEnd()()()();
      i02.\u0275\u0275elementStart(17, "div", 8);
      i02.\u0275\u0275element(18, "input", 9);
      i02.\u0275\u0275elementStart(19, "button");
      i02.\u0275\u0275element(20, "i", 10);
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(21, "nav", 11)(22, "ul", 12);
      i02.\u0275\u0275template(23, HeaderComponent_li_23_Template, 3, 0, "li", 13)(24, HeaderComponent_li_24_Template, 3, 0, "li", 14);
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275template(25, HeaderComponent_div_25_Template, 57, 6, "div", 15);
      i02.\u0275\u0275elementEnd();
    }
    if (rf & 2) {
      i02.\u0275\u0275advance(23);
      i02.\u0275\u0275property("ngIf", ctx.user.authStatus != "AUTH");
      i02.\u0275\u0275advance();
      i02.\u0275\u0275property("ngIf", ctx.user.authStatus != "AUTH");
      i02.\u0275\u0275advance();
      i02.\u0275\u0275property("ngIf", ctx.user.authStatus == "AUTH");
    }
  }, dependencies: [
    NgIf,
    RouterModule,
    i2.RouterOutlet,
    i2.RouterLink,
    i2.RouterLinkActive,
    i2.\u0275EmptyOutletComponent,
    ButtonModule,
    i3.ButtonDirective,
    i3.Button,
    i3.ButtonLabel,
    i3.ButtonIcon,
    i4.Header,
    i4.Footer,
    i4.PrimeTemplate,
    DrawerModule,
    i5.Drawer,
    ProgressBar,
    DividerModule,
    i6.Divider
  ], styles: ['@charset "UTF-8";\n\n\n\n.header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 10px 20px;\n  background: var(--background-color);\n  border-bottom: 2px solid var(--primary-color);\n}\n.header[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 139px;\n}\n.header[_ngcontent-%COMP%]   .nav[_ngcontent-%COMP%]   .nav-list[_ngcontent-%COMP%] {\n  display: flex;\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.header[_ngcontent-%COMP%]   .nav[_ngcontent-%COMP%]   .nav-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin: 0 39px;\n  font-size: 1.6rem;\n}\n.header[_ngcontent-%COMP%]   .nav[_ngcontent-%COMP%]   .nav-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover {\n  color: var(--primary-color);\n}\n.header[_ngcontent-%COMP%]   .nav[_ngcontent-%COMP%]   .nav-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  text-decoration: none;\n  color: inherit;\n}\n.header[_ngcontent-%COMP%]   .search[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  border: 2px solid var(--primary-color);\n  border-radius: 999px;\n  padding: 5px;\n  overflow: hidden;\n}\n.header[_ngcontent-%COMP%]   .search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 230px;\n  border: none;\n  outline: none;\n  padding: 5px;\n  font-size: 1.6rem;\n}\n.header[_ngcontent-%COMP%]   .search[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 6px 10px;\n  border-radius: 20px;\n  transition: background 0.3s ease, color 0.3s ease;\n}\n.header[_ngcontent-%COMP%]   .search[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  color: var(--primary-color);\n  transition: color 0.3s ease;\n}\n.header[_ngcontent-%COMP%]   .search[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  background: var(--primary-color);\n  color: var(--secondary-text-color);\n}\n.header[_ngcontent-%COMP%]   .search[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover   i[_ngcontent-%COMP%] {\n  color: white;\n}\n.header[_ngcontent-%COMP%]   .auth-nav[_ngcontent-%COMP%]   .auth-nav-list[_ngcontent-%COMP%] {\n  display: flex;\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.header[_ngcontent-%COMP%]   .auth-nav[_ngcontent-%COMP%]   .auth-nav-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-left: 20px;\n  font-size: 1.6rem;\n  padding: 8px 8px;\n  border-radius: 20px;\n  width: 123px;\n  text-align: center;\n  background-color: var(--primary-color);\n  color: var(--secondary-text-color);\n  cursor: pointer;\n}\n.header[_ngcontent-%COMP%]   .auth-nav[_ngcontent-%COMP%]   .auth-nav-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  text-decoration: none;\n  color: inherit;\n}\n.header[_ngcontent-%COMP%]   .auth-nav[_ngcontent-%COMP%]   .auth-nav-list[_ngcontent-%COMP%]   .login-btn[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--primary-color);\n  border: 2px solid var(--primary-color);\n}\n.header[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.header[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 20px;\n  margin-left: 20px;\n  cursor: pointer;\n}\n.header[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:hover {\n  color: var(--primary-color);\n}\n.header[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   .profile-icon[_ngcontent-%COMP%] {\n  font-size: 24px;\n  cursor: pointer;\n}\n.profile-drawer[_ngcontent-%COMP%] {\n  padding: 20px;\n}\n.profile-drawer[_ngcontent-%COMP%]   .title-drawer[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  text-align: center;\n}\n.profile-drawer[_ngcontent-%COMP%]   .spending-info[_ngcontent-%COMP%] {\n  background-color: var(--secondary-background-color);\n  font-weight: bold;\n  padding: 10px;\n  border-radius: 8px;\n  margin: 10px 0;\n}\n.profile-drawer[_ngcontent-%COMP%]   .spending-info[_ngcontent-%COMP%]   .target-cash[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  font-weight: bold;\n}\n.profile-drawer[_ngcontent-%COMP%]   .man-club[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  gap: 10px;\n  justify-content: space-between;\n}\n.profile-drawer[_ngcontent-%COMP%]   .man-club[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  background-color: var(--secondary-background-color);\n  height: 80px;\n  padding: 10px;\n  border-radius: 10px;\n  flex: 1;\n}\n.profile-drawer[_ngcontent-%COMP%]   .man-club[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   .wallet[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.profile-drawer[_ngcontent-%COMP%]   .man-club[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   .wallet[_ngcontent-%COMP%]   .coin[_ngcontent-%COMP%] {\n  margin: 0 6px;\n}\n.profile-drawer[_ngcontent-%COMP%]   .man-club[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  color: var(--primary-color);\n}\n.profile-drawer[_ngcontent-%COMP%]   .man-club[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  background-color: var(--third-background-color);\n  border-radius: 10px;\n  color: var(--secondary-text-color);\n  font-size: 1.8rem;\n  padding: 20px 10px;\n  height: 80px;\n  cursor: pointer;\n}\n.profile-drawer[_ngcontent-%COMP%]   .section-invite[_ngcontent-%COMP%] {\n  background-image: url(/assets/images/bg_invite_section.png);\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  padding: 15px;\n  border-radius: 8px;\n  text-align: center;\n  color: var(--secondary-text-color);\n}\n.profile-drawer[_ngcontent-%COMP%]   .section-invite[_ngcontent-%COMP%]   .title-invite[_ngcontent-%COMP%] {\n  font-size: 1.6rem;\n  font-weight: bold;\n  margin: 0;\n}\n.profile-drawer[_ngcontent-%COMP%]   .section-invite[_ngcontent-%COMP%]   .invite-desc[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n  margin: 10px 0;\n}\n.profile-drawer[_ngcontent-%COMP%]   .section-invite[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  padding: 8px 10px;\n  cursor: pointer;\n}\n.profile-drawer[_ngcontent-%COMP%]   .section-invite[_ngcontent-%COMP%]   .btn-invite-group[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 10px;\n}\n.profile-drawer[_ngcontent-%COMP%]   .section-invite[_ngcontent-%COMP%]   .share-btn[_ngcontent-%COMP%] {\n  background-color: var(--secondary-text-color);\n  color: var(--primary-color);\n  border: 2px solid var(--primary-color);\n  border-radius: 20px;\n}\n.profile-drawer[_ngcontent-%COMP%]   .section-invite[_ngcontent-%COMP%]   .more-btn[_ngcontent-%COMP%] {\n  background-color: inherit;\n  color: var(--secondary-text-color);\n  border: 2px solid var(--secondary-text-color);\n  border-radius: 20px;\n}\n.profile-drawer[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: 10px;\n}\n[_nghost-%COMP%]     .p-progressbar {\n  height: 10px !important;\n  background-color: #e9ecef !important;\n  border: none !important;\n}\n[_nghost-%COMP%]     .p-progressbar-value {\n  background-color: var(--primary-color) !important;\n}\n/*# sourceMappingURL=header.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i02.\u0275setClassDebugInfo(HeaderComponent, { className: "HeaderComponent", filePath: "src/app/shared/components/header/header.component.ts", lineNumber: 25 });
})();
(() => {
  const id = "src%2Fapp%2Fshared%2Fcomponents%2Fheader%2Fheader.component.ts%40HeaderComponent";
  function HeaderComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(new URL("./@ng/component?c=" + id + "&t=" + encodeURIComponent(t), import.meta.url).href, 'import')
    ).then((m) => m.default && i02.\u0275\u0275replaceMetadata(HeaderComponent, m.default, [i02, i2, i3, i4, i5, i6, i1], [NgIf, RouterModule, ButtonModule, DrawerModule, ProgressBar, DividerModule], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && HeaderComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && HeaderComponent_HmrLoad(d.timestamp)));
})();

// src/app/shared/components/footer/footer.component.ts
var footer_component_exports = {};
__export(footer_component_exports, {
  FooterComponent: () => FooterComponent
});
import { Component as Component3 } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_core.js?v=817d403b";
import { ButtonModule as ButtonModule2 } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/primeng_button.js?v=817d403b";
import { DividerModule as DividerModule2 } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/primeng_divider.js?v=817d403b";
import * as i03 from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_core.js?v=817d403b";
import * as i12 from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/primeng_button.js?v=817d403b";
import * as i22 from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/primeng_api.js?v=817d403b";
import * as i32 from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/primeng_divider.js?v=817d403b";
var FooterComponent = class _FooterComponent {
  static \u0275fac = function FooterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FooterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ i03.\u0275\u0275defineComponent({ type: _FooterComponent, selectors: [["app-footer"]], decls: 106, vars: 0, consts: [[1, "footer"], [1, "content"], [1, "top-section"], [1, "brand-message"], [1, "title-footer"], [1, "pi", "pi-arrow-right"], [1, "contact"], [1, "contact-info"], [1, "contact-block"], [1, "label"], [1, "social-links"], ["href", "#"], [1, "pi", "pi-facebook"], [1, "pi", "pi-youtube"], [1, "pi", "pi-instagram"], [1, "pi", "pi-twitter"], [1, "pi", "pi-tiktok"], [1, "footer-links"], [1, "footer-section"], [1, "address-list"], [1, "copyright"], [1, "certificates"], ["src", "assets/images/dmca.png", "alt", "DMCA"], ["src", "assets/images/ncsc.png", "alt", "SSL"], ["src", "assets/images/verified.png", "alt", "Verified"]], template: function FooterComponent_Template(rf, ctx) {
    if (rf & 1) {
      i03.\u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "p", 4);
      i03.\u0275\u0275text(5, "4MAN FASTECH lu\xF4n l\u1EAFng nghe b\u1EA1n!");
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(6, "p");
      i03.\u0275\u0275text(7, " Ch\xFAng t\xF4i lu\xF4n tr\xE2n tr\u1ECDng v\xE0 mong \u0111\u1EE3i nh\u1EADn \u0111\u01B0\u1EE3c m\u1ECDi \xFD ki\u1EBFn \u0111\xF3ng g\xF3p t\u1EEB kh\xE1ch h\xE0ng \u0111\u1EC3 c\xF3 th\u1EC3 n\xE2ng c\u1EA5p tr\u1EA3i nghi\u1EC7m d\u1ECBch v\u1EE5 v\xE0 s\u1EA3n ph\u1EA9m t\u1ED1t h\u01A1n n\u1EEFa. ");
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(8, "button");
      i03.\u0275\u0275text(9, " \u0110\xD3NG G\xD3P \xDD KI\u1EBEN ");
      i03.\u0275\u0275element(10, "i", 5);
      i03.\u0275\u0275elementEnd()();
      i03.\u0275\u0275elementStart(11, "div", 6)(12, "div", 7)(13, "div", 8)(14, "p", 9);
      i03.\u0275\u0275text(15, "Hotline");
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(16, "p");
      i03.\u0275\u0275text(17, "1900.272737 - 028.7777.2737");
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(18, "p");
      i03.\u0275\u0275text(19, "(8:30 - 22:00)");
      i03.\u0275\u0275elementEnd()();
      i03.\u0275\u0275elementStart(20, "div", 8)(21, "h3", 9);
      i03.\u0275\u0275text(22, "Email");
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(23, "p");
      i03.\u0275\u0275text(24, "Coolcoolmate.me");
      i03.\u0275\u0275elementEnd()()()();
      i03.\u0275\u0275elementStart(25, "div", 10)(26, "a", 11);
      i03.\u0275\u0275element(27, "i", 12);
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(28, "a", 11);
      i03.\u0275\u0275element(29, "i", 13);
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(30, "a", 11);
      i03.\u0275\u0275element(31, "i", 14);
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(32, "a", 11);
      i03.\u0275\u0275element(33, "i", 15);
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(34, "a", 11);
      i03.\u0275\u0275element(35, "i", 16);
      i03.\u0275\u0275elementEnd()()();
      i03.\u0275\u0275element(36, "p-divider");
      i03.\u0275\u0275elementStart(37, "div", 17)(38, "div", 18)(39, "h3", 9);
      i03.\u0275\u0275text(40, "COOLCLUB");
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(41, "ul")(42, "li")(43, "a", 11);
      i03.\u0275\u0275text(44, "T\xE0i kho\u1EA3n CoolClub");
      i03.\u0275\u0275elementEnd()();
      i03.\u0275\u0275elementStart(45, "li")(46, "a", 11);
      i03.\u0275\u0275text(47, "\u01AFu \u0111\xE3i & \u0110\u1EB7c quy\u1EC1n");
      i03.\u0275\u0275elementEnd()()()();
      i03.\u0275\u0275elementStart(48, "div", 18)(49, "h3", 9);
      i03.\u0275\u0275text(50, "CH\xCDNH S\xC1CH");
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(51, "ul")(52, "li")(53, "a", 11);
      i03.\u0275\u0275text(54, "Ch\xEDnh s\xE1ch \u0111\u1ED5i tr\u1EA3 60 ng\xE0y");
      i03.\u0275\u0275elementEnd()();
      i03.\u0275\u0275elementStart(55, "li")(56, "a", 11);
      i03.\u0275\u0275text(57, "Ch\xEDnh s\xE1ch b\u1EA3o m\u1EADt");
      i03.\u0275\u0275elementEnd()();
      i03.\u0275\u0275elementStart(58, "li")(59, "a", 11);
      i03.\u0275\u0275text(60, "Ch\xEDnh s\xE1ch giao h\xE0ng");
      i03.\u0275\u0275elementEnd()()()();
      i03.\u0275\u0275elementStart(61, "div", 18)(62, "h3", 9);
      i03.\u0275\u0275text(63, "CH\u0102M S\xD3C KH\xC1CH H\xC0NG");
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(64, "ul")(65, "li")(66, "a", 11);
      i03.\u0275\u0275text(67, "Tr\u1EA3i nghi\u1EC7m mua s\u1EAFm 100% h\xE0i l\xF2ng");
      i03.\u0275\u0275elementEnd()();
      i03.\u0275\u0275elementStart(68, "li")(69, "a", 11);
      i03.\u0275\u0275text(70, "H\u1ECFi \u0111\xE1p - FAQs");
      i03.\u0275\u0275elementEnd()()()();
      i03.\u0275\u0275elementStart(71, "div", 18)(72, "h3", 9);
      i03.\u0275\u0275text(73, "V\u1EC0 COOLMATE");
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(74, "ul")(75, "li")(76, "a", 11);
      i03.\u0275\u0275text(77, "Gi\u1EDBi thi\u1EC7u v\u1EC1 4Man Fashion");
      i03.\u0275\u0275elementEnd()();
      i03.\u0275\u0275elementStart(78, "li")(79, "a", 11);
      i03.\u0275\u0275text(80, "DVKH xu\u1EA5t s\u1EAFc");
      i03.\u0275\u0275elementEnd()();
      i03.\u0275\u0275elementStart(81, "li")(82, "a", 11);
      i03.\u0275\u0275text(83, "Nh\xE0 m\xE1y");
      i03.\u0275\u0275elementEnd()();
      i03.\u0275\u0275elementStart(84, "li")(85, "a", 11);
      i03.\u0275\u0275text(86, "Cam k\u1EBFt b\u1EC1n v\u1EEFng");
      i03.\u0275\u0275elementEnd()();
      i03.\u0275\u0275elementStart(87, "li")(88, "a", 11);
      i03.\u0275\u0275text(89, "T\u1EA7m nh\xECn 2030");
      i03.\u0275\u0275elementEnd()()()();
      i03.\u0275\u0275elementStart(90, "div", 18)(91, "h3", 9);
      i03.\u0275\u0275text(92, "\u0110\u1ECAA CH\u1EC8 LI\xCAN H\u1EC6");
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(93, "ul", 19)(94, "li");
      i03.\u0275\u0275text(95, " Trung t\xE2m x\u1EED l\xFD \u0111\u01A1n h\xE0ng: Kho 4Man Fashion, Th\xF4n An Kh\xE1nh, X\xE3 Ng\u1ECDc T\u1EA3o, huy\u1EC7n Ph\xFAc Th\u1ECD, TP.H\xE0 N\u1ED9i ");
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(96, "li");
      i03.\u0275\u0275text(97, " C\u1EEDa h\xE0ng: 4Man Fashion, Th\xF4n T\xE1o 3, X\xE3 Tam Thu\u1EA5n, huy\u1EC7n Ph\xFAc Th\u1ECD, TP.H\xE0 N\u1ED9i ");
      i03.\u0275\u0275elementEnd()()()();
      i03.\u0275\u0275element(98, "p-divider");
      i03.\u0275\u0275elementStart(99, "div", 20)(100, "p");
      i03.\u0275\u0275text(101, "\xA9 4MAN FASHION");
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(102, "div", 21);
      i03.\u0275\u0275element(103, "img", 22)(104, "img", 23)(105, "img", 24);
      i03.\u0275\u0275elementEnd()()()();
    }
  }, dependencies: [ButtonModule2, i12.ButtonDirective, i12.Button, i12.ButtonLabel, i12.ButtonIcon, i22.Header, i22.Footer, i22.PrimeTemplate, DividerModule2, i32.Divider], styles: ['\n\n.footer[_ngcontent-%COMP%] {\n  background-color: #000000;\n  color: #ffffff;\n  padding: 20px;\n  margin: 0;\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    Helvetica,\n    Arial,\n    sans-serif;\n}\n.footer[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%] {\n  width: 100%;\n  margin: 0;\n}\n.footer[_ngcontent-%COMP%]   .title-footer[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  font-weight: 700;\n  margin-bottom: 1rem;\n}\n.footer[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  font-size: 1.6rem;\n  font-weight: 600;\n  margin-bottom: 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.footer[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.footer[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n.footer[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #d1d1d1;\n  text-decoration: none;\n  transition: color 0.2s ease;\n}\n.footer[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  color: #ffffff;\n}\n.footer[_ngcontent-%COMP%]   .mt-4[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n}\n.footer[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 2rem;\n  margin-bottom: 1rem;\n}\n.footer[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .brand-message[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  min-width: 300px;\n}\n.footer[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .brand-message[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n  line-height: 1.6;\n  max-width: 500px;\n  color: #e0e0e0;\n}\n.footer[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .brand-message[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  font-size: 1.6rem;\n  padding: 8px 8px;\n  border-radius: 20px;\n  width: 189px;\n  text-align: center;\n  border: none;\n  background-color: var(--primary-color);\n  color: var(--secondary-text-color);\n  cursor: pointer;\n}\n.footer[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .brand-message[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  margin-left: 0.5rem;\n  font-size: 1.6rem;\n}\n.footer[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .contact[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.footer[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .contact[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  min-width: 250px;\n}\n.footer[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .contact[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%]   .contact-block[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.footer[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .contact[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%]   .contact-block[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n.footer[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .contact[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%]   .contact-block[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.25rem 0;\n  color: #e0e0e0;\n}\n.footer[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  margin-top: 1rem;\n}\n.footer[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 2rem;\n  height: 2rem;\n  border-radius: 50%;\n  margin: 0 10px;\n  background-color: rgba(255, 255, 255, 0.1);\n  transition: background-color 0.2s ease;\n}\n.footer[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  background-color: rgba(255, 255, 255, 0.2);\n}\n.footer[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 2.9rem;\n  color: #fff;\n  padding: 0.5rem;\n}\n.footer[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  gap: 1rem 2rem;\n  margin: 1.5rem 0;\n}\n.footer[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .footer-section[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 180px;\n  margin-bottom: 1.5rem;\n}\n.footer[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n  margin-bottom: 0.75rem;\n}\n.footer[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  line-height: 1.4;\n}\n.footer[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .address-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  line-height: 1.6;\n  color: #b0b0b0;\n  margin-bottom: 1rem;\n}\n.copyright[_ngcontent-%COMP%] {\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-top: 1.5rem;\n  color: #7a7a7a;\n}\n.copyright[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n.copyright[_ngcontent-%COMP%]   .certificates[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: 1.5rem;\n  margin-top: 1.5rem;\n}\n.copyright[_ngcontent-%COMP%]   .certificates[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  height: 4rem;\n}\n[_nghost-%COMP%]     .p-divider {\n  margin: 1.5rem 0;\n  opacity: 0.2;\n}\n/*# sourceMappingURL=footer.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassDebugInfo(FooterComponent, { className: "FooterComponent", filePath: "src/app/shared/components/footer/footer.component.ts", lineNumber: 11 });
})();
(() => {
  const id = "src%2Fapp%2Fshared%2Fcomponents%2Ffooter%2Ffooter.component.ts%40FooterComponent";
  function FooterComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(new URL("./@ng/component?c=" + id + "&t=" + encodeURIComponent(t), import.meta.url).href, 'import')
    ).then((m) => m.default && i03.\u0275\u0275replaceMetadata(FooterComponent, m.default, [i03, i12, i22, i32], [ButtonModule2, DividerModule2], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && FooterComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && FooterComponent_HmrLoad(d.timestamp)));
})();

// src/app/pages/home/home.component.ts
import * as i04 from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_core.js?v=817d403b";
var HomeComponent = class _HomeComponent {
  static \u0275fac = function HomeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HomeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ i04.\u0275\u0275defineComponent({ type: _HomeComponent, selectors: [["app-home"]], decls: 7, vars: 0, consts: [[1, "container-fluid"], [1, "row"], [1, "col-12"]], template: function HomeComponent_Template(rf, ctx) {
    if (rf & 1) {
      i04.\u0275\u0275elementStart(0, "div", 0)(1, "header", 1);
      i04.\u0275\u0275element(2, "app-header");
      i04.\u0275\u0275elementEnd();
      i04.\u0275\u0275elementStart(3, "main", 1);
      i04.\u0275\u0275element(4, "div", 2);
      i04.\u0275\u0275elementEnd();
      i04.\u0275\u0275elementStart(5, "footer", 1);
      i04.\u0275\u0275element(6, "app-footer");
      i04.\u0275\u0275elementEnd()();
    }
  }, dependencies: [HeaderComponent, FooterComponent], styles: ['\n\nfooter[_ngcontent-%COMP%] {\n  background-color: #000000;\n  color: #ffffff;\n  padding: 2rem 1rem 3rem;\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    Helvetica,\n    Arial,\n    sans-serif;\n}\nfooter[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: 0 auto;\n}\nfooter[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  margin-bottom: 1rem;\n}\nfooter[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 600;\n  margin-bottom: 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\nfooter[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\nfooter[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\nfooter[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #d1d1d1;\n  text-decoration: none;\n  transition: color 0.2s ease;\n  font-size: 0.9rem;\n}\nfooter[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  color: #ffffff;\n}\nfooter[_ngcontent-%COMP%]   .mt-4[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n}\nfooter[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  gap: 2rem;\n  margin-bottom: 1rem;\n}\nfooter[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .brand-message[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 300px;\n}\nfooter[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .brand-message[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n  line-height: 1.6;\n  max-width: 500px;\n  color: #e0e0e0;\n}\nfooter[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  min-width: 250px;\n}\n@media (min-width: 768px) {\n  footer[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%] {\n    align-items: flex-end;\n  }\n}\nfooter[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%]   .contact-block[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\nfooter[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%]   .contact-block[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\nfooter[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%]   .contact-block[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.25rem 0;\n  color: #e0e0e0;\n}\nfooter[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  margin-top: 1rem;\n}\nfooter[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 2rem;\n  height: 2rem;\n  border-radius: 50%;\n  background-color: rgba(255, 255, 255, 0.1);\n  transition: background-color 0.2s ease;\n}\nfooter[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  background-color: rgba(255, 255, 255, 0.2);\n}\nfooter[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: #fff;\n}\nfooter[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  gap: 1rem 2rem;\n  margin: 1.5rem 0;\n}\nfooter[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .footer-section[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 180px;\n  margin-bottom: 1.5rem;\n}\nfooter[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .footer-section[_ngcontent-%COMP%]:last-child {\n  min-width: 250px;\n}\n@media (min-width: 992px) {\n  footer[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .footer-section[_ngcontent-%COMP%]:last-child {\n    flex: 1.5;\n  }\n}\nfooter[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .footer-section[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-bottom: 0.75rem;\n}\nfooter[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .footer-section[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  line-height: 1.4;\n}\nfooter[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .footer-section[_ngcontent-%COMP%]   .address-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  line-height: 1.6;\n  color: #b0b0b0;\n  margin-bottom: 1rem;\n}\nfooter[_ngcontent-%COMP%]   .copyright[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-top: 1.5rem;\n  font-size: 0.8rem;\n  color: #7a7a7a;\n}\nfooter[_ngcontent-%COMP%]   .copyright[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\nfooter[_ngcontent-%COMP%]   .copyright[_ngcontent-%COMP%]   .certificates[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: 1.5rem;\n  margin-top: 1.5rem;\n}\nfooter[_ngcontent-%COMP%]   .copyright[_ngcontent-%COMP%]   .certificates[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  height: 2rem;\n}\nfooter   [_nghost-%COMP%]     .p-button {\n  background-color: #3b82f6;\n  border-color: #3b82f6;\n  border-radius: 0.25rem;\n  font-size: 0.9rem;\n}\nfooter   [_nghost-%COMP%]     .p-button:hover {\n  background-color: #2563eb;\n  border-color: #2563eb;\n}\nfooter   [_nghost-%COMP%]     .p-button .p-button-icon {\n  margin-left: 0.5rem;\n}\nfooter   [_nghost-%COMP%]     .p-divider {\n  margin: 1.5rem 0;\n  opacity: 0.2;\n}\n@media (max-width: 576px) {\n  footer[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  footer[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%] {\n    align-items: flex-start;\n  }\n  footer[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  footer[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .footer-section[_ngcontent-%COMP%] {\n    min-width: 100%;\n  }\n}\n@media (min-width: 577px) and (max-width: 991px) {\n  footer[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .footer-section[_ngcontent-%COMP%] {\n    flex: 0 0 calc(50% - 1rem);\n    min-width: calc(50% - 1rem);\n  }\n}\n@media (min-width: 992px) {\n  footer[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .footer-section[_ngcontent-%COMP%] {\n    flex: 1;\n  }\n}\n/*# sourceMappingURL=home.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i04.\u0275setClassDebugInfo(HomeComponent, { className: "HomeComponent", filePath: "src/app/pages/home/home.component.ts", lineNumber: 11 });
})();
(() => {
  const id = "src%2Fapp%2Fpages%2Fhome%2Fhome.component.ts%40HomeComponent";
  function HomeComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(new URL("./@ng/component?c=" + id + "&t=" + encodeURIComponent(t), import.meta.url).href, 'import')
    ).then((m) => m.default && i04.\u0275\u0275replaceMetadata(HomeComponent, m.default, [i04, header_component_exports, footer_component_exports], [], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && HomeComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && HomeComponent_HmrLoad(d.timestamp)));
})();

// src/app/app.routes.ts
var routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent }
];

// src/app/app.config.ts
import { provideClientHydration, withEventReplay } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_platform-browser.js?v=817d403b";
function initializeKeycloak(keycloak) {
  return () => keycloak.init({
    config: {
      url: "http://localhost:8180",
      realm: "IamService",
      clientId: "iam_service"
    },
    initOptions: {
      onLoad: "check-sso",
      // 'login-required' , 'check-sso'
      silentCheckSsoRedirectUri: window.location.origin + "/assets/silent-check-sso.html"
    },
    enableBearerInterceptor: true
  });
}
var appConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService2]
    },
    KeycloakService2,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    providePrimeNG2({
      ripple: true,
      theme: {
        preset: Aura2
      }
    })
  ]
};

// src/app/app.component.ts
import { Component as Component5 } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_core.js?v=817d403b";
import { RouterOutlet as RouterOutlet2 } from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_router.js?v=817d403b";
import * as i05 from "/@fs/Users/macbookairm3/Documents/Store Project/4ManFashion/frontend/.angular/cache/19.2.5/frontend/vite/deps/@angular_core.js?v=817d403b";
var AppComponent = class _AppComponent {
  title = "frontend";
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ i05.\u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      i05.\u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet2], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i05.\u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 10 });
})();
(() => {
  const id = "src%2Fapp%2Fapp.component.ts%40AppComponent";
  function AppComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(new URL("./@ng/component?c=" + id + "&t=" + encodeURIComponent(t), import.meta.url).href, 'import')
    ).then((m) => m.default && i05.\u0275\u0275replaceMetadata(AppComponent, m.default, [i05], [RouterOutlet2], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && AppComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && AppComponent_HmrLoad(d.timestamp)));
})();

// src/main.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9tYWluLnRzIiwic3JjL2FwcC9hcHAuY29uZmlnLnRzIiwic3JjL2FwcC9mZWF0dXJlcy9sb2dpbi9sb2dpbi5jb21wb25lbnQudHMiLCJzcmMvYXBwL2ZlYXR1cmVzL2xvZ2luL2xvZ2luLmNvbXBvbmVudC5odG1sIiwic3JjL2FwcC9wYWdlcy9ob21lL2hvbWUuY29tcG9uZW50LnRzIiwic3JjL2FwcC9wYWdlcy9ob21lL2hvbWUuY29tcG9uZW50Lmh0bWwiLCJzcmMvYXBwL3NoYXJlZC9zaGFyZWQuY29uZmlnLnRzIiwic3JjL2FwcC9zaGFyZWQvY29tcG9uZW50cy9oZWFkZXIvaGVhZGVyLmNvbXBvbmVudC50cyIsInNyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvaGVhZGVyL2hlYWRlci5jb21wb25lbnQuaHRtbCIsInNyYy9hcHAvY29yZS9tb2RlbHMvVXNlci50cyIsInNyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQudHMiLCJzcmMvYXBwL3NoYXJlZC9jb21wb25lbnRzL2Zvb3Rlci9mb290ZXIuY29tcG9uZW50Lmh0bWwiLCJzcmMvYXBwL2FwcC5yb3V0ZXMudHMiLCJzcmMvYXBwL2FwcC5jb21wb25lbnQudHMiLCJzcmMvYXBwL2FwcC5jb21wb25lbnQuaHRtbCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBib290c3RyYXBBcHBsaWNhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgYXBwQ29uZmlnIH0gZnJvbSAnLi9hcHAvYXBwLmNvbmZpZyc7XG5pbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tICcuL2FwcC9hcHAuY29tcG9uZW50JztcblxuYm9vdHN0cmFwQXBwbGljYXRpb24oQXBwQ29tcG9uZW50LCBhcHBDb25maWcpXG4gIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVycikpO1xuIiwiaW1wb3J0IHtcbiAgQXBwbGljYXRpb25Db25maWcsXG4gIHByb3ZpZGVab25lQ2hhbmdlRGV0ZWN0aW9uLFxuICBBUFBfSU5JVElBTElaRVIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgcHJvdmlkZVJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBwcm92aWRlQW5pbWF0aW9uc0FzeW5jIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zL2FzeW5jJztcbmltcG9ydCB7IHByb3ZpZGVQcmltZU5HIH0gZnJvbSAncHJpbWVuZy9jb25maWcnO1xuaW1wb3J0IHtcbiAgS2V5Y2xvYWtBbmd1bGFyTW9kdWxlLFxuICBLZXljbG9ha0JlYXJlckludGVyY2VwdG9yLFxuICBLZXljbG9ha1NlcnZpY2UsXG59IGZyb20gJ2tleWNsb2FrLWFuZ3VsYXInO1xuXG5pbXBvcnQgQXVyYSBmcm9tICdAcHJpbWVuZy90aGVtZXMvYXVyYSc7XG5pbXBvcnQgeyBIVFRQX0lOVEVSQ0VQVE9SUyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHsgcm91dGVzIH0gZnJvbSAnLi9hcHAucm91dGVzJztcbmltcG9ydCB7XG4gIHByb3ZpZGVDbGllbnRIeWRyYXRpb24sXG4gIHdpdGhFdmVudFJlcGxheSxcbn0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVLZXljbG9hayhrZXljbG9hazogS2V5Y2xvYWtTZXJ2aWNlKSB7XG4gIHJldHVybiAoKSA9PlxuICAgIGtleWNsb2FrLmluaXQoe1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODE4MCcsXG4gICAgICAgIHJlYWxtOiAnSWFtU2VydmljZScsXG4gICAgICAgIGNsaWVudElkOiAnaWFtX3NlcnZpY2UnLFxuICAgICAgfSxcbiAgICAgIGluaXRPcHRpb25zOiB7XG4gICAgICAgIG9uTG9hZDogJ2NoZWNrLXNzbycsIC8vICdsb2dpbi1yZXF1aXJlZCcgLCAnY2hlY2stc3NvJ1xuICAgICAgICBzaWxlbnRDaGVja1Nzb1JlZGlyZWN0VXJpOlxuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyAnL2Fzc2V0cy9zaWxlbnQtY2hlY2stc3NvLmh0bWwnLFxuICAgICAgfSxcbiAgICAgIGVuYWJsZUJlYXJlckludGVyY2VwdG9yOiB0cnVlLFxuICAgIH0pO1xufVxuXG5leHBvcnQgY29uc3QgYXBwQ29uZmlnOiBBcHBsaWNhdGlvbkNvbmZpZyA9IHtcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogQVBQX0lOSVRJQUxJWkVSLFxuICAgICAgdXNlRmFjdG9yeTogaW5pdGlhbGl6ZUtleWNsb2FrLFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgICBkZXBzOiBbS2V5Y2xvYWtTZXJ2aWNlXSxcbiAgICB9LFxuICAgIEtleWNsb2FrU2VydmljZSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBIVFRQX0lOVEVSQ0VQVE9SUyxcbiAgICAgIHVzZUNsYXNzOiBLZXljbG9ha0JlYXJlckludGVyY2VwdG9yLFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgfSxcbiAgICBwcm92aWRlWm9uZUNoYW5nZURldGVjdGlvbih7IGV2ZW50Q29hbGVzY2luZzogdHJ1ZSB9KSxcbiAgICBwcm92aWRlUm91dGVyKHJvdXRlcyksXG4gICAgcHJvdmlkZUNsaWVudEh5ZHJhdGlvbih3aXRoRXZlbnRSZXBsYXkoKSksXG4gICAgcHJvdmlkZUFuaW1hdGlvbnNBc3luYygpLFxuICAgIHByb3ZpZGVQcmltZU5HKHtcbiAgICAgIHJpcHBsZTogdHJ1ZSxcbiAgICAgIHRoZW1lOiB7XG4gICAgICAgIHByZXNldDogQXVyYSxcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1sb2dpbicsXG4gIGltcG9ydHM6IFtdLFxuICB0ZW1wbGF0ZVVybDogJy4vbG9naW4uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybDogJy4vbG9naW4uY29tcG9uZW50LnNjc3MnXG59KVxuZXhwb3J0IGNsYXNzIExvZ2luQ29tcG9uZW50IHtcblxufVxuIiwiPHA+bG9naW4gd29ya3MhPC9wPlxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi9zaGFyZWQvY29tcG9uZW50cy9oZWFkZXIvaGVhZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTSEFSRURfQ09NUE9ORU5UUyB9IGZyb20gJy4uLy4uL3NoYXJlZC9zaGFyZWQuY29uZmlnJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLWhvbWUnLFxuICBpbXBvcnRzOiBbLi4uU0hBUkVEX0NPTVBPTkVOVFNdLFxuICB0ZW1wbGF0ZVVybDogJy4vaG9tZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsOiAnLi9ob21lLmNvbXBvbmVudC5zY3NzJyxcbn0pXG5leHBvcnQgY2xhc3MgSG9tZUNvbXBvbmVudCB7fVxuIiwiPGRpdiBjbGFzcz1cImNvbnRhaW5lci1mbHVpZFwiPlxuICA8IS0tIEhlYWRlciAtLT5cbiAgPGhlYWRlciBjbGFzcz1cInJvd1wiPlxuICAgIDxhcHAtaGVhZGVyPjwvYXBwLWhlYWRlcj5cbiAgPC9oZWFkZXI+XG5cbiAgPCEtLSBNYWluIENvbnRlbnQgLS0+XG4gIDxtYWluIGNsYXNzPVwicm93XCI+XG4gICAgPGRpdiBjbGFzcz1cImNvbC0xMlwiPjwvZGl2PlxuICA8L21haW4+XG5cbiAgPCEtLSBGb290ZXIgLS0+XG4gIDxmb290ZXIgY2xhc3M9XCJyb3dcIj5cbiAgICA8YXBwLWZvb3Rlcj48L2FwcC1mb290ZXI+XG4gIDwvZm9vdGVyPlxuPC9kaXY+XG4iLCJpbXBvcnQgeyBwcm92aWRlSHR0cENsaWVudCwgd2l0aEludGVyY2VwdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEVudmlyb25tZW50UHJvdmlkZXJzLCBQcm92aWRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgcHJvdmlkZUFuaW1hdGlvbnMgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgUHJpbWVJY29ucyB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IHByb3ZpZGVQcmltZU5HIH0gZnJvbSAncHJpbWVuZy9jb25maWcnO1xuaW1wb3J0IEF1cmEgZnJvbSAnQHByaW1lbmcvdGhlbWVzL2F1cmEnO1xuXG4vLyBJbXBvcnQgY8OhYyBzZXJ2aWNlcywgY29tcG9uZW50cyBzaGFyZWRcbmltcG9ydCB7IEhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9oZWFkZXIvaGVhZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBGb290ZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQnO1xuLy8gSW1wb3J0IGPDoWMgbW9kdWxlcyBraMOhYyBu4bq/dSBj4bqnblxuXG4vLyBDw6FjIHRva2VuIHbDoCBzZXJ2aWNlc1xuZXhwb3J0IGNvbnN0IEFQSV9VUkwgPSAnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaSc7XG5cbi8vIEjDoG0gdHLhuqMgduG7gSB04bqldCBj4bqjIHByb3ZpZGVycyBjaG8gc2hhcmVkIG1vZHVsZVxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVTaGFyZWQoKTogKFByb3ZpZGVyIHwgRW52aXJvbm1lbnRQcm92aWRlcnMpW10ge1xuICByZXR1cm4gW1xuICAgIHByb3ZpZGVIdHRwQ2xpZW50KCksXG4gICAgcHJvdmlkZUFuaW1hdGlvbnMoKSxcbiAgICBwcm92aWRlUHJpbWVORyh7XG4gICAgICByaXBwbGU6IHRydWUsXG4gICAgICB0aGVtZToge1xuICAgICAgICBwcmVzZXQ6IEF1cmEsXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICB0eXBvZ3JhcGh5OiB7XG4gICAgICAgICAgICBmb250RmFtaWx5OiAnSW50ZXIsIHNhbnMtc2VyaWYnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHtcbiAgICAgIHByb3ZpZGU6ICdBUElfVVJMJyxcbiAgICAgIHVzZVZhbHVlOiBBUElfVVJMLFxuICAgIH0sXG4gIF07XG59XG5cbi8vIEV4cG9ydCB04bqldCBj4bqjIGNvbXBvbmVudHMgZMO5bmcgY2h1bmdcbmV4cG9ydCBjb25zdCBTSEFSRURfQ09NUE9ORU5UUyA9IFtIZWFkZXJDb21wb25lbnQsIEZvb3RlckNvbXBvbmVudF07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgS2V5Y2xvYWtTZXJ2aWNlIH0gZnJvbSAna2V5Y2xvYWstYW5ndWxhcic7XG5pbXBvcnQgeyBLZXljbG9ha1Byb2ZpbGUgfSBmcm9tICdrZXljbG9hay1qcyc7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9tb2RlbHMvVXNlcic7XG5pbXBvcnQgeyBOZ0lmIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBCdXR0b25Nb2R1bGUgfSBmcm9tICdwcmltZW5nL2J1dHRvbic7XG5pbXBvcnQgeyBEcmF3ZXJNb2R1bGUgfSBmcm9tICdwcmltZW5nL2RyYXdlcic7XG5pbXBvcnQgeyBQcm9ncmVzc0JhciB9IGZyb20gJ3ByaW1lbmcvcHJvZ3Jlc3NiYXInO1xuaW1wb3J0IHsgRGl2aWRlck1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvZGl2aWRlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1oZWFkZXInLFxuICBpbXBvcnRzOiBbXG4gICAgTmdJZixcbiAgICBSb3V0ZXJNb2R1bGUsXG4gICAgQnV0dG9uTW9kdWxlLFxuICAgIERyYXdlck1vZHVsZSxcbiAgICBQcm9ncmVzc0JhcixcbiAgICBEaXZpZGVyTW9kdWxlLFxuICBdLFxuICB0ZW1wbGF0ZVVybDogJy4vaGVhZGVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vaGVhZGVyLmNvbXBvbmVudC5zY3NzJ10sXG59KVxuZXhwb3J0IGNsYXNzIEhlYWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIHB1YmxpYyB1c2VyID0gbmV3IFVzZXIoKTtcbiAgcHVibGljIHZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIHBlcmNlbnQ6IG51bWJlciA9IDgwO1xuICBwdWJsaWMgaXNMb2dnZWRJbiA9IGZhbHNlO1xuICBwdWJsaWMgdXNlclByb2ZpbGU6IEtleWNsb2FrUHJvZmlsZSB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkga2V5Y2xvYWs6IEtleWNsb2FrU2VydmljZSkge31cblxuICBwdWJsaWMgYXN5bmMgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pc0xvZ2dlZEluID0gYXdhaXQgdGhpcy5rZXljbG9hay5pc0xvZ2dlZEluKCk7XG5cbiAgICBpZiAodGhpcy5pc0xvZ2dlZEluKSB7XG4gICAgICB0aGlzLnVzZXJQcm9maWxlID0gYXdhaXQgdGhpcy5rZXljbG9hay5sb2FkVXNlclByb2ZpbGUoKTtcbiAgICAgIHRoaXMudXNlci5hdXRoU3RhdHVzID0gJ0FVVEgnO1xuICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ3VzZXJkZXRhaWxzJywgSlNPTi5zdHJpbmdpZnkodGhpcy51c2VyKSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGxvZ2luKCkge1xuICAgIHRoaXMua2V5Y2xvYWsubG9naW4oKTtcbiAgfVxuXG4gIHB1YmxpYyBsb2dvdXQoKSB7XG4gICAgbGV0IHJlZGlyZWN0VVJJOiBzdHJpbmcgPSAnaHR0cDovL2xvY2FsaG9zdDo0MjAwL2hvbWUnO1xuICAgIHRoaXMua2V5Y2xvYWsubG9nb3V0KHJlZGlyZWN0VVJJKTtcbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cImhlYWRlclwiPlxuICA8ZGl2IGNsYXNzPVwibG9nb1wiPlxuICAgIDxpbWcgY2xhc3M9XCJsb2dvLWltYWdlXCIgc3JjPVwiL2Fzc2V0cy9pbWFnZXMvbG9nby5wbmdcIiBhbHQ9XCI0TWFuRmFzaGlvblwiIC8+XG4gIDwvZGl2PlxuXG4gIDxuYXYgY2xhc3M9XCJuYXZcIj5cbiAgICA8dWwgY2xhc3M9XCJuYXYtbGlzdFwiPlxuICAgICAgPGxpPlxuICAgICAgICA8YSByb3V0ZXJMaW5rPVwiL2hvbWVcIj5UUkFORyBDSOG7pjwvYT5cbiAgICAgIDwvbGk+XG4gICAgICA8bGk+XG4gICAgICAgIDxhIHJvdXRlckxpbms9XCIvaG9tZVwiPlFV4bqmTjwvYT5cbiAgICAgIDwvbGk+XG4gICAgICA8bGk+XG4gICAgICAgIDxhIHJvdXRlckxpbms9XCIvcGh1a2llblwiPlBI4bukIEtJ4buGTjwvYT5cbiAgICAgIDwvbGk+XG4gICAgICA8IS0tIDxsaSAqbmdJZj1cInVzZXIuYXV0aFN0YXR1cyAhPSAnQVVUSCdcIiByb3V0ZXJMaW5rQWN0aXZlPVwiYWN0aXZlXCI+XG4gICAgICAgIDxhIChjbGljayk9XCJsb2dpbigpXCI+xJDEgk5HIE5I4bqsUDwvYT5cbiAgICAgIDwvbGk+IC0tPlxuICAgICAgPGxpPlxuICAgICAgICA8YSByb3V0ZXJMaW5rPVwiL2Fib3V0XCI+R0nhu5pJIFRISeG7hlU8L2E+XG4gICAgICA8L2xpPlxuICAgICAgPCEtLSA8bGkgKm5nSWY9XCJ1c2VyLmF1dGhTdGF0dXMgPT0gJ0FVVEgnXCIgcm91dGVyTGlua0FjdGl2ZT1cImFjdGl2ZVwiPlxuICAgICAgICA8YSAoY2xpY2spPVwibG9nb3V0KClcIj7EkMSCTkcgWFXhuqRUPC9hPlxuICAgICAgPC9saT4gLS0+XG4gICAgPC91bD5cbiAgPC9uYXY+XG5cbiAgPGRpdiBjbGFzcz1cInNlYXJjaFwiPlxuICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVMOsbSBraeG6v20gc+G6o24gcGjhuqltLi4uXCIgLz5cbiAgICA8YnV0dG9uPjxpIGNsYXNzPVwicGkgcGktc2VhcmNoXCI+PC9pPjwvYnV0dG9uPlxuICA8L2Rpdj5cblxuICA8bmF2IGNsYXNzPVwiYXV0aC1uYXZcIj5cbiAgICA8dWwgY2xhc3M9XCJhdXRoLW5hdi1saXN0XCI+XG4gICAgICA8bGkgKm5nSWY9XCJ1c2VyLmF1dGhTdGF0dXMgIT0gJ0FVVEgnXCIgY2xhc3M9XCJsb2dpbi1idG5cIj5cbiAgICAgICAgPGEgKGNsaWNrKT1cImxvZ2luKClcIj7EkMSCTkcgTkjhuqxQPC9hPlxuICAgICAgPC9saT5cbiAgICAgIDxsaSAqbmdJZj1cInVzZXIuYXV0aFN0YXR1cyAhPSAnQVVUSCdcIiBjbGFzcz1cInJlZ2lzdGVyLWJ0blwiPlxuICAgICAgICA8YT7EkMSCTkcgS8OdPC9hPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICA8L25hdj5cblxuICA8ZGl2IGNsYXNzPVwibWVudVwiICpuZ0lmPVwidXNlci5hdXRoU3RhdHVzID09ICdBVVRIJ1wiPlxuICAgIDxpIGNsYXNzPVwicGkgcGktdXNlclwiIChjbGljayk9XCJ2aXNpYmxlID0gdHJ1ZVwiPjwvaT5cbiAgICA8aSBjbGFzcz1cInBpIHBpLXNob3BwaW5nLWNhcnRcIj48L2k+XG4gICAgPHAtZHJhd2VyXG4gICAgICBbKHZpc2libGUpXT1cInZpc2libGVcIlxuICAgICAgcG9zaXRpb249XCJyaWdodFwiXG4gICAgICBbYmFzZVpJbmRleF09XCIxMDAwMFwiXG4gICAgICBbc3R5bGVdPVwieyB3aWR0aDogJzM1MHB4JyB9XCJcbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzPVwicHJvZmlsZS1kcmF3ZXJcIj5cbiAgICAgICAgPGgyIGNsYXNzPVwidGl0bGUtZHJhd2VyXCI+SGksIFBoYW4gxJDhuqF0PC9oMj5cbiAgICAgICAgPHAtZGl2aWRlcj48L3AtZGl2aWRlcj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInNwZW5kaW5nLWluZm9cIj5cbiAgICAgICAgICA8cD5cbiAgICAgICAgICAgIENoaSB0acOqdSB0aMOqbSA8c3Ryb25nIGNsYXNzPVwidGFyZ2V0LWNhc2hcIj41MDAuMDAwxJE8L3N0cm9uZz4gxJHhu4MgbMOqblxuICAgICAgICAgICAgaOG6oW5nXG4gICAgICAgICAgICA8c3Ryb25nPkLhuqBDPC9zdHJvbmc+XG4gICAgICAgICAgPC9wPlxuICAgICAgICAgIDxwLXByb2dyZXNzYmFyIFt2YWx1ZV09XCJwZXJjZW50XCIgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1hbi1jbHViXCI+XG4gICAgICAgICAgPHA+XG4gICAgICAgICAgICBIaeG7h24gdOG6oWkgYuG6oW4gY8OzOiA8YnIgLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwid2FsbGV0XCJcbiAgICAgICAgICAgICAgPjxpIGNsYXNzPVwicGkgcGktbW9uZXktYmlsbFwiPjwvaT5cbiAgICAgICAgICAgICAgPHN0cm9uZyBjbGFzcz1cImNvaW5cIj4wPC9zdHJvbmc+IDRNYW5jYXNoPC9zcGFuXG4gICAgICAgICAgICA+XG4gICAgICAgICAgPC9wPlxuICAgICAgICAgIDxidXR0b24+VuG7gSA0TWFuPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgc2VjdGlvbi1pbnZpdGVcIj5cbiAgICAgICAgICA8UCBjbGFzcz1cInRpdGxlLWludml0ZVwiPkdp4bubaSB0aGnhu4d1IGLhuqFuIGLDqDwvUD5cbiAgICAgICAgICA8cCBjbGFzcz1cImludml0ZS1kZXNjXCI+XG4gICAgICAgICAgICBOaOG6rW4gbmdheSAxMCUgZ2nDoSB0cuG7iyDEkcahbiBow6BuZyDEkeG6p3UgdGnDqm4gY+G7p2EgYuG6oW4gYsOoIMSRxrDhu6NjIHF1eSDEkeG7lWlcbiAgICAgICAgICAgIHRow6BuaCA0TWFuQ2FzaFxuICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWludml0ZS1ncm91cFwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInNoYXJlLWJ0blwiPkNoaWEgc+G6uzwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1vcmUtYnRuXCI+VMOsbSBoaeG7g3UgdGjDqm08L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBuYXYtbWFuYWdlXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC02IG5hdi1tYW5hZ2UtaXRlbVwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJwaSBwaS1oaXN0b3J5XCI+PC9pPlxuICAgICAgICAgICAgPGEgcm91dGVyTGluaz1cIi9teS1vcmRlclwiPkzhu4tjaCBz4butIMSRxqFuIGjDoG5nPC9hPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC02IG5hdi1tYW5hZ2UtaXRlbVwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJwaSBwaS1hZGRyZXNzLWJvb2tcIj48L2k+XG4gICAgICAgICAgICA8YSByb3V0ZXJMaW5rPVwiL215LW9yZGVyXCI+U+G7lSDEkeG7i2EgY2jhu4k8L2E+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTYgbmF2LW1hbmFnZS1pdGVtXCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cInBpIHBpLWNvZ1wiPjwvaT5cbiAgICAgICAgICAgIDxhIHJvdXRlckxpbms9XCIvbXktc2V0dGluZ1wiPkPDoGkgxJHhurd0IHTDoGkga2hv4bqjbjwvYT5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtNiBuYXYtbWFuYWdlLWl0ZW1cIj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwicGkgcGktcXVlc3Rpb24tY2lyY2xlXCI+PC9pPlxuICAgICAgICAgICAgPGEgcm91dGVyTGluaz1cIi9hZGRyZXNzXCI+RkFRICYgQ2jDrW5oIHPDoWNoPC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9vdGVyXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgcEJ1dHRvblxuICAgICAgICAgICAgbGFiZWw9XCLEkGkgxJHhur9uIHTDoGkga2hv4bqjblwiXG4gICAgICAgICAgICBjbGFzcz1cInAtYnV0dG9uLXJhaXNlZCBwLWJ1dHRvbi1sZ1wiXG4gICAgICAgICAgPjwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvcC1kcmF3ZXI+XG4gIDwvZGl2PlxuPC9kaXY+XG4iLCJleHBvcnQgY2xhc3MgVXNlciB7XG4gIHB1YmxpYyBpZDogc3RyaW5nO1xuICBwdWJsaWMgdXNlcm5hbWU6IHN0cmluZztcbiAgcHVibGljIGVtYWlsOiBzdHJpbmc7XG4gIHB1YmxpYyByb2xlOiBzdHJpbmdbXTtcbiAgcHVibGljIGF1dGhTdGF0dXM6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpZD86IHN0cmluZyxcbiAgICB1c2VybmFtZT86IHN0cmluZyxcbiAgICBlbWFpbD86IHN0cmluZyxcbiAgICByb2xlPzogc3RyaW5nW10sXG4gICAgYXV0aFN0YXR1cz86IHN0cmluZ1xuICApIHtcbiAgICB0aGlzLnJvbGUgPSByb2xlIHx8IFtdO1xuICAgIHRoaXMuYXV0aFN0YXR1cyA9IGF1dGhTdGF0dXMgfHwgJyc7XG4gICAgdGhpcy5pZCA9IGlkIHx8ICcnO1xuICAgIHRoaXMudXNlcm5hbWUgPSB1c2VybmFtZSB8fCAnJztcbiAgICB0aGlzLmVtYWlsID0gZW1haWwgfHwgJyc7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQnV0dG9uTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9idXR0b24nO1xuaW1wb3J0IHsgRGl2aWRlck1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvZGl2aWRlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1mb290ZXInLFxuICBpbXBvcnRzOiBbQnV0dG9uTW9kdWxlLCBEaXZpZGVyTW9kdWxlXSxcbiAgdGVtcGxhdGVVcmw6ICcuL2Zvb3Rlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsOiAnLi9mb290ZXIuY29tcG9uZW50LnNjc3MnLFxufSlcbmV4cG9ydCBjbGFzcyBGb290ZXJDb21wb25lbnQge31cbiIsIjxkaXYgY2xhc3M9XCJmb290ZXJcIj5cbiAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cbiAgICA8IS0tIFRvcCBzZWN0aW9uIC0tPlxuICAgIDxkaXYgY2xhc3M9XCJ0b3Atc2VjdGlvblwiPlxuICAgICAgPCEtLSBMZWZ0IHNpZGUgLSBTbG9nYW4gYW5kIGZvcm0gLS0+XG4gICAgICA8ZGl2IGNsYXNzPVwiYnJhbmQtbWVzc2FnZVwiPlxuICAgICAgICA8cCBjbGFzcz1cInRpdGxlLWZvb3RlclwiPjRNQU4gRkFTVEVDSCBsdcO0biBs4bqvbmcgbmdoZSBi4bqhbiE8L3A+XG4gICAgICAgIDxwPlxuICAgICAgICAgIENow7puZyB0w7RpIGx1w7RuIHRyw6JuIHRy4buNbmcgdsOgIG1vbmcgxJHhu6NpIG5o4bqtbiDEkcaw4bujYyBt4buNaSDDvSBraeG6v24gxJHDs25nIGfDs3AgdOG7q1xuICAgICAgICAgIGtow6FjaCBow6BuZyDEkeG7gyBjw7MgdGjhu4MgbsOibmcgY+G6pXAgdHLhuqNpIG5naGnhu4dtIGThu4tjaCB24bulIHbDoCBz4bqjbiBwaOG6qW0gdOG7kXQgaMahblxuICAgICAgICAgIG7hu69hLlxuICAgICAgICA8L3A+XG4gICAgICAgIDxidXR0b24+XG4gICAgICAgICAgxJDDk05HIEfDk1Agw50gS0nhur5OXG4gICAgICAgICAgPGkgY2xhc3M9XCJwaSBwaS1hcnJvdy1yaWdodFwiPjwvaT5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPCEtLSBSaWdodCBzaWRlIC0gQ29udGFjdCBpbmZvIC0tPlxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3RcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtaW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWJsb2NrXCI+XG4gICAgICAgICAgICA8cCBjbGFzcz1cImxhYmVsXCI+SG90bGluZTwvcD5cbiAgICAgICAgICAgIDxwPjE5MDAuMjcyNzM3IC0gMDI4Ljc3NzcuMjczNzwvcD5cbiAgICAgICAgICAgIDxwPig4OjMwIC0gMjI6MDApPC9wPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtYmxvY2tcIj5cbiAgICAgICAgICAgIDxoMyBjbGFzcz1cImxhYmVsXCI+RW1haWw8L2gzPlxuICAgICAgICAgICAgPHA+Q29vbGNvb2xtYXRlLm1lPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzPVwic29jaWFsLWxpbmtzXCI+XG4gICAgICAgIDxhIGhyZWY9XCIjXCI+PGkgY2xhc3M9XCJwaSBwaS1mYWNlYm9va1wiPjwvaT48L2E+XG4gICAgICAgIDxhIGhyZWY9XCIjXCI+PGkgY2xhc3M9XCJwaSBwaS15b3V0dWJlXCI+PC9pPjwvYT5cbiAgICAgICAgPGEgaHJlZj1cIiNcIj48aSBjbGFzcz1cInBpIHBpLWluc3RhZ3JhbVwiPjwvaT48L2E+XG4gICAgICAgIDxhIGhyZWY9XCIjXCI+PGkgY2xhc3M9XCJwaSBwaS10d2l0dGVyXCI+PC9pPjwvYT5cbiAgICAgICAgPGEgaHJlZj1cIiNcIj48aSBjbGFzcz1cInBpIHBpLXRpa3Rva1wiPjwvaT48L2E+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxwLWRpdmlkZXI+PC9wLWRpdmlkZXI+XG5cbiAgICA8IS0tIE1pZGRsZSBzZWN0aW9uIC0gTGlua3MgLS0+XG4gICAgPGRpdiBjbGFzcz1cImZvb3Rlci1saW5rc1wiPlxuICAgICAgPCEtLSBDT09MQ0xVQiAtLT5cbiAgICAgIDxkaXYgY2xhc3M9XCJmb290ZXItc2VjdGlvblwiPlxuICAgICAgICA8aDMgY2xhc3M9XCJsYWJlbFwiPkNPT0xDTFVCPC9oMz5cbiAgICAgICAgPHVsPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPlTDoGkga2hv4bqjbiBDb29sQ2x1YjwvYT48L2xpPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPsavdSDEkcOjaSAmIMSQ4bq3YyBxdXnhu4FuPC9hPjwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPCEtLSBDSMONTkggU8OBQ0ggLS0+XG4gICAgICA8ZGl2IGNsYXNzPVwiZm9vdGVyLXNlY3Rpb25cIj5cbiAgICAgICAgPGgzIGNsYXNzPVwibGFiZWxcIj5DSMONTkggU8OBQ0g8L2gzPlxuICAgICAgICA8dWw+XG4gICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+Q2jDrW5oIHPDoWNoIMSR4buVaSB0cuG6oyA2MCBuZ8OgeTwvYT48L2xpPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkNow61uaCBzw6FjaCBi4bqjbyBt4bqtdDwvYT48L2xpPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkNow61uaCBzw6FjaCBnaWFvIGjDoG5nPC9hPjwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPCEtLSBDSMSCTSBTw5NDIEtIw4FDSCBIw4BORyAtLT5cbiAgICAgIDxkaXYgY2xhc3M9XCJmb290ZXItc2VjdGlvblwiPlxuICAgICAgICA8aDMgY2xhc3M9XCJsYWJlbFwiPkNIxIJNIFPDk0MgS0jDgUNIIEjDgE5HPC9oMz5cbiAgICAgICAgPHVsPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPlRy4bqjaSBuZ2hp4buHbSBtdWEgc+G6r20gMTAwJSBow6BpIGzDsm5nPC9hPjwvbGk+XG4gICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+SOG7j2kgxJHDoXAgLSBGQVFzPC9hPjwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPCEtLSBW4buAIENPT0xNQVRFIC0tPlxuICAgICAgPGRpdiBjbGFzcz1cImZvb3Rlci1zZWN0aW9uXCI+XG4gICAgICAgIDxoMyBjbGFzcz1cImxhYmVsXCI+VuG7gCBDT09MTUFURTwvaDM+XG4gICAgICAgIDx1bD5cbiAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5HaeG7m2kgdGhp4buHdSB24buBIDRNYW4gRmFzaGlvbjwvYT48L2xpPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkRWS0ggeHXhuqV0IHPhuq9jPC9hPjwvbGk+XG4gICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+TmjDoCBtw6F5PC9hPjwvbGk+XG4gICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+Q2FtIGvhur90IGLhu4FuIHbhu69uZzwvYT48L2xpPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPlThuqdtIG5ow6xuIDIwMzA8L2E+PC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8IS0tIMSQ4buKQSBDSOG7iCBMScOKTiBI4buGIC0tPlxuICAgICAgPGRpdiBjbGFzcz1cImZvb3Rlci1zZWN0aW9uXCI+XG4gICAgICAgIDxoMyBjbGFzcz1cImxhYmVsXCI+xJDhu4pBIENI4buIIExJw4pOIEjhu4Y8L2gzPlxuICAgICAgICA8dWwgY2xhc3M9XCJhZGRyZXNzLWxpc3RcIj5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICBUcnVuZyB0w6JtIHjhu60gbMO9IMSRxqFuIGjDoG5nOiBLaG8gNE1hbiBGYXNoaW9uLCBUaMO0biBBbiBLaMOhbmgsIFjDoyBOZ+G7jWNcbiAgICAgICAgICAgIFThuqNvLCBodXnhu4duIFBow7pjIFRo4buNLCBUUC5Iw6AgTuG7mWlcbiAgICAgICAgICA8L2xpPlxuXG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgQ+G7rWEgaMOgbmc6IDRNYW4gRmFzaGlvbiwgVGjDtG4gVMOhbyAzLCBYw6MgVGFtIFRodeG6pW4sIGh1eeG7h24gUGjDumMgVGjhu40sXG4gICAgICAgICAgICBUUC5Iw6AgTuG7mWlcbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8IS0tIEJvdHRvbSBzZWN0aW9uIC0gQ29weXJpZ2h0IC0tPlxuICAgIDxwLWRpdmlkZXI+PC9wLWRpdmlkZXI+XG5cbiAgICA8ZGl2IGNsYXNzPVwiY29weXJpZ2h0XCI+XG4gICAgICA8cD7CqSA0TUFOIEZBU0hJT048L3A+XG5cbiAgICAgIDxkaXYgY2xhc3M9XCJjZXJ0aWZpY2F0ZXNcIj5cbiAgICAgICAgPGltZyBzcmM9XCJhc3NldHMvaW1hZ2VzL2RtY2EucG5nXCIgYWx0PVwiRE1DQVwiIC8+XG4gICAgICAgIDxpbWcgc3JjPVwiYXNzZXRzL2ltYWdlcy9uY3NjLnBuZ1wiIGFsdD1cIlNTTFwiIC8+XG4gICAgICAgIDxpbWcgc3JjPVwiYXNzZXRzL2ltYWdlcy92ZXJpZmllZC5wbmdcIiBhbHQ9XCJWZXJpZmllZFwiIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj5cbiIsImltcG9ydCB7IFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBMb2dpbkNvbXBvbmVudCB9IGZyb20gJy4vZmVhdHVyZXMvbG9naW4vbG9naW4uY29tcG9uZW50JztcbmltcG9ydCB7IEhvbWVDb21wb25lbnQgfSBmcm9tICcuL3BhZ2VzL2hvbWUvaG9tZS5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3Qgcm91dGVzOiBSb3V0ZXMgPSBbXG4gIHsgcGF0aDogJycsIHJlZGlyZWN0VG86ICcvaG9tZScsIHBhdGhNYXRjaDogJ2Z1bGwnIH0sXG4gIHsgcGF0aDogJ2hvbWUnLCBjb21wb25lbnQ6IEhvbWVDb21wb25lbnQgfSxcbiAgeyBwYXRoOiAnbG9naW4nLCBjb21wb25lbnQ6IExvZ2luQ29tcG9uZW50IH0sXG5dO1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXJPdXRsZXQgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtcm9vdCcsXG4gIGltcG9ydHM6IFtSb3V0ZXJPdXRsZXRdLFxuICB0ZW1wbGF0ZVVybDogJy4vYXBwLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmw6ICcuL2FwcC5jb21wb25lbnQuc2NzcycsXG59KVxuZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XG4gIHRpdGxlID0gJ2Zyb250ZW5kJztcbn1cbiIsIjxyb3V0ZXItb3V0bGV0Pjwvcm91dGVyLW91dGxldD5cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsU0FBUyw0QkFBNEI7OztBQ0FyQyxTQUVFLDRCQUNBLHVCQUNLO0FBQ1AsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyw4QkFBOEI7QUFDdkMsU0FBUyxrQkFBQUEsdUJBQXNCO0FBQy9CLFNBRUUsMkJBQ0EsbUJBQUFDLHdCQUNLO0FBRVAsT0FBT0MsV0FBVTtBQUNqQixTQUFTLHlCQUF5Qjs7O0FDZmxDLFNBQVMsaUJBQWlCOztBQVFwQixJQUFPLGlCQUFQLE1BQU8sZ0JBQWM7O3FDQUFkLGlCQUFjO0VBQUE7NEVBQWQsaUJBQWMsV0FBQSxDQUFBLENBQUEsV0FBQSxDQUFBLEdBQUEsT0FBQSxHQUFBLE1BQUEsR0FBQSxVQUFBLFNBQUEsd0JBQUEsSUFBQSxLQUFBO0FBQUEsUUFBQSxLQUFBLEdBQUE7QUNSM0IsTUFBQSw0QkFBQSxHQUFBLEdBQUE7QUFB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LFNBQVM7O0lBRTdCLHlCQUF5QjtHQUMxQjtBQUNMO0FBRU8sSUFBTSxZQUErQjtFQUMxQyxXQUFXO0lBQ1Q7TUFDRSxTQUFTO01BQ1QsWUFBWTtNQUNaLE9BQU87TUFDUCxNQUFNLENBQUNDLGdCQUFlOztJQUV4QkE7SUFDQTtNQUNFLFNBQVM7TUFDVCxVQUFVO01BQ1YsT0FBTzs7SUFFVCwyQkFBMkIsRUFBRSxpQkFBaUIsS0FBSSxDQUFFO0lBQ3BELGNBQWMsTUFBTTtJQUNwQix1QkFBdUIsZ0JBQWUsQ0FBRTtJQUN4Qyx1QkFBc0I7SUFDdEJDLGdCQUFlO01BQ2IsUUFBUTtNQUNSLE9BQU87UUFDTCxRQUFRQzs7S0FFWDs7Ozs7QVkvREwsU0FBUyxhQUFBQyxrQkFBaUI7QUFDMUIsU0FBUyxnQkFBQUMscUJBQW9COztBQVF2QixJQUFPLGVBQVAsTUFBTyxjQUFZO0VBQ3ZCLFFBQVE7O3FDQURHLGVBQVk7RUFBQTs2RUFBWixlQUFZLFdBQUEsQ0FBQSxDQUFBLFVBQUEsQ0FBQSxHQUFBLE9BQUEsR0FBQSxNQUFBLEdBQUEsVUFBQSxTQUFBLHNCQUFBLElBQUEsS0FBQTtBQUFBLFFBQUEsS0FBQSxHQUFBO0FDVHpCLE1BQUEsd0JBQUEsR0FBQSxlQUFBOztvQkRLWUEsYUFBWSxHQUFBLGVBQUEsRUFBQSxDQUFBOzs7aUZBSVgsY0FBWSxFQUFBLFdBQUEsZ0JBQUEsVUFBQSw0QkFBQSxZQUFBLEdBQUEsQ0FBQTtBQUFBLEdBQUE7Ozs7Ozs7K0RBQVosY0FBWSxFQUFBLFNBQUEsQ0FBQUMsR0FBQSxHQUFBLENBQUFELGFBQUEsR0FBQSxhQUFBLEVBQUEsQ0FBQTtFQUFBO0FBQUEsR0FBQSxPQUFBLGNBQUEsZUFBQSxjQUFBLHFCQUFBLEtBQUEsSUFBQSxDQUFBO0FBQUEsR0FBQSxPQUFBLGNBQUEsZUFBQSxlQUFBLFlBQUEsT0FBQSxZQUFBLElBQUEsR0FBQSw0QkFBQSxPQUFBLEVBQUEsT0FBQSxNQUFBLHFCQUFBLEVBQUEsU0FBQSxDQUFBO0FBQUEsR0FBQTs7O0FiTHpCLHFCQUFxQixjQUFjLFNBQVMsRUFDekMsTUFBTSxDQUFDLFFBQVEsUUFBUSxNQUFNLEdBQUcsQ0FBQzsiLCJuYW1lcyI6WyJwcm92aWRlUHJpbWVORyIsIktleWNsb2FrU2VydmljZSIsIkF1cmEiLCJDb21wb25lbnQiLCJDb21wb25lbnQiLCJpMCIsIkNvbXBvbmVudCIsIkJ1dHRvbk1vZHVsZSIsIkRpdmlkZXJNb2R1bGUiLCJpMCIsImkxIiwiaTIiLCJpMyIsImkwIiwiS2V5Y2xvYWtTZXJ2aWNlIiwicHJvdmlkZVByaW1lTkciLCJBdXJhIiwiQ29tcG9uZW50IiwiUm91dGVyT3V0bGV0IiwiaTAiXX0=