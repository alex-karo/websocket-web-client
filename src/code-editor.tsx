import 'brace';
import 'brace/mode/javascript';
import 'brace/theme/github';
import * as _ from 'lodash';
import * as React from "react";
import AceEditor from 'react-ace';
import styled from 'styled-components';

const CodeContainer = styled.div`
overflow: hidden;
border-radius: 3px;
`;

const CodeTitle = styled.div`
font-size: 14px;
text-transform: uppercase;
margin-bottom: .5rem;
`;

interface IProps {
  defaultCode?: string;
  onChange: (code: string) => void;
  title?: string;
}

interface IState {
  code?: string;
  valid: boolean;
}

export class CodeEditor extends React.PureComponent<IProps, IState> {
  public state: IState = {valid: false};
  constructor(props: IProps) {
    super(props);
    this.state.code = props.defaultCode;
    this.handlePropsOnChange = _.debounce(this.handlePropsOnChange, 2000);
  }

  public onCodeChange = (text: string) => {
    this.setState({code: text});
    if (this.state.valid) {
      this.handlePropsOnChange(text);
    }
  };

  public handlePropsOnChange = (text: string) => {
    this.props.onChange(text);
  };

  // @ts-ignore
  public onValidation = (annotations) => {
    const seriousErrors = _.filter(annotations, ['type', ['error', 'warning']]);
    if (seriousErrors.length > 0) {
      this.setState({valid: false});
    } else {
      this.setState({valid: true});
    }
  };

  public render() {
    return <div>
      {this.props.title ?
        <CodeTitle>{this.props.title}</CodeTitle> :
        null}
        <CodeContainer>
          <AceEditor
            mode="javascript"
            theme="github"
            onChange={this.onCodeChange}
            onValidate={this.onValidation}
            name="mutator"
            width="470px"
            value={this.state.code}
            editorProps={{$blockScrolling: true}}
          />
        </CodeContainer>
    </div>;
  }
}
