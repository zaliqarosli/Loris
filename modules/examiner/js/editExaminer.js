!function(modules){function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:!1};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}var installedModules={};return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.p="",__webpack_require__(0)}({0:function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),_Panel=__webpack_require__(2),_Panel2=_interopRequireDefault(_Panel),_Loader=__webpack_require__(16),_Loader2=_interopRequireDefault(_Loader),EditExaminer=function(_React$Component){function EditExaminer(props){_classCallCheck(this,EditExaminer);var _this=_possibleConstructorReturn(this,(EditExaminer.__proto__||Object.getPrototypeOf(EditExaminer)).call(this,props));return _this.state={isLoaded:!1,data:{},formData:{},statusOptions:{null:"N/A",not_certified:"Not Certified",in_training:"In Training",certified:"Certified"},hasError:!1,errorMessage:null},_this.fetchData=_this.fetchData.bind(_this),_this.setFormData=_this.setFormData.bind(_this),_this.handleSubmit=_this.handleSubmit.bind(_this),_this}return _inherits(EditExaminer,_React$Component),_createClass(EditExaminer,[{key:"componentDidMount",value:function(){this.fetchData()}},{key:"fetchData",value:function(){var self=this,formData={};$.ajax({url:this.props.dataURL,type:"GET",dataType:"json",data:{identifier:this.props.examinerID},success:function(data){var instruments=data.instruments;for(var instrumentID in instruments)instruments.hasOwnProperty(instrumentID)&&(formData[instrumentID]={status:data.instruments[instrumentID].pass,date:data.instruments[instrumentID].date_cert,comments:data.instruments[instrumentID].comment});self.setState({data:data,formData:formData,isLoaded:!0})},error:function(_error){console.error(_error)}})}},{key:"setFormData",value:function(formElement,value){var formData=this.state.formData,split=formElement.split("_"),key=split[0],element=split[1];formData[key][element]=value,this.setState({formData:formData})}},{key:"handleSubmit",value:function(e){var _this2=this;e.preventDefault();var formData=this.state.formData,formObject=new FormData;for(var testID in formData)if(formData.hasOwnProperty(testID)&&"{}"!==JSON.stringify(formData[testID])){"null"===formData[testID].status&&(this.state.errorMessage="You may not change a valid status to N/A");var instrumentData=JSON.stringify(formData[testID]);formObject.append(testID,instrumentData)}formObject.append("identifier",this.props.examinerID),$.ajax({type:"POST",url:loris.BaseURL+"/examiner/editCertification",data:formObject,cache:!1,contentType:!1,processData:!1,success:function(data){swal("Success!","Changes to certification submitted.","success"),_this2.fetchData()},error:function(_error2){console.error(_error2);var message=_error2.responseText;swal("Error!",message,"error")}})}},{key:"render",value:function(){if(!this.state.isLoaded)return React.createElement(_Loader2.default,null);this.state.errorMessage&&this.setState({hasError:!0});var formHeaders=React.createElement("div",{className:"row hidden-xs hidden-sm"},React.createElement("div",{className:"col-md-5"},React.createElement("label",{className:"col-md-3 instrument-header"},"Instrument"),React.createElement("label",{className:"col-md-9 status-header"},"Certification Status")),React.createElement("div",{className:"col-md-3"},React.createElement("div",{className:"col-md-3"}),React.createElement("label",{className:"col-md-9 date-header"},"Certification Date")),React.createElement("div",{className:"col-md-3"},React.createElement("div",{className:"col-md-3"}),React.createElement("label",{className:"col-md-9 comments-header"},"Comments"))),inputRow=[];for(var instrumentID in this.state.data.instruments){var dateRequired=!1;if("certified"===this.state.formData[instrumentID].status&&(dateRequired=!0),this.state.data.instruments.hasOwnProperty(instrumentID)){var instrumentName=this.state.data.instruments[instrumentID].name,instrumentRow=React.createElement("div",{className:"row"},React.createElement("div",{className:"col-md-5"},React.createElement(SelectElement,{label:instrumentName,name:instrumentID+"_status",options:this.state.statusOptions,value:this.state.formData[instrumentID].status,onUserInput:this.setFormData,ref:instrumentID+"_status",emptyOption:!1,hasError:this.state.hasError,errorMessage:this.state.errorMessage})),React.createElement("div",{className:"col-md-3"},React.createElement(DateElement,{name:instrumentID+"_date",value:this.state.formData[instrumentID].date,onUserInput:this.setFormData,ref:instrumentID+"_date",required:dateRequired,minYear:this.state.data.minYear,maxYear:this.state.data.maxYear})),React.createElement("div",{className:"col-md-3"},React.createElement(TextboxElement,{name:instrumentID+"_comments",value:this.state.formData[instrumentID].comments,onUserInput:this.setFormData,ref:instrumentID+"_comments"})));inputRow.push(instrumentRow)}}var historyData=[];for(var result in this.state.data.certification_history)if(this.state.data.certification_history.hasOwnProperty(result)){var rowData=React.createElement("tr",null,React.createElement("td",null,this.state.data.certification_history[result].changeDate),React.createElement("td",null,this.state.data.certification_history[result].userID),React.createElement("td",null,this.state.data.certification_history[result].Measure),React.createElement("td",null,this.state.data.certification_history[result].old),React.createElement("td",null,this.state.data.certification_history[result].old_date),React.createElement("td",null,this.state.data.certification_history[result].new),React.createElement("td",null,this.state.data.certification_history[result].new_date));historyData.push(rowData)}var editForm=React.createElement(FormElement,{Module:"examiner",name:"edit_cert",id:"edit_cert_form",onSubmit:this.handleSubmit,ref:"editCert"},inputRow,React.createElement("div",{className:"row col-xs-12"},React.createElement("div",{className:"col-sm-6 col-md-2 col-xs-12 col-md-offset-8"},React.createElement(ButtonElement,{name:"fire_away",label:"Save",type:"submit",buttonClass:"btn btn-sm btn-primary col-xs-12",columnSize:""})),React.createElement("div",{className:"reset-button"},React.createElement(ButtonElement,{label:"Reset",type:"reset",buttonClass:"btn btn-sm btn-primary col-xs-12",columnSize:"col-sm-6 col-md-2 col-xs-12",onUserInput:this.fetchData})))),changeLog=React.createElement("div",null,React.createElement("div",{className:"row"},React.createElement("div",{className:"col-xs-12"},React.createElement("h3",null,"Change Log"))),React.createElement("table",{className:"table table-hover table-primary table-bordered table-scroll"},React.createElement("thead",null,React.createElement("tr",{className:"info"},React.createElement("th",null,"Time"),React.createElement("th",null,"User"),React.createElement("th",null,"Measure"),React.createElement("th",null,"Old Value"),React.createElement("th",null,"Old Date"),React.createElement("th",null,"New Value"),React.createElement("th",null,"New Date"))),React.createElement("tbody",null,historyData)));return React.createElement("div",null,React.createElement(_Panel2.default,{id:"panel-body",title:"Edit Certification for "+this.state.data.examinerName},formHeaders,React.createElement("hr",{className:"row hidden-xs hidden-sm"}),editForm),changeLog)}}]),EditExaminer}(React.Component);EditExaminer.propTypes={Module:React.PropTypes.string.isRequired,examinerID:React.PropTypes.string.isRequired,dataURL:React.PropTypes.string.isRequired};var args=QueryString.get(document.currentScript.src);window.onload=function(){var fetchURL=loris.BaseURL+"/examiner/fetchCertification/",editExaminer=React.createElement("div",{id:"page-editexaminer"},React.createElement(EditExaminer,{Module:"examiner",examinerID:args.identifier,dataURL:fetchURL}));ReactDOM.render(editExaminer,document.getElementById("lorisworkspace"))}},2:function(module,exports){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),Panel=function(_React$Component){function Panel(props){_classCallCheck(this,Panel);var _this=_possibleConstructorReturn(this,(Panel.__proto__||Object.getPrototypeOf(Panel)).call(this,props));return _this.state={collapsed:_this.props.initCollapsed},_this.panelClass=_this.props.initCollapsed?"panel-collapse collapse":"panel-collapse collapse in",_this.toggleCollapsed=_this.toggleCollapsed.bind(_this),_this}return _inherits(Panel,_React$Component),_createClass(Panel,[{key:"toggleCollapsed",value:function(){this.setState({collapsed:!this.state.collapsed})}},{key:"render",value:function(){var glyphClass=this.state.collapsed?"glyphicon pull-right glyphicon-chevron-down":"glyphicon pull-right glyphicon-chevron-up",panelHeading=this.props.title?React.createElement("div",{className:"panel-heading",onClick:this.toggleCollapsed,"data-toggle":"collapse","data-target":"#"+this.props.id,style:{cursor:"pointer"}},this.props.title,React.createElement("span",{className:glyphClass})):"";return React.createElement("div",{className:"panel panel-primary"},panelHeading,React.createElement("div",{id:this.props.id,className:this.panelClass,role:"tabpanel"},React.createElement("div",{className:"panel-body",style:{height:this.props.height}},this.props.children)))}}]),Panel}(React.Component);Panel.propTypes={id:React.PropTypes.string,height:React.PropTypes.string,title:React.PropTypes.string},Panel.defaultProps={initCollapsed:!1,id:"default-panel",height:"100%"},exports.default=Panel},16:function(module,exports){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),Loader=function(_React$Component){function Loader(){return _classCallCheck(this,Loader),_possibleConstructorReturn(this,(Loader.__proto__||Object.getPrototypeOf(Loader)).apply(this,arguments))}return _inherits(Loader,_React$Component),_createClass(Loader,[{key:"render",value:function(){return React.createElement("div",{className:"loader",style:{width:this.props.size,height:this.props.size}})}}]),Loader}(React.Component);Loader.propTypes={size:React.PropTypes.int},Loader.defaultProps={size:120},exports.default=Loader}});
//# sourceMappingURL=editExaminer.js.map