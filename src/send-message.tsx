import Button from '@material-ui/core/Button/Button';
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import TextField from '@material-ui/core/TextField/TextField';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/github';
import _ from 'lodash';
import * as React from "react";
import { ChangeEvent } from 'react';
import AceEditor from 'react-ace';
import styled from 'styled-components';
import { LogSelectMenu } from './log-select-menu';

interface IProps {
  onSendMessage: (msg: string) => void;
  connected?: boolean;
}

interface IState {
  message: string;
  isJson: boolean;
  log: string[];
}

const SendContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  margin-bottom: 1rem;
`;
const SendInput = styled.div`
  flex-grow: 1;
  margin-right: 1rem;
`;
const SendButton = styled.button`
  display: block;
`;
const SendControl = styled.div`
  width: 150px;
  text-align: right;
`;
const SendCheckbox = styled.div``;
const MessageHint = styled.div`
  font-size: .75em;
  color: rgba(0, 0, 0, 0.54);
  margin-bottom: .3em;
`;

export class SendMessage extends React.PureComponent<IProps, IState> {
  public state: IState = {
    isJson: true,
    log: [],
    message: '',
  };

  constructor(props: IProps) {
    super(props);
    const log = localStorage.getItem('out-message-log');
    if (log) {
      this.state.log = JSON.parse(log);
    }
  }

  public onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    this.onChangeMessage(e.target.value);
  };

  public onChangeMessage = (msg: string) => {
    this.setState({message: msg});
  };

  public onSendMessage = () => {
    this.props.onSendMessage(this.state.message);
    const newLog = _([this.state.message, ...this.state.log]).uniq().take(10).value();
    this.setState({
      log: newLog,
      message: '',
    });
    localStorage.setItem('out-message-log', JSON.stringify(newLog));
  };

  public onChangeMessageType = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({isJson: e.target.checked});
  };

  public render() {
    const {connected = false} = this.props;
    return <SendContainer>
      <SendInput>
        {this.state.isJson ?
          <div>
            <MessageHint>Message</MessageHint>
            <AceEditor
              mode="json"
              theme="github"
              onChange={this.onChangeMessage}
              name="json-message-input"
              height="70px"
              width="100%"
              value={this.state.message}
              editorProps={{$blockScrolling: true}}
              readOnly={!connected}
              highlightActiveLine={false}
              showPrintMargin={false}
            />
          </div>
          :
          <TextField
            id="message"
            label="Message"
            disabled={!connected}
            onChange={this.onChangeInput}
            value={this.state.message}
            fullWidth={true}
            multiline={true}
          />
        }
      </SendInput>
      <SendControl>
        <SendButton
          as={Button}
          disabled={!connected || !this.state.message}
          color="primary"
          onClick={this.onSendMessage}
        >
          Send
        </SendButton>
        <SendCheckbox>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.isJson}
                onChange={this.onChangeMessageType}
                value="isJson"
                disabled={!connected}
              />
            }
            label="JSON"
          />
        </SendCheckbox>
        <LogSelectMenu
          id="message-log-menu"
          options={this.state.log}
          onChange={this.onChangeMessage}
          disabled={!connected}
        />
      </SendControl>
    </SendContainer>;
  }
}
