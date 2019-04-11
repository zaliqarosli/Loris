import InstrumentForm from './InstrumentForm';
import {evaluator, NullVariableError, UndefinedVariableError} from './lib/Parser';
import localizeInstrument from './lib/localize-instrument';

const INPUT_TYPES = ['select', 'date', 'radio', 'text', 'calc', 'checkbox', 'numeric'];

/* InstrumentForm and InstrumentFormContainer follow the `presentational vs container`
 * pattern (https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).
 * InstrumentFormContainer is concerned with how things work (managing state) and
 * InstrumentForm is concerned only with how things look.
 */
class InstrumentFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.initialData,
      localizedInstrument: localizeInstrument(this.props.instrument, this.props.lang),
      showRequired: false,
      errorMessage: null,
      isFrozen: this.props.isFrozen ? this.props.isFrozen : false,
      dataEntryMode: this.props.dataEntryMode ? this.props.dataEntryMode : false,
      examiners: this.props.examiners,
      windows: this.props.windows,
    };

    this.updateInstrumentData = this.updateInstrumentData.bind(this);
    this.incompleteRequiredFieldExists = this.incompleteRequiredFieldExists.bind(this);
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
  }

  getSaveText(lang) {
    switch (lang) {
      case 'en-ca':
        return 'Save';
      case 'fr-ca':
        return 'Enregistrer';
    }
  }

  getSaveWarning(lang) {
    switch (lang) {
      case 'en-ca':
        return 'You cannot modify your answers after clicking this button. Please ensure all answers are correct.';
      case 'fr-ca':
        return 'Vous ne pouvez pas modifier vos réponses après avoir cliqué sur ce bouton. Assurez-vous que toutes les réponses sont correctes.';
    }
  }

  recalculateMeta(dob, testdate) {
    if (dob == null || testdate == null || dob == '' || testdate == '') return null;
    const dobMatches = dob.split('-');
    dob = {year: parseInt(dobMatches[0]), mon: parseInt(dobMatches[1]), day: parseInt(dobMatches[2])};

    const tdMatches = testdate.split('-');
    testdate = {year: parseInt(tdMatches[0]), mon: parseInt(tdMatches[1]), day: parseInt(tdMatches[2])};

    if (testdate.day < dob.day) {
      testdate.day += 30;
      testdate.mon --;
    }
    if (testdate.mon < dob.mon) {
      testdate.mon += 12;
      testdate.year --;
    }

    const age = {year: testdate.year - dob.year, mon: testdate.mon - dob.mon, day: testdate.day - dob.day};

    const ageDays = Math.round((age.year * 365 + age.mon * 30 + age.day) * 10) / 10;
    const ageMonths = Math.round((age.year * 12 + age.mon + age.day / 30) * 10) / 10;
    let delta = 0;
    let windowDifference = 0;

    this.state.windows.forEach(function(ageWindow) {
      if (ageDays >= ageWindow.AgeMinDays && ageDays <= ageWindow.AgeMaxDays) {
          windowDifference = 0;
      } else {
          if (ageDays < ageWindow.AgeMinDays) {
              delta = ageWindow.AgeMinDays - ageDays;
              if (Math.abs(delta) < Math.abs(windowDifference) || windowDifference == 0) {
                  windowDifference = 0 - Math.abs(delta);
              }
          }
          if (ageDays > ageWindow.AgeMaxDays) {
              delta = ageDays - ageWindow.AgeMaxDays;
              if (Math.abs(delta) < Math.abs(windowDifference) || windowDifference == 0) {
                  windowDifference = Math.abs(delta);
              }
          }
      }
    });
    return {Candidate_Age: ageMonths, Window_Difference: windowDifference};
  }

  /**
   * This function is called when the user inputs or updates an instrument
   * field. It is responsible for updating `state.data`, which involves not
   * only updating the field which the user modified but also any calculated fields
   * that may have changed as a result.
   *
   * @param {string} name - The name of the data point that changed
   * @param {any} value - The new value of the data point
   */
  updateInstrumentData(name, value) {
    let savingState = false;
    let instrumentData;
    if (name == null && value == null) {
        instrumentData = Object.assign({}, this.state.data);
        savingState = true;
    } else {
        instrumentData = Object.assign({}, this.state.data, {[name]: value});
    }

    let metaVals;
    if (name === 'Date_taken' || savingState) {
        metaVals = this.recalculateMeta(this.props.context.dob, instrumentData.Date_taken);
    } else {
      metaVals = {};
    }

    const multiElements = this.props.instrument.Elements.filter(
      (element) => (element.Type === 'checkbox') // if other multi-select elements are added they should be listed here
    );

    let multiElementVals = Object.assign({}, {});
    multiElements.forEach((element) => {
      let opts = Object.keys(element.Options.Values['en-ca']);
      let values = instrumentData[element.Name] ? instrumentData[element.Name] : [];
      multiElementVals[element.Name] = [];
      opts.forEach((opt) => {
        multiElementVals[element.Name][opt] = values.includes(opt) ? '1' : '0';
      });
    });

    const calcElements = this.props.instrument.Elements.filter(
      (element) => (element.Type === 'calc')
    );

    let instrumentDataCopy = Object.assign({}, instrumentData, multiElementVals);
    const evaluatorContext = {...instrumentDataCopy, context: this.props.context};
    const calculatedValues = calcElements.reduce((result, element) => {
      if (!evaluator(element.DisplayIf, evaluatorContext) && element.DisplayIf != '') {
        return result;
      }
      try {
        result[element.Name] = String((evaluator(element.Formula, evaluatorContext))) || '0';
      } catch (e) {
        if (!(e instanceof NullVariableError) && !(e instanceof UndefinedVariableError)) {
          throw e;
        }
      }
      return result;
    }, {});

    const newData = Object.assign(
      {}, instrumentData, calculatedValues, metaVals
    );
    this.setState({
      data: newData,
    });
  }

  /**
   * Intended to be called before submitting data to the server as part of
   * the front-end validation process.
   *
   * @return {boolean} Boolean indicating whether any required fields have been left incomplete
   */
  incompleteRequiredFieldExists() {
    const annotatedElements = this.annotateElements(
      this.filterElements(
        this.state.localizedInstrument.Elements,
        this.state.data,
        this.props.context,
        this.props.options.surveyMode
      ),
      this.state.data,
      this.props.context
    );

    let incompleteExists = false;
    annotatedElements.forEach((element) => {
      if (element.Options.RequireResponse && (!element.Value)) {
        incompleteExists = true;
      }
    });

    return incompleteExists;
  }

  /**
   * Determines whether a field should be displayed. The Hidden property can cause a field
   * to be hidden, as can the HiddenSurvey property (only if SurveyMode is enabled). The
   * DisplayIf may contain a string of LorisScript which will be evaluated using the context
   * and current data.
   *
   * @param {any} element
   * @param {any} index
   * @param {any} data
   * @param {any} context
   * @param {any} surveyMode
   *
   * @return {boolean} Boolean indicating whether the field should be displayed
   */
  isDisplayed(element, index, data, context, surveyMode) {
    if (
      (element.Hidden) ||
      (surveyMode && element.HiddenSurvey) ||
      (element.DisplayIf === false)
    ) {
      return false;
    }

    if (element.DisplayIf === '') return true;

    const multiElements = this.props.instrument.Elements.filter(
      (element) => (element.Type === 'checkbox') // if other multi-select elements are added they should be listed here
    );

    let multiElementVals = Object.assign({}, {});
    multiElements.forEach((element) => {
      let opts = Object.keys(element.Options.Values['en-ca']);
      let values = this.state.data[element.Name] ? this.state.data[element.Name] : [];
      multiElementVals[element.Name] = [];
      opts.forEach((opt) => {
        multiElementVals[element.Name][opt] = values.includes(opt) ? '1' : '0';
      });
    });

    let instrumentDataCopy = Object.assign({}, data, multiElementVals);
    try {
      return evaluator(element.DisplayIf, {...instrumentDataCopy, context});
    } catch (e) {
//      console.log(element.DisplayIf);
      if (!(e instanceof NullVariableError)) {
//        console.log(`Error evaluating DisplayIf property of element ${index}.\n${e}`);
      } else {
//        console.log(`${e}`);
      }

      return false;
    }
  }

  /**
   * Determines whether a field is required. The RequireResponse of an element can
   * be a simple boolean in which case it is returned. RequireResponse can also be
   * a string of LorisScript which will be evaluated using the context and current data.
   *
   * @param {any} element
   * @param {any} index
   * @param {any} data
   * @param {any} context
   *
   * @return {boolean} Boolean indicating whether the field is required
   */
  isRequired(element, index, data, context) {
    if (!INPUT_TYPES.includes(element.Type)) return false;

    const requireResponse = element.Options.RequireResponse || false;
    if (typeof(requireResponse) === 'boolean') return requireResponse;

    try {
      return evaluator(requireResponse, {...data, context});
    } catch (e) {
      if (!(e instanceof NullVariableError)) {
//        console.log(`Error evaluating RequireResponse property of element ${index}.\n${e}`);
      }

      return false;
    }
  }

  onSaveButtonClick() {
    this.updateInstrumentData(null, null);
    if (this.incompleteRequiredFieldExists()) {
      this.setState({
        errorMessage: 'Please fill in the required fields indicated below.',
        showRequired: true,
      });
      const errorDiv = document.getElementById('instrument-error');
      errorDiv.scrollIntoView(false);
    } else {
      this.props.onSave(this.state.data);
      this.setState({
        errorMessage: '',
        showRequired: false,
      });
    }
  }

  /**
   * Helper function which filters an instruments elements by applying isDisplay
   * to each.
   *
   * @param {any} elements
   * @param {any} data
   * @param {any} context
   * @param {any} surveyMode
   *
   * @return {array} Array of the filtered elements
   */
  filterElements(elements, data, context, surveyMode) {
    return elements.filter(
      (element, index) => this.isDisplayed(element, index, data, context, surveyMode)
    );
  }

  /**
   * Adds a Value property which contains the current value contained in this.state.data
   * to each element. This allows us to avoid passing this.state.data to InstrumentForm and
   * simplifies things in that component. This function will also evaluate any LorisScript contained
   * in a RequireResponse property of an element and replace it with a boolean. Again, this
   * simplifies things in InstrumentForm.
   *
   * @param {any} elements
   * @param {any} data
   * @param {any} context
   *
   * @return {array} Array of the filtered elements
   */
  annotateElements(elements, data, context) {
    return elements.map(
      (element, index) => Object.assign(element, {
        Value: data[element.Name],
        Options: Object.assign({}, element.Options, {
          RequireResponse: this.isRequired(element, index, data, context),
        }),
      })
    );
  }

  render() {
    const {data, localizedInstrument} = this.state;
    const {context, options, lang} = this.props;
    return (
      <InstrumentForm
        meta={localizedInstrument.Meta}
        elements={
          this.annotateElements(
            this.filterElements(localizedInstrument.Elements, data, context, options.surveyMode),
            data,
            context
          )
        }
        showRequired={this.state.showRequired}
        errorMessage={this.state.errorMessage}
        onUpdate={this.updateInstrumentData}
        onSave={this.onSaveButtonClick}
        saveText={this.getSaveText(lang)}
        saveWarning={this.getSaveWarning(lang)}
        isFrozen={this.state.isFrozen}
        dataEntryMode={this.state.dataEntryMode}
        metaData={[data.Date_taken, data.Candidate_Age, data.Window_Difference, data.Examiner]}
        examiners={this.state.examiners}
      />
    );
  }
}

export default InstrumentFormContainer;
