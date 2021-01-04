import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Icon, Input, Menu, Modal } from 'semantic-ui-react';
import { setCurrentChannel } from '../../actions';
import firebase from '../../firebase';

const Channels = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentChannel } = useSelector((state) => state.channel);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    channels: [],
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    modal: false,
    firstLoad: true,
    activeChannel: '',
  });

  const { channels, channelName, channelDetails, channelsRef, modal } = state;

  useEffect(() => {
    addListeners();
    setFirstChannel(channels);
    return () => {
      removeListeners();
    };
  }, [channels]);

  const addListeners = () => {
    let loadedChannels = [];
    channelsRef.on('child_added', (snap) => {
      loadedChannels.push(snap.val());
      setState({
        ...state,
        channels: loadedChannels,
      });
    });
  };

  const removeListeners = () => {
    channelsRef.off();
  };

  const setFirstChannel = () => {
    if (state.firstLoad && channels.length > 0) {
      const firstChannel = channels[0];
      changeChannel(firstChannel);
      setState({
        ...state,
        firstLoad: false,
      });
    }
  };

  const closeModal = () => {
    setState({
      ...state,
      modal: false,
    });
  };

  const openModal = () => {
    setState({
      ...state,
      modal: true,
    });
  };

  const addChannel = () => {
    const { channelsRef, channelName, channelDetails } = state;
    const key = channelsRef.push().key;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        setState({
          ...state,
          channelName: '',
          channelDetails: '',
        });
        closeModal();
        console.log('channel added');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid(state)) {
      addChannel();
    }
  };

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  // const setActiveChannel = (channel) => {
  //   setState({
  //     ...state,
  //     activeChannel: channel.id,
  //   });
  // };

  const changeChannel = (channel) => {
    //setActiveChannel(channel);
    dispatch(setCurrentChannel(channel));
  };

  const displayChannels = () =>
    channels.length > 0 &&
    channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => changeChannel(channel)}
        name={channelName}
        style={{ opacity: 0.7 }}
        active={currentChannel && channel.id === currentChannel.id}
      >
        # {channel.name}
      </Menu.Item>
    ));

  const isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  return (
    <React.Fragment>
      <Menu.Menu style={{ paddingBottom: '2em' }}>
        <Menu.Item>
          <span>
            <Icon name='exchange' /> CHANNELS
          </span>{' '}
          ({channels.length}) <Icon name='add' onClick={openModal} />
        </Menu.Item>
        {displayChannels()}
      </Menu.Menu>

      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input
                fluid
                label='Name of Channel'
                name='channelName'
                onChange={handleChange}
                value={channelName}
              />
            </Form.Field>
            <Form.Field>
              <Input
                fluid
                label='About the Channel'
                name='channelDetails'
                onChange={handleChange}
                value={channelDetails}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={handleSubmit} inverted>
            <Icon name='checkmark' /> Add
          </Button>
          <Button color='red' inverted onClick={closeModal}>
            <Icon name='remove' /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </React.Fragment>
  );
};

export default Channels;
