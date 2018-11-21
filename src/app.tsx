import Paper from '@material-ui/core/Paper/Paper';
import * as _ from 'lodash';
import * as pako from 'pako';
import * as React from "react";
import styled, { createGlobalStyle } from 'styled-components';
import { CodeEditor } from './code-editor';
import { Connect } from './connect';
import { MessageLog } from './message-log';
import { SendMessage } from './send-message';

const AppContainer = styled.main`
  margin: auto;
  width: 1400px;
  display: grid;
  grid-template-columns: 900px 500px;
  grid-column-gap: 10px;
`;

const MainContainer = styled.section`
  padding: 1rem;
`;

const SideContainer = styled.section`
  padding: 1rem;
`;

// language=CSS
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    padding-top: 1rem;
    background-color: #FAFAFA;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  }
`;

type MessageType = 'in' | 'out' | 'error' | 'info';

export interface IMessage {
  time: number;
  content: string;
  type: MessageType;
}

interface IState {
  connected: boolean;
  messages: IMessage[];
  // @ts-ignore
  mutatorFunc?: (props) => string;
}

export class App extends React.Component<{}, IState> {
  public state: IState = {
    connected: false,
    messages: [],
  };
  private ws?: WebSocket;

  constructor(props: {}) {
    super(props);
  }

  public render() {
    const {messages, connected, mutatorFunc} = this.state;
    const changedMessages: IMessage[] = messages.map(({time, type, content}) => {
      let mutatedContent;
      try {
        mutatedContent = mutatorFunc && type === 'in' ?
          _.toString(mutatorFunc({data: content, _, pako})) :
          content;
      } catch (e) {
        mutatedContent = `Error: ${e}`;
      }
      return {
        content: mutatedContent,
        time,
        type,
      };
    });
    return <AppContainer>
      <MainContainer as={Paper}>
        <Connect
          connected={connected}
          onConnect={this.connectToServer}
          onDisconnect={this.disconnectFromServer}
        />
        <SendMessage
          onSendMessage={this.onSendMessage}
          connected={connected}
        />
        <MessageLog messages={changedMessages}/>
        <GlobalStyle/>
      </MainContainer>
      <SideContainer as={Paper}>
        <CodeEditor
          title="Input data mutator"
          onChange={this.changeMutatorFunction}
          defaultCode={'const {data, pako, _} = props;\n\n// Write code here\nlet res = data;\n\nreturn res;'}
        />
      </SideContainer>
    </AppContainer>;
  }

  private changeMutatorFunction = (text: string) => {
    try {
      // @ts-ignore
      const func = new Function('props', text);
      // @ts-ignore
      this.setState({mutatorFunc: func});
    } catch (e) {
      this.setState({mutatorFunc: undefined});
    }
  };

  private connectToServer = (url: string) => {
    const ws = new WebSocket(url);
    ws.onmessage = this.onMessage;
    ws.onclose = this.onConnectionClose;
    ws.onerror = this.onError;
    ws.onopen = (event) => {
      this.ws = ws;
      this.setState({connected: true});
      this.addMessage('info', 'Connected');
    };

  };

  private disconnectFromServer = () => {
    if (!this.ws) {
      return;
    }
    this.ws.close(1000);

  };

  private onMessage = (e: MessageEvent) => {
    this.setState({messages: [{time: Date.now(), content: e.data, type: 'in'}, ...this.state.messages]});
  };

  private onSendMessage = (data: string) => {
    if (!this.ws) {
      return;
    }
    this.ws.send(data);
    this.setState({messages: [{time: Date.now(), content: data, type: 'out'}, ...this.state.messages]});
  };

  private onError = (e: Event) => {
    this.addMessage('error', e);
  };

  private onConnectionClose = (e: CloseEvent) => {
    this.addMessage('info', `Connection closed with code #${e.code}: ${e.reason}`);
    delete this.ws;
    this.setState({connected: false});
  };

  private addMessage = (type: MessageType, data: any) => {
    this.setState({messages: [{time: Date.now(), content: data, type}, ...this.state.messages]});
  };
}
