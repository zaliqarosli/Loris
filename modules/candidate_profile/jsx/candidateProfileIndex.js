import Loader from 'Loader';
import swal from 'sweetalert2';
// import Card from 'Card';

/**
 * Candidate Profile Menu
 *
 * Create a candidate profile menu
 *
 * @author  Shen Wang
 * @version 1.0.0
 * */
class CandidateProfileIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: false,
      data: {},
      hasDataEntryPerm: false,
    };
    this.fetchData = this.fetchData.bind(this);
    this.createTimepoint = this.createTimepoint.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state
   *
   * @return {object}
   */
  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => {
        this.setState({data});
      })
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Handles form submission
   *
   * @param {event} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    const match = this.validateMatchDate();
    if (!match) {
      this.setState({
        isCreated: false,
      });
    } else {
      let formData = this.state.formData;
      let formObject = new FormData();
      for (let key in formData) {
        if (formData[key] !== '') {
          formObject.append(key, formData[key]);
        }
      }
      formObject.append('fire_away', 'New Candidate');

      // disable button to prevent form resubmission.
      this.setState({submitDisabled: true});

      fetch(this.props.submitURL, {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        body: formObject,
        })
      .then((resp) => {
        if (resp.ok && resp.status === 201) {
          resp.json().then((data) => {
            this.setState({newData: data});
            this.setState({isCreated: true});
          });
        } else {
          resp.json().then((message) => {
            // enable button for form resubmission.
            this.setState({submitDisabled: false});
            swal.fire('Error!', message, 'error');
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  /**
   * Set the form data based on state values of child elements/components
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    let formData = Object.assign({}, this.state.formData);
    formData[formElement] = value;

    this.setState({formData: formData});
  }

  createTimepoint() {
    location.href='/create_timepoint/?candID=' + this.state.data.candID + '&identifier=' + this.state.data.candID;
  }

  render() {
    // If error occurs, return a message.
    if (this.state.error) {
      return <h3>An error occurred while loading the page.</h3>;
    }
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
    const actionButtons = (
      <CTA
        label="Create Time Point"
        buttonClass="btn btn-default"
        onUserInput={this.createTimepoint}
      />
    );
    return (
      <div>
        {actionButtons}
        {cards}
      </div>
    );
  }
}
window.addEventListener('load', () => {
  const candID = location.href.split('/')[3];
  ReactDOM.render(
    <CandidateProfileIndex
      dataURL = {`${loris.BaseURL}/${candID}/?format=json`}
    />,
    document.getElementById('lorisworkspace')
  );
});
