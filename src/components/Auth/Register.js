import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import md5 from 'md5';
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

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users'),
  });

  const {
    username,
    email,
    password,
    passwordConfirmation,
    errors,
    loading,
  } = formData;

  const isFormValid = () => {
    let errors = [];
    let error;
    if (isFormEmpty(formData)) {
      error = {
        message: 'Fill in all fields',
      };
      setFormData({
        ...formData,
        errors: errors.concat(error),
      });
      return false;
    } else if (!isPasswordValid(formData)) {
      error = { message: 'Password is invalid' };
      setFormData({
        ...formData,
        errors: errors.concat(error),
      });
      return false;
    } else {
      return true;
    }
  };

  const isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  const isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  const displayErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      setFormData({
        ...formData,
        errors: [],
        loading: true,
      });
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((createdUser) => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            .then(() => {
              saveUser(createdUser).then(() => {
                console.log('User saved');
              });
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

  const saveUser = (createdUser) => {
    return formData.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
        <Header as='h2' icon color='orange' textAlign='center'>
          <Icon name='puzzle piece' color='orange' />
          Register for DevChat
        </Header>
        <Form size='large' onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              name='username'
              icon='user'
              iconPosition='left'
              placeholder='Username'
              onChange={handleChange}
              type='text'
              value={username}
              className={handleInputError(errors, 'username')}
            />
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
            <Form.Input
              fluid
              name='passwordConfirmation'
              icon='repeat'
              iconPosition='left'
              placeholder='Password Confirmation'
              onChange={handleChange}
              type='password'
              value={passwordConfirmation}
              className={handleInputError(errors, 'password')}
            />
            <Button
              color='orange'
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
          Already a user? <Link to='/login'>Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
