import { ServiceFactory, Service, ServiceContext } from "sap/ui/core/service";
import { DefaultEnvironmentCapabilities, EnvironmentCapabilities } from "../converters/MetaModelConverter";

class EnvironmentCapabilitiesService extends Service<EnvironmentCapabilities> {
	resolveFn: any;
	rejectFn: any;
	initPromise!: Promise<any>;
	environmentCapabilities!: EnvironmentCapabilities;
	// !: means that we know it will be assigned before usage

	init() {
		this.initPromise = new Promise((resolve, reject) => {
			this.resolveFn = resolve;
			this.rejectFn = reject;
		});
		const oContext = this.getContext();
		this.environmentCapabilities = Object.assign({}, DefaultEnvironmentCapabilities);
		Promise.all([this.resolveLibrary("sap.chart"), this.resolveLibrary("sap.suite.ui.microchart")])
			.then(([chartCapabilities, microChartCapabilities]) => {
				this.environmentCapabilities.Chart = chartCapabilities;
				this.environmentCapabilities.MicroChart = microChartCapabilities;
				this.environmentCapabilities.UShell = !!(sap && sap.ushell && sap.ushell.Container);
				this.environmentCapabilities.IntentBasedNavigation = !!(sap && sap.ushell && sap.ushell.Container);
				this.environmentCapabilities = Object.assign(this.environmentCapabilities, oContext.settings);
				this.resolveFn(this);
			})
			.catch(this.rejectFn);
	}

	resolveLibrary(libraryName: string): Promise<boolean> {
		return new Promise(function(resolve) {
			try {
				sap.ui.require(
					[`${libraryName.replace(/\./g, "/")}/library`],
					function() {
						resolve(true);
					},
					function() {
						resolve(false);
					}
				);
			} catch (e) {
				resolve(false);
			}
		});
	}

	public setCapabilities(oCapabilities: EnvironmentCapabilities) {
		this.environmentCapabilities = oCapabilities;
	}

	public getCapabilities() {
		return this.environmentCapabilities;
	}

	getInterface(): any {
		return this;
	}
}

class EnvironmentServiceFactory extends ServiceFactory<EnvironmentCapabilities> {
	createInstance(oServiceContext: ServiceContext<EnvironmentCapabilities>) {
		const environmentCapabilitiesService = new EnvironmentCapabilitiesService(oServiceContext);
		return environmentCapabilitiesService.initPromise;
	}
}

export default EnvironmentServiceFactory;
