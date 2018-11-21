import Button from '@material-ui/core/Button/Button';
import TextField from '@material-ui/core/TextField/TextField';
import * as React from "react";
import { ChangeEvent } from 'react';
import styled from 'styled-components';

interface IProps {
  onSendMessage: (msg: string) => void;
  connected?: boolean;
}

interface IState {
  message: string;
}

const SendContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  margin-bottom: 1rem;
`;
const SendInput = styled.div`
  flex-grow: 1;
`;
const SendButton = styled.div`
  display: flex;
  align-items: flex-end;
`;

export class SendMessage extends React.PureComponent<IProps, IState> {
  public state: IState = {
    message: '',
  };

  public onChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({message: e.target.value});
  };

  public onSendMessage = () => {
    this.props.onSendMessage(this.state.message);
  };

  public render() {
    const {connected = false} = this.props;
    return <SendContainer>
      <SendInput>
        <TextField
          id="message"
          label="Message"
          disabled={!connected}
          onChange={this.onChangeMessage}
          value={this.state.message}
          fullWidth={true}
        />
      </SendInput>
      <SendButton>
        <Button disabled={!connected || !this.state.message} color="primary" onClick={this.onSendMessage}>Send</Button>
      </SendButton>
    </SendContainer>;
  }
}
