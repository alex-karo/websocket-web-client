import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import HistoryIcon from '@material-ui/icons/History';
import * as React from 'react';

const ITEM_HEIGHT = 48;

interface IProps {
  options: string[];
  id: string;
  onChange: (text: string) => void;
}

interface IState {
  anchorEl: any;
}

export class LogSelectMenu extends React.Component<IProps, IState> {
  public state = {
    anchorEl: null,
  };

  public handleClick = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  public handleClose = () => {
    this.setState({ anchorEl: null });
  };

  public handleChange = (option: string) => () => {
    this.setState({ anchorEl: null });
    this.props.onChange(option);
  };

  public render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <IconButton
          onClick={this.handleClick}
          disabled={this.props.options.length === 0}
        >
          <HistoryIcon />
        </IconButton>
        <Menu
          id={this.props.id}
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 400,
            },
          }}
        >
          {this.props.options.map(option => (
            <MenuItem key={option} onClick={this.handleChange(option)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}
