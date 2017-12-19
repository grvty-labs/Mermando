// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { Button } from '../Button';
import { Input } from '../Inputs';

type Channel = {
  id: number | string,
  name: string,
  connection: string,
  legend: string,
};
export type StoreProps = {
  channels: Array<Channel>,
};
export type Actions = {};
type Props = StoreProps & Actions;
type State = {
  // selectedChannel: number | string,
};

export default class Chat extends React.PureComponent<Props, State> {
  state: State = {};

  @autobind
  renderChannel(channel: Channel, index: number) {
    return (
      <Button key={channel.id} size='small' className={index === 0 ? 'selected' : ''}>
        {channel.name}
      </Button>
    );
  }

  render() {
    const { channels } = this.props;
    return (
      <div className='chat-wrapper'>
        <div className='chat'>

          <div className='channels-wrapper'>
            <span className='legend'>Channels</span>
            { channels.map(this.renderChannel) }
          </div>

          <div className='content'>
            <span className='legend'>{channels[0].legend}</span>
            <div className='messages-wrapper'>
              {/* Empty */}
            </div>
            <Input
              id='message'
              placeholder='Write your message…'
              type='textarea'
              value=''
              onChange={() => {}}
            />
            <div className='footer'>
              <Button type='link' size='regular'>Attach File</Button>
              <Button type='main' size='big'>Send</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
