"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "(pages-dir-browser)/./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Home)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(pages-dir-browser)/./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/head */ \"(pages-dir-browser)/./node_modules/next/head.js\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/link */ \"(pages-dir-browser)/./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ \"(pages-dir-browser)/./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _components_Navbar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/Navbar */ \"(pages-dir-browser)/./components/Navbar.js\");\n\nvar _s = $RefreshSig$();\n\n\n\n // Importando a Navbar\nfunction Home() {\n    _s();\n    const [apiData, setApiData] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null);\n    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)({\n        \"Home.useEffect\": ()=>{\n            fetch('http://localhost:9000/api').then({\n                \"Home.useEffect\": (response)=>response.json()\n            }[\"Home.useEffect\"]).then({\n                \"Home.useEffect\": (data)=>setApiData(data)\n            }[\"Home.useEffect\"]).catch({\n                \"Home.useEffect\": (error)=>console.error('Erro ao buscar dados da API:', error)\n            }[\"Home.useEffect\"]);\n        }\n    }[\"Home.useEffect\"], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_1___default()), {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        charSet: \"UTF-8\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                        lineNumber: 19,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        httpEquiv: \"X-UA-Compatible\",\n                        content: \"IE=edge\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                        lineNumber: 20,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"viewport\",\n                        content: \"width=device-width, initial-scale=1.0\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                        lineNumber: 21,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"title\", {\n                        children: \"Simoldes PCP\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                        lineNumber: 22,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"stylesheet\",\n                        href: \"/styles/styles.css\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                        lineNumber: 23,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"stylesheet\",\n                        href: \"/styles/index.css\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                        lineNumber: 24,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                lineNumber: 18,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"container\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"left\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                                children: \"Simoldes PCP\"\n                            }, void 0, false, {\n                                fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                                lineNumber: 31,\n                                columnNumber: 11\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                children: \"Bem-vindo ao sistema de PCP da Simoldes A\\xe7os.\"\n                            }, void 0, false, {\n                                fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                                lineNumber: 32,\n                                columnNumber: 11\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                        lineNumber: 30,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"right\",\n                        children: [\n                            apiData && apiData.message !== \"API working\" ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"api-data\",\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"pre\", {\n                                    children: JSON.stringify(apiData, null, 2)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                                    lineNumber: 39,\n                                    columnNumber: 17\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                                lineNumber: 38,\n                                columnNumber: 17\n                            }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                children: \"API funcionando!\"\n                            }, void 0, false, {\n                                fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                                lineNumber: 42,\n                                columnNumber: 17\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"buttons\",\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                        href: \"/login\",\n                                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                            className: \"btn\",\n                                            children: \"Login\"\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                                            lineNumber: 48,\n                                            columnNumber: 15\n                                        }, this)\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                                        lineNumber: 47,\n                                        columnNumber: 13\n                                    }, this),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                        href: \"/register\",\n                                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                            className: \"btn\",\n                                            children: \"Cadastrar\"\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                                            lineNumber: 51,\n                                            columnNumber: 15\n                                        }, this)\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                                        lineNumber: 50,\n                                        columnNumber: 13\n                                    }, this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                                lineNumber: 46,\n                                columnNumber: 11\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                        lineNumber: 36,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\index.js\",\n                lineNumber: 28,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n_s(Home, \"noAg7g3YD8y0s3I7k2yGkzb25Kw=\");\n_c = Home;\nvar _c;\n$RefreshReg$(_c, \"Home\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1icm93c2VyKS8uL3BhZ2VzL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUE0QjtBQUNBO0FBQ2U7QUFDRixDQUFDLHNCQUFzQjtBQUVqRCxTQUFTSzs7SUFDdEIsTUFBTSxDQUFDQyxTQUFTQyxXQUFXLEdBQUdKLCtDQUFRQSxDQUFDO0lBRXZDRCxnREFBU0E7MEJBQUM7WUFDUk0sTUFBTSw2QkFDSEMsSUFBSTtrQ0FBQyxDQUFDQyxXQUFhQSxTQUFTQyxJQUFJO2lDQUNoQ0YsSUFBSTtrQ0FBQyxDQUFDRyxPQUFTTCxXQUFXSztpQ0FDMUJDLEtBQUs7a0NBQUMsQ0FBQ0MsUUFBVUMsUUFBUUQsS0FBSyxDQUFDLGdDQUFnQ0E7O1FBQ3BFO3lCQUFHLEVBQUU7SUFFTCxxQkFDRTs7MEJBQ0UsOERBQUNkLGtEQUFJQTs7a0NBQ0gsOERBQUNnQjt3QkFBS0MsU0FBUTs7Ozs7O2tDQUNkLDhEQUFDRDt3QkFBS0UsV0FBVTt3QkFBa0JDLFNBQVE7Ozs7OztrQ0FDMUMsOERBQUNIO3dCQUFLSSxNQUFLO3dCQUFXRCxTQUFROzs7Ozs7a0NBQzlCLDhEQUFDRTtrQ0FBTTs7Ozs7O2tDQUNQLDhEQUFDQzt3QkFBS0MsS0FBSTt3QkFBYUMsTUFBSzs7Ozs7O2tDQUM1Qiw4REFBQ0Y7d0JBQUtDLEtBQUk7d0JBQWFDLE1BQUs7Ozs7Ozs7Ozs7OzswQkFJOUIsOERBQUNDO2dCQUFJQyxXQUFVOztrQ0FFYiw4REFBQ0Q7d0JBQUlDLFdBQVU7OzBDQUNiLDhEQUFDQzswQ0FBRzs7Ozs7OzBDQUNKLDhEQUFDQzswQ0FBRTs7Ozs7Ozs7Ozs7O2tDQUlMLDhEQUFDSDt3QkFBSUMsV0FBVTs7NEJBQ1ZwQixXQUFXQSxRQUFRdUIsT0FBTyxLQUFLLDhCQUM1Qiw4REFBQ0o7Z0NBQUlDLFdBQVU7MENBQ2YsNEVBQUNJOzhDQUFLQyxLQUFLQyxTQUFTLENBQUMxQixTQUFTLE1BQU07Ozs7Ozs7Ozs7cURBR3BDLDhEQUFDc0I7MENBQUU7Ozs7OzswQ0FJVCw4REFBQ0g7Z0NBQUlDLFdBQVU7O2tEQUNiLDhEQUFDekIsa0RBQUlBO3dDQUFDdUIsTUFBSztrREFDVCw0RUFBQ1M7NENBQU9QLFdBQVU7c0RBQU07Ozs7Ozs7Ozs7O2tEQUUxQiw4REFBQ3pCLGtEQUFJQTt3Q0FBQ3VCLE1BQUs7a0RBQ1QsNEVBQUNTOzRDQUFPUCxXQUFVO3NEQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT3RDO0dBcER3QnJCO0tBQUFBIiwic291cmNlcyI6WyJDOlxcc2ltb2xkZXMtcHJvamVjdFxcZnJvbnRlbmRcXHBhZ2VzXFxpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnXHJcbmltcG9ydCBMaW5rIGZyb20gJ25leHQvbGluaydcclxuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgTmF2YmFyIGZyb20gJy4uL2NvbXBvbmVudHMvTmF2YmFyJyAvLyBJbXBvcnRhbmRvIGEgTmF2YmFyXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIb21lKCkge1xyXG4gIGNvbnN0IFthcGlEYXRhLCBzZXRBcGlEYXRhXSA9IHVzZVN0YXRlKG51bGwpXHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBmZXRjaCgnaHR0cDovL2xvY2FsaG9zdDo5MDAwL2FwaScpXHJcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgICAudGhlbigoZGF0YSkgPT4gc2V0QXBpRGF0YShkYXRhKSlcclxuICAgICAgLmNhdGNoKChlcnJvcikgPT4gY29uc29sZS5lcnJvcignRXJybyBhbyBidXNjYXIgZGFkb3MgZGEgQVBJOicsIGVycm9yKSlcclxuICB9LCBbXSlcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDw+XHJcbiAgICAgIDxIZWFkPlxyXG4gICAgICAgIDxtZXRhIGNoYXJTZXQ9XCJVVEYtOFwiIC8+XHJcbiAgICAgICAgPG1ldGEgaHR0cEVxdWl2PVwiWC1VQS1Db21wYXRpYmxlXCIgY29udGVudD1cIklFPWVkZ2VcIiAvPlxyXG4gICAgICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wXCIgLz5cclxuICAgICAgICA8dGl0bGU+U2ltb2xkZXMgUENQPC90aXRsZT5cclxuICAgICAgICA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIi9zdHlsZXMvc3R5bGVzLmNzc1wiIC8+XHJcbiAgICAgICAgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIvc3R5bGVzL2luZGV4LmNzc1wiIC8+XHJcbiAgICAgIDwvSGVhZD5cclxuXHJcbiAgICAgIHsvKiBDb250YWluZXIgcHJpbmNpcGFsIGRpdmlkaWRvIGVtIGR1YXMgbWV0YWRlcyAqL31cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cclxuICAgICAgICB7LyogTGFkbyBlc3F1ZXJkbyAqL31cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxlZnRcIj5cclxuICAgICAgICAgIDxoMT5TaW1vbGRlcyBQQ1A8L2gxPlxyXG4gICAgICAgICAgPHA+QmVtLXZpbmRvIGFvIHNpc3RlbWEgZGUgUENQIGRhIFNpbW9sZGVzIEHDp29zLjwvcD5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgey8qIExhZG8gZGlyZWl0byAqL31cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJpZ2h0XCI+XHJcbiAgICAgICAgICAgIHthcGlEYXRhICYmIGFwaURhdGEubWVzc2FnZSAhPT0gXCJBUEkgd29ya2luZ1wiID8gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcGktZGF0YVwiPlxyXG4gICAgICAgICAgICAgICAgPHByZT57SlNPTi5zdHJpbmdpZnkoYXBpRGF0YSwgbnVsbCwgMil9PC9wcmU+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIDxwPkFQSSBmdW5jaW9uYW5kbyE8L3A+XHJcbiAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgey8qIEJvdMO1ZXMgYWxpbmhhZG9zIHZlcnRpY2FsbWVudGUgKi99XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1dHRvbnNcIj5cclxuICAgICAgICAgICAgPExpbmsgaHJlZj1cIi9sb2dpblwiPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuXCI+TG9naW48L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICA8TGluayBocmVmPVwiL3JlZ2lzdGVyXCI+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG5cIj5DYWRhc3RyYXI8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC8+XHJcbiAgKVxyXG59XHJcbiJdLCJuYW1lcyI6WyJIZWFkIiwiTGluayIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiTmF2YmFyIiwiSG9tZSIsImFwaURhdGEiLCJzZXRBcGlEYXRhIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwiZGF0YSIsImNhdGNoIiwiZXJyb3IiLCJjb25zb2xlIiwibWV0YSIsImNoYXJTZXQiLCJodHRwRXF1aXYiLCJjb250ZW50IiwibmFtZSIsInRpdGxlIiwibGluayIsInJlbCIsImhyZWYiLCJkaXYiLCJjbGFzc05hbWUiLCJoMSIsInAiLCJtZXNzYWdlIiwicHJlIiwiSlNPTiIsInN0cmluZ2lmeSIsImJ1dHRvbiJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-browser)/./pages/index.js\n"));

/***/ })

});