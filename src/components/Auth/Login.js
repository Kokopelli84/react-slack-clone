import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Segment,
} from 'semantic-ui-react';
import firebase from '../../firebase';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    errors: [],
    loading: false,
  });

  const { email, password, errors, loading } = formData;

  const displayErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid(formData)) {
      setFormData({
        ...formData,
        errors: [],
        loading: true,
      });
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((signedInUser) => {
          console.log(signedInUser);
          setFormData({
            ...formData,
            errors: [],
            loading: false,
          });
        })
        .catch((err) => {
          console.error(err);
          setFormData({
            ...formData,
            errors: [err],
            loading: false,
          });
        });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid = ({ email, password }) => email && password;

  const handleInputError = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? 'error'
      : '';
  };

  return (
    <Grid textAlign='center' verticalAlign='middle' className='app'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' icon color='violet' textAlign='center'>
          <Icon name='code branch' color='violet' />
          Login to DevChat
        </Header>
        <Form size='large' onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              name='email'
              icon='mail'
              iconPosition='left'
              placeholder='Email Address'
              onChange={handleChange}
              type='email'
              value={email}
              className={handleInputError(errors, 'email')}
            />
            <Form.Input
              fluid
              name='password'
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              onChange={handleChange}
              type='password'
              value={password}
              className={handleInputError(errors, 'password')}
            />
            <Button
              color='violet'
              fluid
              size='large'
              disabled={loading}
              className={loading ? 'loading' : ''}
            >
              Submit
            </Button>
          </Segment>
        </Form>
        {formData.errors.length > 0 && (
          <Message error>
            <h3>Error</h3>
            {displayErrors(errors)}
          </Message>
        )}
        <Message>
          Don't have an account? <Link to='/login'>Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
