import Button from '@material-ui/core/Button/Button';
import TextField from '@material-ui/core/TextField/TextField';
import * as _ from 'lodash';
import * as React from "react";
import { ChangeEvent } from 'react';
import styled from 'styled-components';
import { LogSelectMenu } from './log-select-menu';

interface IProps {
  connected?: boolean;
  onConnect: (url: string) => void;
  onDisconnect: () => void;
  url?: string;
}

interface IState {
  url: string;
  log: string[];
}

const ConnectContainer = styled.div`
  display: flex;
`;
const ConnectInput = styled.div`
  flex-grow: 1;
`;
const ConnectButton = styled.div`
  display: flex;
  align-items: flex-end;
`;

export class Connect extends React.Component<IProps, IState> {
  public state: IState = {
    log: [],
    url: 'ws://echo.websocket.org',
  };

  constructor(props: IProps) {
    super(props);
    if (props.url) {
      this.state.url = props.url;
    }
    const log = localStorage.getItem('connect-log');
    if (log) {
      this.state.log = JSON.parse(log);
    }
  }

  public onConnect = () => {
    this.props.onConnect(this.state.url);
    const newLog = _([this.state.url, ...this.state.log]).uniq().take(10).value();
    this.setState({
      log: newLog,
    });
    localStorage.setItem('connect-log', JSON.stringify(newLog));
  };

  public render() {
    const {connected = false} = this.props;
    return <ConnectContainer>
      <ConnectInput>
        <TextField
          id="url"
          label="Url"
          disabled={connected}
          onChange={this.onChangeUrl}
          value={this.state.url}
          fullWidth={true}
        />
      </ConnectInput>
      <LogSelectMenu
        id="connect-log-menu"
        options={this.state.log}
        onChange={this.onSelectOldUrl}
        disabled={connected}
      />
      <ConnectButton>
        {connected ?
          <Button onClick={this.props.onDisconnect}>Disconnect</Button> :
          <Button color="primary" onClick={this.onConnect}>Connect</Button>
        }
      </ConnectButton>
    </ConnectContainer>;
  }

  private onChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({url: e.target.value});
  };

  private onSelectOldUrl = (url: string) => {
    this.setState({url});
  }
}
