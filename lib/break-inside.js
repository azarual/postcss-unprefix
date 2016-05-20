"use strict";

// ����˽��д�������ɱ�׼��`break-inside: column-avoid`��`break-inside: page-avoid`��
module.exports = function(decl) {
	if (/^(?:-\w+-)?(\w+)-break-(\w+)/.test(decl.prop)) {
		return {
			prop: "break-" + RegExp.$2,
			value: decl.value === "avoid" ? RegExp.$1 + "-avoid" : decl.value,
		};
	}
};