"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/login",{

/***/ "(pages-dir-browser)/./pages/login.js":
/*!************************!*\
  !*** ./pages/login.js ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(pages-dir-browser)/./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(pages-dir-browser)/./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"(pages-dir-browser)/./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n\nvar _s = $RefreshSig$();\n\n\nconst Login = ()=>{\n    _s();\n    const [registration, setRegistration] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    const [password, setPassword] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    const handleSubmit = async (e)=>{\n        e.preventDefault();\n        setError(\"\");\n        try {\n            const response = await fetch(\"/api/auth/login\", {\n                method: \"POST\",\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                },\n                body: JSON.stringify({\n                    registration: parseInt(registration),\n                    password: password\n                })\n            });\n            if (response.ok) {\n                const { token } = await response.json();\n                localStorage.setItem(\"token\", token);\n                router.push(\"/dashboard\");\n            } else {\n                throw new Error(\"Credenciais inválidas.\");\n            }\n        } catch (err) {\n            setError(err.message || \"Erro ao tentar login.\");\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"authDesign\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"left\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                        children: \"Login\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\login.js\",\n                        lineNumber: 41,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                        children: \"Entre para acessar sua conta\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\login.js\",\n                        lineNumber: 42,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\login.js\",\n                lineNumber: 40,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"right\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"form\", {\n                    onSubmit: handleSubmit,\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                            type: \"text\",\n                            placeholder: \"Matr\\xedcula\",\n                            value: registration,\n                            onChange: (e)=>setRegistration(e.target.value)\n                        }, void 0, false, {\n                            fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\login.js\",\n                            lineNumber: 46,\n                            columnNumber: 11\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                            type: \"password\",\n                            placeholder: \"Senha\",\n                            value: password,\n                            onChange: (e)=>setPassword(e.target.value)\n                        }, void 0, false, {\n                            fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\login.js\",\n                            lineNumber: 52,\n                            columnNumber: 11\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            type: \"submit\",\n                            className: \"btn\",\n                            children: \"Login\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\login.js\",\n                            lineNumber: 58,\n                            columnNumber: 11\n                        }, undefined),\n                        error && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                            className: \"error\",\n                            children: error\n                        }, void 0, false, {\n                            fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\login.js\",\n                            lineNumber: 59,\n                            columnNumber: 21\n                        }, undefined)\n                    ]\n                }, void 0, true, {\n                    fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\login.js\",\n                    lineNumber: 45,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\login.js\",\n                lineNumber: 44,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\simoldes-project\\\\frontend\\\\pages\\\\login.js\",\n        lineNumber: 39,\n        columnNumber: 5\n    }, undefined);\n};\n_s(Login, \"Xy1gCEAPQl5VShpKiihvp9OB6uE=\", false, function() {\n    return [\n        next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter\n    ];\n});\n_c = Login;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Login);\nvar _c;\n$RefreshReg$(_c, \"Login\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1icm93c2VyKS8uL3BhZ2VzL2xvZ2luLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFpQztBQUNPO0FBRXhDLE1BQU1FLFFBQVE7O0lBQ1osTUFBTSxDQUFDQyxjQUFjQyxnQkFBZ0IsR0FBR0osK0NBQVFBLENBQUM7SUFDakQsTUFBTSxDQUFDSyxVQUFVQyxZQUFZLEdBQUdOLCtDQUFRQSxDQUFDO0lBQ3pDLE1BQU0sQ0FBQ08sT0FBT0MsU0FBUyxHQUFHUiwrQ0FBUUEsQ0FBQztJQUNuQyxNQUFNUyxTQUFTUixzREFBU0E7SUFFeEIsTUFBTVMsZUFBZSxPQUFPQztRQUMxQkEsRUFBRUMsY0FBYztRQUNoQkosU0FBUztRQUVULElBQUk7WUFDRixNQUFNSyxXQUFXLE1BQU1DLE1BQU0sbUJBQW1CO2dCQUM5Q0MsUUFBUTtnQkFDUkMsU0FBUztvQkFDUCxnQkFBZ0I7Z0JBQ2xCO2dCQUNBQyxNQUFNQyxLQUFLQyxTQUFTLENBQUM7b0JBQ25CaEIsY0FBY2lCLFNBQVNqQjtvQkFDdkJFLFVBQVVBO2dCQUNaO1lBQ0Y7WUFFQSxJQUFJUSxTQUFTUSxFQUFFLEVBQUU7Z0JBQ2YsTUFBTSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNVCxTQUFTVSxJQUFJO2dCQUNyQ0MsYUFBYUMsT0FBTyxDQUFDQyxPQUFpQyxFQUFFSjtnQkFDeERiLE9BQU9vQixJQUFJLENBQUM7WUFDZCxPQUFPO2dCQUNMLE1BQU0sSUFBSUMsTUFBTTtZQUNsQjtRQUNGLEVBQUUsT0FBT0MsS0FBSztZQUNadkIsU0FBU3VCLElBQUlDLE9BQU8sSUFBSTtRQUMxQjtJQUNGO0lBRUEscUJBQ0UsOERBQUNDO1FBQUlDLFdBQVU7OzBCQUNiLDhEQUFDRDtnQkFBSUMsV0FBVTs7a0NBQ2IsOERBQUNDO2tDQUFHOzs7Ozs7a0NBQ0osOERBQUNDO2tDQUFFOzs7Ozs7Ozs7Ozs7MEJBRUwsOERBQUNIO2dCQUFJQyxXQUFVOzBCQUNiLDRFQUFDRztvQkFBS0MsVUFBVTVCOztzQ0FDZCw4REFBQzZCOzRCQUNDQyxNQUFLOzRCQUNMQyxhQUFZOzRCQUNaQyxPQUFPdkM7NEJBQ1B3QyxVQUFVLENBQUNoQyxJQUFNUCxnQkFBZ0JPLEVBQUVpQyxNQUFNLENBQUNGLEtBQUs7Ozs7OztzQ0FFakQsOERBQUNIOzRCQUNDQyxNQUFLOzRCQUNMQyxhQUFZOzRCQUNaQyxPQUFPckM7NEJBQ1BzQyxVQUFVLENBQUNoQyxJQUFNTCxZQUFZSyxFQUFFaUMsTUFBTSxDQUFDRixLQUFLOzs7Ozs7c0NBRTdDLDhEQUFDRzs0QkFBT0wsTUFBSzs0QkFBU04sV0FBVTtzQ0FBTTs7Ozs7O3dCQUNyQzNCLHVCQUFTLDhEQUFDNkI7NEJBQUVGLFdBQVU7c0NBQVMzQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLMUM7R0E1RE1MOztRQUlXRCxrREFBU0E7OztLQUpwQkM7QUE4RE4saUVBQWVBLEtBQUtBLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFxzaW1vbGRlcy1wcm9qZWN0XFxmcm9udGVuZFxccGFnZXNcXGxvZ2luLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gXCJuZXh0L3JvdXRlclwiO1xyXG5cclxuY29uc3QgTG9naW4gPSAoKSA9PiB7XHJcbiAgY29uc3QgW3JlZ2lzdHJhdGlvbiwgc2V0UmVnaXN0cmF0aW9uXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG4gIGNvbnN0IFtwYXNzd29yZCwgc2V0UGFzc3dvcmRdID0gdXNlU3RhdGUoXCJcIik7XHJcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShcIlwiKTtcclxuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlU3VibWl0ID0gYXN5bmMgKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHNldEVycm9yKFwiXCIpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvYXBpL2F1dGgvbG9naW5cIiwge1xyXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICByZWdpc3RyYXRpb246IHBhcnNlSW50KHJlZ2lzdHJhdGlvbiksXHJcbiAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQsXHJcbiAgICAgICAgfSksXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgY29uc3QgeyB0b2tlbiB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1RPS0VOX0tFWSwgdG9rZW4pO1xyXG4gICAgICAgIHJvdXRlci5wdXNoKFwiL2Rhc2hib2FyZFwiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDcmVkZW5jaWFpcyBpbnbDoWxpZGFzLlwiKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHNldEVycm9yKGVyci5tZXNzYWdlIHx8IFwiRXJybyBhbyB0ZW50YXIgbG9naW4uXCIpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImF1dGhEZXNpZ25cIj5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJsZWZ0XCI+XHJcbiAgICAgICAgPGgxPkxvZ2luPC9oMT5cclxuICAgICAgICA8cD5FbnRyZSBwYXJhIGFjZXNzYXIgc3VhIGNvbnRhPC9wPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyaWdodFwiPlxyXG4gICAgICAgIDxmb3JtIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9PlxyXG4gICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJNYXRyw61jdWxhXCJcclxuICAgICAgICAgICAgdmFsdWU9e3JlZ2lzdHJhdGlvbn1cclxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRSZWdpc3RyYXRpb24oZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlbmhhXCJcclxuICAgICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFBhc3N3b3JkKGUudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG5cIj5Mb2dpbjwvYnV0dG9uPlxyXG4gICAgICAgICAge2Vycm9yICYmIDxwIGNsYXNzTmFtZT1cImVycm9yXCI+e2Vycm9yfTwvcD59XHJcbiAgICAgICAgPC9mb3JtPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpbjtcclxuIl0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlUm91dGVyIiwiTG9naW4iLCJyZWdpc3RyYXRpb24iLCJzZXRSZWdpc3RyYXRpb24iLCJwYXNzd29yZCIsInNldFBhc3N3b3JkIiwiZXJyb3IiLCJzZXRFcnJvciIsInJvdXRlciIsImhhbmRsZVN1Ym1pdCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInJlc3BvbnNlIiwiZmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJwYXJzZUludCIsIm9rIiwidG9rZW4iLCJqc29uIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19UT0tFTl9LRVkiLCJwdXNoIiwiRXJyb3IiLCJlcnIiLCJtZXNzYWdlIiwiZGl2IiwiY2xhc3NOYW1lIiwiaDEiLCJwIiwiZm9ybSIsIm9uU3VibWl0IiwiaW5wdXQiLCJ0eXBlIiwicGxhY2Vob2xkZXIiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwidGFyZ2V0IiwiYnV0dG9uIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-browser)/./pages/login.js\n"));

/***/ })

});