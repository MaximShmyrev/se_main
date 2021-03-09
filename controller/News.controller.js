sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/core/Fragment"
], function(BaseController, JSONModel, Filter, FilterOperator, Dialog, DialogType, Button, Text, Fragment) {
	"use strict";
	var oData;

	return BaseController.extend("main.controller.News", {

		onInit: function() {
			this.byId("SplitApp").toDetail(this.createId("detail"));
			
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_NewsService/ZCE_News', false);

	// build SOAP request
	var sr = '<?xml version="1.0" encoding="utf-8"?>' +
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_news/">' +
		'<soapenv:Header/>' +
		'<soapenv:Body>' +
		'<zce:getNews/>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>';

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				//console.log(xmlhttp.responseText);
				var response = xmlhttp.responseText;

				var splitResponse = response.split(/<return>|<\/return>/);
				var arrayResponse = splitResponse[1];
				var jsonObj = JSON.parse(arrayResponse.toString());
				oData = {
					news: jsonObj,
				categories: [{
					name: "Новости"
				}, {
					name: "Приказы"
				}, {
					name: "Объявления"
				}],
				weeks: 52,
				fragment_image: "",
				fragment_text: ""
				};

			}
		}
	};

	// Send the POST request
	xmlhttp.setRequestHeader("Content-Type", "text/xml");
	xmlhttp.send(sr);
			// oData = {
			// 	news: [{
			// 		image: "img/news_1.jpg",
			// 		type: "Новости",
			// 		title: "В Самарской области растут долги по оплате электроэнергии",
			// 		text: "Наибольшее снижение платежей произошло по группе «Приравненные к населению», к которой относятся управляющие компании, СНТ и другие организации, оплачивающие электроэнергию по тарифу «население». По данной категории задолженность перед ПАО «Самараэнерго» за полгода увеличилась на 29%. Задолженность жителей Самарской области выросла на 6,7%.Наибольшее число неплательщиков - среди предприятий сферы ЖКХ. Среди злостных неплательщиков в сфере жилищно-коммунального хозяйства региона лидирует АО «Водоканал» Нефтегорского района, задолженность которого на 1 сентября 2020 года составила свыше 141 млн. рублей.Среди промышленных предприятий Самарской области самую высокую величину задолженности имеет ОАО «Самарский подшипниковый завод». На 1 сентября 2020 года долг предприятия превысил 223 млн. рублей. Огромные долги за электроэнергию накоплены исполнителями коммунальных услуг: ООО «ДЖКХ» (г. Тольятти), ООО УК «Солнечный» (Ставропольский район), ООО «УК «Центр» (г. Сызрань), ООО «УК № 3» г.о. Тольятти, ОАО «УК №5» (г. Тольятти), ООО «Визит-М» (г. Самара), ООО «УК «ЖЭС» (г. Сызрань), ООО «УК Авиакор-Стандарт» (г. Самара).Учитывая систематические неплатежи со стороны управляющих компаний ПАО «Самараэнерго» направило в ОСП Самарской области 13 ходатайств о запрете управляющим компаниям досрочно прекращать деятельности по управлению многоквартирными домами.  В результате, в отношении ООО «ДЖКХ» уже вынесено Постановление о запрете действий, направленных на отчуждение жилого фонда. Более того, в августе 2020 года был наложен арест на транспортные средства и спецтехнику принадлежащие МП «СтавропольРесурсСервис».ПАО «Самараэнерго» напоминает, что Постановлением Правительства от 02 апреля 2020 № 424 «Об особенностях предоставления коммунальных услуг собственникам и пользователям помещений в многоквартирных домах и жилых домов» до 1 января 2021 года введен мораторий на требования неустоек (штрафов, пеней) и введения ограничений подачи электроэнергии за невыполнение обязательств по оплате коммунальных ресурсов. Однако обязанность своевременно оплачивать потребленную электроэнергию у потребителей осталась. В соответствии с действующим законодательством Российской Федерации и граждане-потребители, и исполнители коммунальной услуги обязаны оплачивать потребленную электроэнергию ежемесячно до 10-го числа месяца, следующего за расчетным периодом.В настоящее время ПАО «Самараэнерго» продолжает применять разрешенные законом меры воздействия на должников, в том числе взыскивает задолженность через суд. Так, с января по сентябрь текущего года ПАО «Самараэнерго» в арбитражный суд было направлено 818 исковых заявлений о взыскании задолженности за электроэнергию с юридических лиц на общую сумму 877, 79 млн. руб. Количество направленных заявлений по физическим лицам превысило   8 600 на общую сумму 62, 37 млн. руб. При этом 506 граждан-потребителей оплатили задолженность до вынесения судебного акта. Продолжается совместная работа и с судебными приставами. С начала года было проведено более 1000 рейдов, 922 исполнительных документа предъявлены к расчетным счетам неплательщикам и 13 транспортных средств, принадлежавших должникам, объявлены в розыск. В результате проведенных мероприятий по исполнительным документам фактически взыскано свыше 26,5 млн. рублей.ПАО «Самараэнерго» предупреждает: с 1 января 2021 года к исполнителям коммунальных услуг вернется право требовать уплаты неустоек, приостановленных в связи с угрозой распространения COVID-19. Таким образом должники окажутся в еще более неблагоприятной ситуации. Накопившееся задолженность увеличит сумму штрафов за несвоевременную оплату, а неисполнение или ненадлежащее исполнение обязательств по оплате электрической энергии повлечет негативные последствия для потребителей в виде введения ограничения режима потребления. ПАО «Самараэнерго» призывает всех потребителей электроэнергии к добросовестному исполнению своих обязательств по оплате электрической энергии. От этого зависит надежное и бесперебойное энергоснабжение региона!",
			// 		publish: "16.01.2021"
			// 	}, {
			// 		image: "img/ad_1.jpg",
			// 		type: "Объявления",
			// 		title: "Поздравление",
			// 		text: "Поздравление с Днем энергетика и Новым годом",
			// 		publish: "11.01.2021"
			// 	}, {
			// 		image: "",
			// 		type: "Новости",
			// 		title: "Энергетики «Самарских сетей» и «Самараэнерго» вышли в рейд",
			// 		text: "Незаконное подключение серьезно сказывается на надежности и безопасности электроснабжения - противоправные действия могут привести к перепадам напряжения, отключениям и даже пожарам. Кроме того, самовольное подключение к сетям опасно для жизни самого нарушителя. Помимо полного возмещения материального ущерба, недобросовестные потребители могут быть привлечены к административной и даже уголовной ответственности.В селе Молгачи несколько лет назад была проведена реконструкция электросетевого комплекса, установлены новые интеллектуальные приборы учета. Благодаря выполненным мероприятиям несанкционированно подключаться к сетям стало практически невозможно. Энергетики проверили несколько домохозяйств, а собственникам выдали памятки о том, чем грозит безучетное энергопотребление. «Противозаконно потреблять электроэнергию теперь сложно – счетчик установлен на опоре и все это на виду. В селе нареканий и жалоб по данному вопросу нет, напряжение не скачет, но профилактические мероприятия проводятся постоянно. Мы с энергетиками «Россетей» работаем по данному направлению вместе», - отметил Виктор Салдаев, староста села Молгачи Светлопольского сельского поселения. Установка интеллектуальной системы учета электроэнергии значительно снизила количество незаконных вмешательств в работу приборов учета. Это подтверждают и сотрудники ПАО «Самараэнерго». Так, по данным гарантирующего поставщика, пять лет назад в Красноярском районе Самарской области ежегодно выявляли около 40 случаев незаконных подключений. В прошлом году таких нарушений было всего 7. Однако, несмотря на благоприятную статистику, совместные рейды до сих пор не утратили свою актуальность. «Во время рейдов с сетевой компанией мы также проводим и разъяснительную работу среди населения. Объясняем, что своевременная оплата – залог надежного энергоснабжения каждого домохозяйства. Особое внимание уделяем должникам. Предупреждаем их, что запрет на отключение электроэнергии за долги гражданам-потребителям - мера временная. В любом случае мы взыскиваем задолженность в судебном порядке», – пояснил заместитель начальника Красноярского отделения ПАО «Самараэнерго» Вячеслав Саблин. По данным ПАО «Самараэнерго» только в Красноярском районе в прошлом году было рассмотрено в суде около 800 заявлений с вынесением решения в пользу гарантирующего поставщика. При этом должник по исполнительному листу должен оплатить не только основной долг, но и судебные издержки. Для предотвращения лишних затрат сотрудники ПАО «Самараэнерго» предлагают оформить рассрочку платежа, позволяющую выплачивать задолженность поэтапно в течение нескольких месяцев.",
			// 		publish: "12.01.2021"
			// 	}, {
			// 		image: "img/London.jpg",
			// 		type: "Новости",
			// 		title: "В Лондоне вводят наивысший уровень карантина из-за нового штамма коронавируса.",
			// 		text: "Количество активных случаев коронавируса в мире, по данным Университета Джонса Хопкинса, превышает 33 миллиона человек. Заболевших с начала пандемии - 75,8 млн, переболевших и поправившихся - 42,8 млн. Скончались за период пандении около 1,67 млн человек. Премьер-министр Великобритании Борис Джонсон на пресс-конференции в субботу объявил, что в Лондоне и на юго-востоке Англии с полуночи воскресенья вводится новый, четвертый уровень ограничений в связи с появлением более быстро распространяющегося штамма коронавируса.",
			// 		publish: "14.01.2021"
			// 	}, {
			// 		image: "img/bethoven.jpg",
			// 		type: "Новости",
			// 		title: "Людвиг ван Бетховен в свои 250 лет не стар. Он суперстар",
			// 		text: "В эти дни исполняется 250 лет со дня рождения великого Бетховена. Точно известна лишь дата его крещения - 17 декабря. Зная обычаи тех времен, принято считать, что родился он днем ранее.О его классическом наследии за два века написано и сказано столько, что добавить что бы то ни было к этому довольно трудно. Поэтому мы решили отметить юбилей, вспомнив, как великий композитор-классик много лет после своей смерти вторгался в мир популярной музыки и как поп-артисты - почтительно или иронично - включали его темы и фрагменты его классических опусов в свои песни и инструментальные пьесы.",
			// 		publish: "15.01.2021"
			// 	}, {
			// 		image: "img/ad_2.jpg",
			// 		type: "Объявления",
			// 		title: "ПАО «Самараэнерго» наградило участников фотопроекта «Добрая энергия Самары»",
			// 		text: "Всего для участия в фотопроекте в ПАО «Самараэнерго» было направлено 97 детских работ. В них школьники показали красоты своего края, где каждый уголок природы пропитан доброй энергией. География фотографий – вся губерния. Нефтегорск, Борское, Новый Буян, Тольятти, Новокуйбышевск, Жигулевск. Юные фотографы размещали свои работы в группе «ВКонтакте». Увидеть их можно на выставке Инги Пеннер «Добрая энергия Самары», которая в эти дни проходит в Самарской областном художественном музее. В выставочном зале детские фотографии представлены на экране в видеоролике и являются гармоничным сопровождением основной экспозиции, автор которой Инга Пеннер в ходе торжественного награждения провела юным фотографам экскурсию, раскрыв тайны закадровой работы. В заключении встречи директор Самарского областного художественного музея Алла Шахматова лично поблагодарила каждого ребенка за участие в фотопроекте «Добрая энергия Самары» и пожелала дальнейших творческих успехов.",
			// 		publish: "16.01.2021"
			// 	}],
			// 	categories: [{
			// 		name: "Новости"
			// 	}, {
			// 		name: "Приказы"
			// 	}, {
			// 		name: "Объявления"
			// 	}],
			// 	weeks: 52,
			// 	fragment_image: "",
			// 	fragment_text: ""
			// };

			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);

		},

		onAfterRendering: function() {
			var oSplitApp = this.getView().byId("SplitApp");
			oSplitApp.getAggregation("_navMaster").addStyleClass("masterStyle");
		},

		onPressHome: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			document.title = "Главная страница";
			oRouter.navTo("home", {}, true);
			//window.open("http://prt.samaraenergo.ru:50000/irj/go/km/docs/documents/main/index.html", "_self");

		},

		onSearch: function() {

			//get selected item
			var oList = this.getView().byId("categoriesList");
			var filters = oList.getItems();

			//write selected items to filter array
			var filterNews = [];
			var aFilter = [];

			//read input from key words field
			var keyWord = this.byId("keyWords").getValue();

			if (keyWord !== "") {
				var sQuery = keyWord;
				aFilter.push(new Filter("HEADER", FilterOperator.Contains, sQuery));
			} else {
				for (var i = 0; i < filters.length; i++) {
					var name = filters[i].getContent()[0].mProperties.text;
					var isSelected = filters[i].getContent()[0].mProperties.selected;

					if (isSelected === true) {
						filterNews.push(name);
					}
				}
			}

			//push filter to newsList
			var newsList = this.getView().byId("newsList");

			for (var j = 0; j < filterNews.length; j++) {
				sQuery = filterNews[j];
				aFilter.push(new Filter("TYPE", FilterOperator.EQ, sQuery));
			}

			if (aFilter !== null) {
				var oBinding = newsList.getBinding("items");
				oBinding.filter(new Filter({
					filters: aFilter,
					and: false
				}));
			}

		},

		onToMaster: function() {
			this.byId("SplitApp").toMaster(this.createId("master"));
		},

		onShowChains: function() {
			var oViewModel = this.getModel("view");
			var oViewData = oViewModel.getData();
			if (oViewData.showChains) {
				oViewData.showChains = false;
			} else {
				oViewData.showChains = true;
			}
			oViewModel.refresh(true);
		},

		onScrollToTop: function() {
			this.byId("detail").scrollTo(0, 1000);
		},

		onDialogWithSizePress: function(oEvent) {
			// if (!this.oFixedSizeDialog) {
			var sPath = oEvent.getSource().getBindingContext().getPath();
			var oModel = this.getView().getModel();
			var oContext = oModel.getProperty(sPath);
			this.oFixedSizeDialog = new Dialog({
				title: oContext.title,
				contentWidth: "1050px",
				contentHeight: "900px",
				content: [new Text({
						text: oContext.text
					}),
					new Text({
						text: oContext.image
					})
				],
				type: DialogType.Message,
				endButton: new Button({
					text: "Close",
					press: function() {
						this.oFixedSizeDialog.close();
					}.bind(this)
				})
			});

			//to get access to the controller's model
			this.getView().addDependent(this.oFixedSizeDialog);
			// }

			this.oFixedSizeDialog.open();
		},
		onOpenDialog: function(oEvent) {
			var oView = this.getView();
			var sPath = oEvent.getSource().getBindingContext().getPath();
			var oModel = this.getView().getModel();
			var oContext = oModel.getProperty(sPath);
			oModel.setProperty("/fragment_header", oContext.HEADER);
			oModel.setProperty("/fragment_text", oContext.TEXT);
			oModel.setProperty("/fragment_image", oContext.DATA_RAW);
			// create dialog lazily
			if (!this.pDialog) {
				this.pDialog = Fragment.load({
					id: oView.getId(),
					name: "main.view.Dialog",
					controller: this
				}).then(function(oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					return oDialog;
				});
			}

			this.pDialog.then(function(oDialog) {
				oDialog.open();
			});
		},
		onCloseDialog: function() {
			// note: We don't need to chain to the pDialog promise, since this event-handler
			// is only called from within the loaded dialog itself.
			this.byId("Dialog").close();
		}
	});

});