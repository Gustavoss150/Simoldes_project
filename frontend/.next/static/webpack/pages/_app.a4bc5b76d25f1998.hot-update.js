"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/_app",{

/***/ "(pages-dir-browser)/./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[7].oneOf[13].use[1]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[7].oneOf[13].use[2]!./styles/styles.css":
/*!*********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[7].oneOf[13].use[1]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[7].oneOf[13].use[2]!./styles/styles.css ***!
  \*********************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_next_dist_build_webpack_loaders_css_loader_src_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/next/dist/build/webpack/loaders/css-loader/src/runtime/api.js */ \"(pages-dir-browser)/./node_modules/next/dist/build/webpack/loaders/css-loader/src/runtime/api.js\");\n/* harmony import */ var _node_modules_next_dist_build_webpack_loaders_css_loader_src_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_next_dist_build_webpack_loaders_css_loader_src_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);\n// Imports\n\nvar ___CSS_LOADER_EXPORT___ = _node_modules_next_dist_build_webpack_loaders_css_loader_src_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(true);\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, \"/* Resetando margens */\\r\\n* {\\r\\n    margin: 0;\\r\\n    padding: 0;\\r\\n    box-sizing: border-box;\\r\\n  }\\r\\n  \\r\\n  /* Corpo da página */\\r\\n  body {\\r\\n    padding: 30px;\\r\\n    background-color: #c5dfc7;\\r\\n    font-family: \\\"Josefin Sans\\\", sans-serif;\\r\\n    color: rgb(73, 73, 73);\\r\\n    display: flex;\\r\\n    flex-direction: column;\\r\\n    height: 100vh;\\r\\n  }\\r\\n  \\r\\n  /* Navbar */\\r\\n  .navbar {\\r\\n    background-color: #267a40;\\r\\n    padding: 15px 0;\\r\\n    text-align: center;\\r\\n    width: 100%;\\r\\n    position: fixed;\\r\\n    top: 0;\\r\\n    left: 0;\\r\\n    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);\\r\\n  }\\r\\n  \\r\\n  .navbar h1 {\\r\\n    color: white;\\r\\n    font-size: 24px;\\r\\n    font-weight: bold;\\r\\n  }\\r\\n  \\r\\n  /* Layout dividido */\\r\\n  .container {\\r\\n    display: flex;\\r\\n    flex: 1 1;\\r\\n    height: 100vh;\\r\\n    align-items: center;\\r\\n    justify-content: center;\\r\\n    padding-top: 60px; /* Para não sobrepor a Navbar */\\r\\n  }\\r\\n  \\r\\n  /* Esquerda (Título e descrição) */\\r\\n  .left {\\r\\n    flex: 1 1;\\r\\n    text-align: center;\\r\\n    padding: 20px;\\r\\n    display: flex;\\r\\n    flex-direction: column;\\r\\n    align-items: center;\\r\\n    justify-content: center;\\r\\n  }\\r\\n  \\r\\n  .left h1 {\\r\\n    font-size: 40px;\\r\\n    color: #267a40;\\r\\n  }\\r\\n  \\r\\n  .left p {\\r\\n    font-size: 20px;\\r\\n    margin-top: 10px;\\r\\n  }\\r\\n  \\r\\n  /* Direita (Login e Cadastro) */\\r\\n  .right {\\r\\n    flex: 1 1;\\r\\n    display: flex;\\r\\n    flex-direction: column;\\r\\n    align-items: center;\\r\\n    justify-content: center;\\r\\n  }\\r\\n  \\r\\n  /* Botões alinhados verticalmente */\\r\\n  .buttons {\\r\\n    display: flex;\\r\\n    flex-direction: column;\\r\\n    gap: 20px;\\r\\n  }\\r\\n  \\r\\n  /* Botões */\\r\\n  .btn {\\r\\n    font-size: 20px;\\r\\n    text-decoration: none;\\r\\n    background-color: #267a40;\\r\\n    color: white;\\r\\n    padding: 15px 30px;\\r\\n    border-radius: 5px;\\r\\n    border: none;\\r\\n    cursor: pointer;\\r\\n    transition: 0.3s;\\r\\n  }\\r\\n  \\r\\n  .btn:hover {\\r\\n    background-color: #2b6b5f;\\r\\n  }\\r\\n  \", \"\",{\"version\":3,\"sources\":[\"webpack://styles/styles.css\"],\"names\":[],\"mappings\":\"AAAA,sBAAsB;AACtB;IACI,SAAS;IACT,UAAU;IACV,sBAAsB;EACxB;;EAEA,oBAAoB;EACpB;IACE,aAAa;IACb,yBAAyB;IACzB,uCAAuC;IACvC,sBAAsB;IACtB,aAAa;IACb,sBAAsB;IACtB,aAAa;EACf;;EAEA,WAAW;EACX;IACE,yBAAyB;IACzB,eAAe;IACf,kBAAkB;IAClB,WAAW;IACX,eAAe;IACf,MAAM;IACN,OAAO;IACP,0CAA0C;EAC5C;;EAEA;IACE,YAAY;IACZ,eAAe;IACf,iBAAiB;EACnB;;EAEA,oBAAoB;EACpB;IACE,aAAa;IACb,SAAO;IACP,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,iBAAiB,EAAE,+BAA+B;EACpD;;EAEA,kCAAkC;EAClC;IACE,SAAO;IACP,kBAAkB;IAClB,aAAa;IACb,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;EACzB;;EAEA;IACE,eAAe;IACf,cAAc;EAChB;;EAEA;IACE,eAAe;IACf,gBAAgB;EAClB;;EAEA,+BAA+B;EAC/B;IACE,SAAO;IACP,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;EACzB;;EAEA,mCAAmC;EACnC;IACE,aAAa;IACb,sBAAsB;IACtB,SAAS;EACX;;EAEA,WAAW;EACX;IACE,eAAe;IACf,qBAAqB;IACrB,yBAAyB;IACzB,YAAY;IACZ,kBAAkB;IAClB,kBAAkB;IAClB,YAAY;IACZ,eAAe;IACf,gBAAgB;EAClB;;EAEA;IACE,yBAAyB;EAC3B\",\"sourcesContent\":[\"/* Resetando margens */\\r\\n* {\\r\\n    margin: 0;\\r\\n    padding: 0;\\r\\n    box-sizing: border-box;\\r\\n  }\\r\\n  \\r\\n  /* Corpo da página */\\r\\n  body {\\r\\n    padding: 30px;\\r\\n    background-color: #c5dfc7;\\r\\n    font-family: \\\"Josefin Sans\\\", sans-serif;\\r\\n    color: rgb(73, 73, 73);\\r\\n    display: flex;\\r\\n    flex-direction: column;\\r\\n    height: 100vh;\\r\\n  }\\r\\n  \\r\\n  /* Navbar */\\r\\n  .navbar {\\r\\n    background-color: #267a40;\\r\\n    padding: 15px 0;\\r\\n    text-align: center;\\r\\n    width: 100%;\\r\\n    position: fixed;\\r\\n    top: 0;\\r\\n    left: 0;\\r\\n    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);\\r\\n  }\\r\\n  \\r\\n  .navbar h1 {\\r\\n    color: white;\\r\\n    font-size: 24px;\\r\\n    font-weight: bold;\\r\\n  }\\r\\n  \\r\\n  /* Layout dividido */\\r\\n  .container {\\r\\n    display: flex;\\r\\n    flex: 1;\\r\\n    height: 100vh;\\r\\n    align-items: center;\\r\\n    justify-content: center;\\r\\n    padding-top: 60px; /* Para não sobrepor a Navbar */\\r\\n  }\\r\\n  \\r\\n  /* Esquerda (Título e descrição) */\\r\\n  .left {\\r\\n    flex: 1;\\r\\n    text-align: center;\\r\\n    padding: 20px;\\r\\n    display: flex;\\r\\n    flex-direction: column;\\r\\n    align-items: center;\\r\\n    justify-content: center;\\r\\n  }\\r\\n  \\r\\n  .left h1 {\\r\\n    font-size: 40px;\\r\\n    color: #267a40;\\r\\n  }\\r\\n  \\r\\n  .left p {\\r\\n    font-size: 20px;\\r\\n    margin-top: 10px;\\r\\n  }\\r\\n  \\r\\n  /* Direita (Login e Cadastro) */\\r\\n  .right {\\r\\n    flex: 1;\\r\\n    display: flex;\\r\\n    flex-direction: column;\\r\\n    align-items: center;\\r\\n    justify-content: center;\\r\\n  }\\r\\n  \\r\\n  /* Botões alinhados verticalmente */\\r\\n  .buttons {\\r\\n    display: flex;\\r\\n    flex-direction: column;\\r\\n    gap: 20px;\\r\\n  }\\r\\n  \\r\\n  /* Botões */\\r\\n  .btn {\\r\\n    font-size: 20px;\\r\\n    text-decoration: none;\\r\\n    background-color: #267a40;\\r\\n    color: white;\\r\\n    padding: 15px 30px;\\r\\n    border-radius: 5px;\\r\\n    border: none;\\r\\n    cursor: pointer;\\r\\n    transition: 0.3s;\\r\\n  }\\r\\n  \\r\\n  .btn:hover {\\r\\n    background-color: #2b6b5f;\\r\\n  }\\r\\n  \"],\"sourceRoot\":\"\"}]);\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvYnVpbGQvd2VicGFjay9sb2FkZXJzL2Nzcy1sb2FkZXIvc3JjL2luZGV4LmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzddLm9uZU9mWzEzXS51c2VbMV0hLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9wb3N0Y3NzLWxvYWRlci9zcmMvaW5kZXguanM/P3J1bGVTZXRbMV0ucnVsZXNbN10ub25lT2ZbMTNdLnVzZVsyXSEuL3N0eWxlcy9zdHlsZXMuY3NzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ3dIO0FBQ3hILDhCQUE4QixrSEFBMkI7QUFDekQ7QUFDQSx3RUFBd0Usa0JBQWtCLG1CQUFtQiwrQkFBK0IsT0FBTyw2Q0FBNkMsc0JBQXNCLGtDQUFrQyxrREFBa0QsK0JBQStCLHNCQUFzQiwrQkFBK0Isc0JBQXNCLE9BQU8sdUNBQXVDLGtDQUFrQyx3QkFBd0IsMkJBQTJCLG9CQUFvQix3QkFBd0IsZUFBZSxnQkFBZ0IsbURBQW1ELE9BQU8sd0JBQXdCLHFCQUFxQix3QkFBd0IsMEJBQTBCLE9BQU8sbURBQW1ELHNCQUFzQixrQkFBa0Isc0JBQXNCLDRCQUE0QixnQ0FBZ0MsMkJBQTJCLHVDQUF1Qyw0REFBNEQsa0JBQWtCLDJCQUEyQixzQkFBc0Isc0JBQXNCLCtCQUErQiw0QkFBNEIsZ0NBQWdDLE9BQU8sc0JBQXNCLHdCQUF3Qix1QkFBdUIsT0FBTyxxQkFBcUIsd0JBQXdCLHlCQUF5QixPQUFPLDBEQUEwRCxrQkFBa0Isc0JBQXNCLCtCQUErQiw0QkFBNEIsZ0NBQWdDLE9BQU8sZ0VBQWdFLHNCQUFzQiwrQkFBK0Isa0JBQWtCLE9BQU8sb0NBQW9DLHdCQUF3Qiw4QkFBOEIsa0NBQWtDLHFCQUFxQiwyQkFBMkIsMkJBQTJCLHFCQUFxQix3QkFBd0IseUJBQXlCLE9BQU8sd0JBQXdCLGtDQUFrQyxPQUFPLGFBQWEseUZBQXlGLE1BQU0sVUFBVSxVQUFVLFlBQVksT0FBTyxZQUFZLE1BQU0sVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksV0FBVyxNQUFNLFVBQVUsS0FBSyxZQUFZLFdBQVcsWUFBWSxXQUFXLFVBQVUsVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLE9BQU8sWUFBWSxNQUFNLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSx5QkFBeUIsT0FBTyxZQUFZLE1BQU0sVUFBVSxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxZQUFZLE1BQU0sVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sWUFBWSxNQUFNLFVBQVUsWUFBWSxXQUFXLE1BQU0sVUFBVSxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLHdEQUF3RCxrQkFBa0IsbUJBQW1CLCtCQUErQixPQUFPLDZDQUE2QyxzQkFBc0Isa0NBQWtDLGtEQUFrRCwrQkFBK0Isc0JBQXNCLCtCQUErQixzQkFBc0IsT0FBTyx1Q0FBdUMsa0NBQWtDLHdCQUF3QiwyQkFBMkIsb0JBQW9CLHdCQUF3QixlQUFlLGdCQUFnQixtREFBbUQsT0FBTyx3QkFBd0IscUJBQXFCLHdCQUF3QiwwQkFBMEIsT0FBTyxtREFBbUQsc0JBQXNCLGdCQUFnQixzQkFBc0IsNEJBQTRCLGdDQUFnQywyQkFBMkIsdUNBQXVDLDREQUE0RCxnQkFBZ0IsMkJBQTJCLHNCQUFzQixzQkFBc0IsK0JBQStCLDRCQUE0QixnQ0FBZ0MsT0FBTyxzQkFBc0Isd0JBQXdCLHVCQUF1QixPQUFPLHFCQUFxQix3QkFBd0IseUJBQXlCLE9BQU8sMERBQTBELGdCQUFnQixzQkFBc0IsK0JBQStCLDRCQUE0QixnQ0FBZ0MsT0FBTyxnRUFBZ0Usc0JBQXNCLCtCQUErQixrQkFBa0IsT0FBTyxvQ0FBb0Msd0JBQXdCLDhCQUE4QixrQ0FBa0MscUJBQXFCLDJCQUEyQiwyQkFBMkIscUJBQXFCLHdCQUF3Qix5QkFBeUIsT0FBTyx3QkFBd0Isa0NBQWtDLE9BQU8seUJBQXlCO0FBQzFoSztBQUNBLGlFQUFlLHVCQUF1QixFQUFDIiwic291cmNlcyI6WyJDOlxcc2ltb2xkZXMtcHJvamVjdFxcZnJvbnRlbmRcXHN0eWxlc1xcc3R5bGVzLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9jc3MtbG9hZGVyL3NyYy9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKHRydWUpO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiLyogUmVzZXRhbmRvIG1hcmdlbnMgKi9cXHJcXG4qIHtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBwYWRkaW5nOiAwO1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKiBDb3JwbyBkYSBww6FnaW5hICovXFxyXFxuICBib2R5IHtcXHJcXG4gICAgcGFkZGluZzogMzBweDtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2M1ZGZjNztcXHJcXG4gICAgZm9udC1mYW1pbHk6IFxcXCJKb3NlZmluIFNhbnNcXFwiLCBzYW5zLXNlcmlmO1xcclxcbiAgICBjb2xvcjogcmdiKDczLCA3MywgNzMpO1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBoZWlnaHQ6IDEwMHZoO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKiBOYXZiYXIgKi9cXHJcXG4gIC5uYXZiYXIge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjY3YTQwO1xcclxcbiAgICBwYWRkaW5nOiAxNXB4IDA7XFxyXFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXHJcXG4gICAgdG9wOiAwO1xcclxcbiAgICBsZWZ0OiAwO1xcclxcbiAgICBib3gtc2hhZG93OiAwcHggNHB4IDZweCByZ2JhKDAsIDAsIDAsIDAuMSk7XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC5uYXZiYXIgaDEge1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGZvbnQtc2l6ZTogMjRweDtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qIExheW91dCBkaXZpZGlkbyAqL1xcclxcbiAgLmNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXg6IDEgMTtcXHJcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIHBhZGRpbmctdG9wOiA2MHB4OyAvKiBQYXJhIG7Do28gc29icmVwb3IgYSBOYXZiYXIgKi9cXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyogRXNxdWVyZGEgKFTDrXR1bG8gZSBkZXNjcmnDp8OjbykgKi9cXHJcXG4gIC5sZWZ0IHtcXHJcXG4gICAgZmxleDogMSAxO1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxuICAgIHBhZGRpbmc6IDIwcHg7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAubGVmdCBoMSB7XFxyXFxuICAgIGZvbnQtc2l6ZTogNDBweDtcXHJcXG4gICAgY29sb3I6ICMyNjdhNDA7XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC5sZWZ0IHAge1xcclxcbiAgICBmb250LXNpemU6IDIwcHg7XFxyXFxuICAgIG1hcmdpbi10b3A6IDEwcHg7XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qIERpcmVpdGEgKExvZ2luIGUgQ2FkYXN0cm8pICovXFxyXFxuICAucmlnaHQge1xcclxcbiAgICBmbGV4OiAxIDE7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKiBCb3TDtWVzIGFsaW5oYWRvcyB2ZXJ0aWNhbG1lbnRlICovXFxyXFxuICAuYnV0dG9ucyB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGdhcDogMjBweDtcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyogQm90w7VlcyAqL1xcclxcbiAgLmJ0biB7XFxyXFxuICAgIGZvbnQtc2l6ZTogMjBweDtcXHJcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjY3YTQwO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIHBhZGRpbmc6IDE1cHggMzBweDtcXHJcXG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xcclxcbiAgICBib3JkZXI6IG5vbmU7XFxyXFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXHJcXG4gICAgdHJhbnNpdGlvbjogMC4zcztcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLmJ0bjpob3ZlciB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMyYjZiNWY7XFxyXFxuICB9XFxyXFxuICBcIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vc3R5bGVzL3N0eWxlcy5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsc0JBQXNCO0FBQ3RCO0lBQ0ksU0FBUztJQUNULFVBQVU7SUFDVixzQkFBc0I7RUFDeEI7O0VBRUEsb0JBQW9CO0VBQ3BCO0lBQ0UsYUFBYTtJQUNiLHlCQUF5QjtJQUN6Qix1Q0FBdUM7SUFDdkMsc0JBQXNCO0lBQ3RCLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsYUFBYTtFQUNmOztFQUVBLFdBQVc7RUFDWDtJQUNFLHlCQUF5QjtJQUN6QixlQUFlO0lBQ2Ysa0JBQWtCO0lBQ2xCLFdBQVc7SUFDWCxlQUFlO0lBQ2YsTUFBTTtJQUNOLE9BQU87SUFDUCwwQ0FBMEM7RUFDNUM7O0VBRUE7SUFDRSxZQUFZO0lBQ1osZUFBZTtJQUNmLGlCQUFpQjtFQUNuQjs7RUFFQSxvQkFBb0I7RUFDcEI7SUFDRSxhQUFhO0lBQ2IsU0FBTztJQUNQLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLGlCQUFpQixFQUFFLCtCQUErQjtFQUNwRDs7RUFFQSxrQ0FBa0M7RUFDbEM7SUFDRSxTQUFPO0lBQ1Asa0JBQWtCO0lBQ2xCLGFBQWE7SUFDYixhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLG1CQUFtQjtJQUNuQix1QkFBdUI7RUFDekI7O0VBRUE7SUFDRSxlQUFlO0lBQ2YsY0FBYztFQUNoQjs7RUFFQTtJQUNFLGVBQWU7SUFDZixnQkFBZ0I7RUFDbEI7O0VBRUEsK0JBQStCO0VBQy9CO0lBQ0UsU0FBTztJQUNQLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLHVCQUF1QjtFQUN6Qjs7RUFFQSxtQ0FBbUM7RUFDbkM7SUFDRSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLFNBQVM7RUFDWDs7RUFFQSxXQUFXO0VBQ1g7SUFDRSxlQUFlO0lBQ2YscUJBQXFCO0lBQ3JCLHlCQUF5QjtJQUN6QixZQUFZO0lBQ1osa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUNsQixZQUFZO0lBQ1osZUFBZTtJQUNmLGdCQUFnQjtFQUNsQjs7RUFFQTtJQUNFLHlCQUF5QjtFQUMzQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBSZXNldGFuZG8gbWFyZ2VucyAqL1xcclxcbioge1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qIENvcnBvIGRhIHDDoWdpbmEgKi9cXHJcXG4gIGJvZHkge1xcclxcbiAgICBwYWRkaW5nOiAzMHB4O1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjYzVkZmM3O1xcclxcbiAgICBmb250LWZhbWlseTogXFxcIkpvc2VmaW4gU2Fuc1xcXCIsIHNhbnMtc2VyaWY7XFxyXFxuICAgIGNvbG9yOiByZ2IoNzMsIDczLCA3Myk7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogMTAwdmg7XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qIE5hdmJhciAqL1xcclxcbiAgLm5hdmJhciB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMyNjdhNDA7XFxyXFxuICAgIHBhZGRpbmc6IDE1cHggMDtcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcclxcbiAgICB0b3A6IDA7XFxyXFxuICAgIGxlZnQ6IDA7XFxyXFxuICAgIGJveC1zaGFkb3c6IDBweCA0cHggNnB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLm5hdmJhciBoMSB7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgZm9udC1zaXplOiAyNHB4O1xcclxcbiAgICBmb250LXdlaWdodDogYm9sZDtcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyogTGF5b3V0IGRpdmlkaWRvICovXFxyXFxuICAuY29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleDogMTtcXHJcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIHBhZGRpbmctdG9wOiA2MHB4OyAvKiBQYXJhIG7Do28gc29icmVwb3IgYSBOYXZiYXIgKi9cXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyogRXNxdWVyZGEgKFTDrXR1bG8gZSBkZXNjcmnDp8OjbykgKi9cXHJcXG4gIC5sZWZ0IHtcXHJcXG4gICAgZmxleDogMTtcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcclxcbiAgICBwYWRkaW5nOiAyMHB4O1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLmxlZnQgaDEge1xcclxcbiAgICBmb250LXNpemU6IDQwcHg7XFxyXFxuICAgIGNvbG9yOiAjMjY3YTQwO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAubGVmdCBwIHtcXHJcXG4gICAgZm9udC1zaXplOiAyMHB4O1xcclxcbiAgICBtYXJnaW4tdG9wOiAxMHB4O1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKiBEaXJlaXRhIChMb2dpbiBlIENhZGFzdHJvKSAqL1xcclxcbiAgLnJpZ2h0IHtcXHJcXG4gICAgZmxleDogMTtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qIEJvdMO1ZXMgYWxpbmhhZG9zIHZlcnRpY2FsbWVudGUgKi9cXHJcXG4gIC5idXR0b25zIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgZ2FwOiAyMHB4O1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKiBCb3TDtWVzICovXFxyXFxuICAuYnRuIHtcXHJcXG4gICAgZm9udC1zaXplOiAyMHB4O1xcclxcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMyNjdhNDA7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgcGFkZGluZzogMTVweCAzMHB4O1xcclxcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XFxyXFxuICAgIGJvcmRlcjogbm9uZTtcXHJcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcclxcbiAgICB0cmFuc2l0aW9uOiAwLjNzO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAuYnRuOmhvdmVyIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzJiNmI1ZjtcXHJcXG4gIH1cXHJcXG4gIFwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-browser)/./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[7].oneOf[13].use[1]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[7].oneOf[13].use[2]!./styles/styles.css\n"));

/***/ })

});