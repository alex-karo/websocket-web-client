import Button from '@material-ui/core/Button/Button';
import TextField from '@material-ui/core/TextField/TextField';
import * as React from "react";
import { ChangeEvent } from 'react';
import styled from 'styled-components';

interface IProps {
  connected?: boolean;
  onConnect: (url: string) => void;
  onDisconnect: () => void;
  url?: string;
}

interface IState {
  url: string;
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
  public state = {
    url: 'ws://echo.websocket.org',
  };

  constructor(props: IProps) {
    super(props);
    if (props.url) {
      this.state.url = props.url;
    }
  }

  public onConnect = () => {
    this.props.onConnect(this.state.url);
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
}
