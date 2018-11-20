import * as React from "react";
import styled from "styled-components";
import { IMessage } from './app';

interface IProps {
  messages: IMessage[];
}

const MessagesContainer = styled.div`
  max-height: 500px;
  padding: 1rem;
  overflow-y: auto;
`;

const MessageItem = styled.div`
  display: flex;
  margin-bottom: .5rem;
`;

const MessageType = styled.div`
  width: 50px;
  color: #c3c3c3;
`;

const MessageTime = styled.div`
  width: 100px;
`;

const MessageContent = styled.div`
  max-width: calc(100% - 100px - 50px);
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export class MessageLog extends React.Component<IProps> {
  public render(): React.ReactNode {
    const {messages} = this.props;
    return <MessagesContainer>
      {messages.map(({type, time, content}) =>
        <MessageItem key={time}>
          <MessageType>[{type}]</MessageType>
          <MessageTime>{new Date(time).toLocaleTimeString()}</MessageTime>
          <MessageContent>{content}</MessageContent>
        </MessageItem>
      )}
    </MessagesContainer>;
  }
}
