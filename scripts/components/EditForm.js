import React,{ Component } from "react";
import { Link } from "react-router";
import Form from "react-jsonschema-form";

export default class EditForm extends Component {
  componentDidMount() {
    this.props.select(this.props.params.name);
    this.props.loadRecord(this.props.params.id);
  }

  onSubmit(data) {
    this.props.formDataReceived(data.formData);
    this.props.submitForm();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.name && nextProps.schema && nextProps.form;
  }

  componentWillUnmount() {
    this.props.unloadRecord();
  }

  render() {
    const {name, form, schema, uiSchema} = this.props;
    return (
      <div>
        <h1>{name}</h1>
        <p>
          <Link to={`/collections/${name}`}>&laquo; Back</Link>
        </p>
        {form.record &&
          <Form
            formData={form.formData}
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={this.onSubmit.bind(this)} />}
      </div>
    );
  }
}
