// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { channels as SlackChannels } from 'slack';

import { Button } from '../Button';

type ChannelsData = {
  name: string,
  key: string,
};

type Props = {
  userToken: ?string,
  userIds: (string | null)[],
  channelsData: ChannelsData[],
  onSave: ({ key: string, id: string }) => void,
};

type State = {

};

export default class ChannelsCreator extends React.PureComponent<Props, State> {
  @autobind
  onCreateChannel() {
    const { channelsData, userToken, userIds = [] } = this.props;
    if (channelsData && channelsData.length && userToken) {
      // RTM.connect({ token: btoa(userToken) }).then((data) => {
      // console.log(data);
      channelsData.forEach((c) => {
        SlackChannels.create({ token: userToken, name: c.name }).then((data) => {
          this.props.onSave({ key: c.key, id: data.channel.id });
          userIds.forEach((u) => {
            if (u) SlackChannels.invite({ token: userToken, channel: data.channel.id, user: u });
          });
        }).catch(console.error);
      });
      // }).catch(console.error);
    }
  }

  render() {
    return (
      <div className='create-channels'>
        <span>
          Hey!! There are no channels yet, should we create an internal and a public channel?
        </span>
        <Button
          strain='secondary'
          size='regular'
          onClick={this.onCreateChannel}
        >
          Let's do this!!!
        </Button>
      </div>
    );
  }
}
