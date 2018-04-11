// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { channels as SlackChannels, rtm as RTM } from 'slack';

import { Button } from '../Button';

type ChannelsData = {
  name: string,
  key: string,
};

type Props = {
  userToken: ?string,
  channelsData: ChannelsData[],
  onSave: ({ key: string, id: string }) => void,
};

type State = {

};

export default class ChannelsCreator extends React.PureComponent<Props, State> {
  @autobind
  onCreateChannel() {
    const { channelsData, userToken } = this.props;
    if (channelsData && channelsData.length && userToken) {
      // RTM.connect({ token: btoa(userToken) }).then((data) => {
      // console.log(data);
      channelsData.forEach((c) => {
        SlackChannels.create({ token: userToken, name: c.name }).then((data) => {
          this.props.onSave({ key: c.key, id: data.channel.id });
        }).catch(console.error);
      });
      // }).catch(console.error);
    }
  }

  render() {
    return (
      <div className='create-channels'>
        <Button
          strain='secondary'
          size='small'
          onClick={this.onCreateChannel}
        >
          Create channels
        </Button>
      </div>
    );
  }
}
