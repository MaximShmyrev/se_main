import { OverrideExecution } from "sap/ui/core/mvc";
import { ObjectPath } from "sap/base/util";
import { ElementMetadata } from "sap/ui/core";

export function Override(sTarget?: string) {
	return function(target: any, propertyKey: string) {
		if (!target.override) {
			target.override = {};
		}
		let currentTarget = target.override;
		if (sTarget) {
			if (!currentTarget.extension) {
				currentTarget.extension = {};
			}
			if (!currentTarget.extension[sTarget]) {
				currentTarget.extension[sTarget] = {};
			}
			currentTarget = currentTarget.extension[sTarget];
		}
		currentTarget[propertyKey] = target[propertyKey];
	};
}
export function Extensible(oOverrideExecution?: OverrideExecution) {
	return function(target: any, propertyKey: string) {
		if (!target.metadata) {
			target.metadata = { methods: {} };
		}
		if (!target.metadata.methods[propertyKey]) {
			target.metadata.methods[propertyKey] = {};
		}
		target.metadata.methods[propertyKey].overrideExecution = oOverrideExecution;
	};
}
export function Public(target: any, propertyKey: string) {
	if (!target.metadata) {
		target.metadata = { methods: {} };
	}
	if (!target.metadata.methods[propertyKey]) {
		target.metadata.methods[propertyKey] = {};
	}
	target.metadata.methods[propertyKey].public = true;
}
export function Private(target: any, propertyKey: string) {
	if (!target.metadata) {
		target.metadata = { methods: {} };
	}
	if (!target.metadata.methods[propertyKey]) {
		target.metadata.methods[propertyKey] = {};
	}
	target.metadata.methods[propertyKey].public = false;
}
export function Final(target: any, propertyKey: string) {
	if (!target.metadata) {
		target.metadata = { methods: {} };
	}
	if (!target.metadata.methods[propertyKey]) {
		target.metadata.methods[propertyKey] = {};
	}
	target.metadata.methods[propertyKey].final = true;
}
export function UI5Class(sTarget: string, metadataClass?: any) {
	return function(constructor: Function) {
		describe(constructor, sTarget, constructor.prototype, metadataClass);
	};
}

function describe(clazz: any, name: string, obj: any, metadataClass?: any) {
	obj = obj || {};
	obj.metadata = obj.metadata || {};
	obj.override = obj.override;
	obj.constructor = clazz;
	obj.metadata.baseType = Object.getPrototypeOf(clazz.prototype)
		.getMetadata()
		.getName();
	let metadata: any;
	if (metadataClass) {
		metadata = new metadataClass(name, obj);
	} else {
		metadata = new ElementMetadata(name, obj);
	}
	clazz.getMetadata = clazz.prototype.getMetadata = function() {
		return metadata;
	};
	ObjectPath.set(name, clazz);
}
